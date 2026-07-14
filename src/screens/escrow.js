// Escrow.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../escrow.css"; // make sure path matches

const API_BASE_URL = process.env.REACT_APP_DOMAIN || "";

/* small helpers copied/adjusted from Listings */
const normalizeState = (s) => (s ? String(s).toLowerCase() : "other");
const sanitizePhoneForWhatsapp = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d]/g, "");
  return digits || null;
};

/* Robust image normalization */
const makeImageUrl = (value) => {
  if (!value) return null;
  try {
    if (typeof value === "string") {
      if (/^https?:\/\//i.test(value)) return value;
      if (API_BASE_URL) return `${API_BASE_URL.replace(/\/$/, "")}/${String(value).replace(/^\//, "")}`;
      return value;
    }
    if (typeof value === "object") {
      if (value.secure_url) return value.secure_url;
      if (value.url) return value.url;
      if (value.path) {
        if (API_BASE_URL) return `${API_BASE_URL.replace(/\/$/, "")}/${String(value.path).replace(/^\//, "")}`;
        return value.path;
      }
      if (value.public_id) {
        // cloudinary-ish
        return value.url || `${API_BASE_URL.replace(/\/$/, "")}/${String(value.public_id).replace(/^\//, "")}`;
      }
    }
  } catch (e) {}
  return null;
};

/* unwraps weird mongo numbers/dates and returns a useful primitive or string */
const unwrapValue = (v) => {
  if (v === null || typeof v === "undefined") return null;
  // BSON number wrappers
  if (typeof v === "object") {
    // $numberInt / $numberLong / $numberDecimal
    if ("$numberInt" in v) return Number(v.$numberInt);
    if ("$numberLong" in v) return Number(v.$numberLong);
    if ("$numberDecimal" in v) return Number(v.$numberDecimal);
    if ("$date" in v) {
      const d = v.$date;
      if (typeof d === "object" && "$numberLong" in d) return new Date(Number(d.$numberLong));
      if (typeof d === "number") return new Date(d);
      if (typeof d === "string") return new Date(d);
    }
    // if object with url or public_id treat as image-like
    if (v.url) return v.url;
    // arrays
    if (Array.isArray(v)) return v;
    // fallback - stringify small objects
    try {
      return JSON.stringify(v);
    } catch (e) {
      return String(v);
    }
  }
  return v;
};

/* Safe field lookup across candidate keys */
const getField = (obj = {}, candidates = [], fallback = "Not provided") => {
  for (const k of candidates) {
    if (!k) continue;
    const parts = k.split?.(".") ?? [k];
    let val = obj;
    let ok = true;
    for (const p of parts) {
      if (val && typeof val === "object" && (p in val)) {
        val = val[p];
      } else {
        ok = false;
        break;
      }
    }
    if (ok && (val !== null && typeof val !== "undefined" && String(val).trim?.() !== "")) return unwrapValue(val);
  }
  return fallback;
};

/* format visit date/time and return status */
const formatVisit = (visitDateRaw, visitTimeRaw) => {
  if (!visitDateRaw && !visitTimeRaw) return { text: "TBD", status: "tbd" };
  const dateStr = visitDateRaw ? String(visitDateRaw).trim() : "";
  const timeStr = visitTimeRaw ? String(visitTimeRaw).trim() : "";
  let dt = null;
  if (dateStr) {
    try {
      dt = new Date(dateStr);
      if (isNaN(dt.getTime())) dt = null;
    } catch (e) { dt = null; }
  }
  if (dt && timeStr) {
    try {
      const combined = `${dateStr} ${timeStr}`;
      const dt2 = new Date(combined);
      if (!isNaN(dt2.getTime())) dt = dt2;
    } catch (e) {}
  }
  if (!dt) {
    if (timeStr && !dateStr) return { text: `Time: ${timeStr}`, status: "tbd" };
    return { text: "TBD", status: "tbd" };
  }
  const now = new Date();
  const dtMid = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  let status = dtMid === nowMid ? "today" : (dtMid < nowMid ? "past" : "upcoming");
  const timeFormatted = dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const dateFormatted = dt.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  const text = timeFormatted ? `${dateFormatted} • ${timeFormatted}` : dateFormatted;
  return { text, status };
};

const VISIBLE_STATES = ["awaitingtour", "tourconfirmed"];

export const Escrow = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [texttype, setTypeText] = useState("");
  const [filteredText, setFilteredText] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeStateFilter, setActiveStateFilter] = useState(null);
  const [releaseModal, setReleaseModal] = useState({ open: false, propertyId: null });
  const [releaseInput, setReleaseInput] = useState("");
  const [releaseFeedback, setReleaseFeedback] = useState(null); // null | { type:'warn'|'ok'|'error', text: string }

  const socketRef = useRef(null);
  const modalTimerRef = useRef(null);

  /* helper to find property object locally by id */
  const findLocalProperty = (pid) => {
    if (!pid) return null;
    return properties.find((p) => String(p._id) === String(pid) || String(p.id) === String(pid));
  };

  /* try to extract tenant/landlord id from property object robustly */
  const extractParticipantIdsFromProperty = (prop) => {
    if (!prop || typeof prop !== "object") return { tenant: null, landlord: null };
    let tenant = null;
    let landlord = null;

    // tenant candidate locations
    const tenantCandidates = ["tenant", "tenantId", "tenant_id", "propertytenant", "buyer", "renter"];
    for (const k of tenantCandidates) {
      if (k in prop && prop[k]) {
        const v = prop[k];
        if (typeof v === "string") tenant = v;
        else if (typeof v === "object") tenant = v._id || v.id || v.$oid || null;
        if (tenant) break;
      }
    }

    // also try last tour entry's tenant
    if (!tenant && Array.isArray(prop.propertytour) && prop.propertytour.length > 0) {
      const last = prop.propertytour[prop.propertytour.length - 1];
      if (last) {
        const v = last.tenant || last.tenantId || last.tenant_id || null;
        if (typeof v === "string") tenant = v;
        else if (typeof v === "object") tenant = v._id || v.id || v.$oid || null;
      }
    }

    // landlord candidate locations
    const landlordCandidates = ["landlord", "landlordId", "landlord_id", "owner", "agent"];
    for (const k of landlordCandidates) {
      if (k in prop && prop[k]) {
        const v = prop[k];
        if (typeof v === "string") landlord = v;
        else if (typeof v === "object") landlord = v._id || v.id || v.$oid || null;
        if (landlord) break;
      }
    }

    // fallback common patterns
    if (!landlord && prop.owner) {
      const v = prop.owner;
      landlord = typeof v === "string" ? v : (v._id || v.id || v.$oid || null);
    }

    return { tenant: tenant ? String(tenant) : null, landlord: landlord ? String(landlord) : null };
  };

  /* attempt to delete conversation messages between tenant and landlord like chat.deleteMessages */
  const attemptDeleteConversationForProperty = async (pid) => {
    try {
      const prop = findLocalProperty(pid);
      if (!prop) {
        // attempt to fetch property from server to discover participants
        const res = await axios.get(`${API_BASE_URL.replace(/\/$/, "")}/house/${pid}`).catch(() => null);
        if (res && res.data) {
          const ids = extractParticipantIdsFromProperty(res.data);
          if (ids.tenant && ids.landlord) {
            // try delete both directions (server might expect tenantId/landlordId or vice-versa)
            await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/${ids.tenant}/${ids.landlord}`).catch(() => null);
            await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/${ids.landlord}/${ids.tenant}`).catch(() => null);
            return true;
          }
        }
        return false;
      }

      const ids = extractParticipantIdsFromProperty(prop);
      if (!ids.tenant || !ids.landlord) {
        // nothing we can safely delete
        return false;
      }

      // try standard delete endpoint used by chat
      await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/${ids.tenant}/${ids.landlord}`).catch(() => null);
      await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/${ids.landlord}/${ids.tenant}`).catch(() => null);

      return true;
    } catch (e) {
      console.warn("attemptDeleteConversationForProperty error", e);
      return false;
    }
  };

  /* load properties */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get(`${API_BASE_URL}/house/`)
      .then(({ data }) => {
        if (!mounted) return;
        setProperties(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load escrow properties:", err);
        setProperties([]);
      })
      .finally(() => { if (mounted) setLoading(false); });

    socketRef.current = io(API_BASE_URL, { transports: ["websocket"], upgrade: false, secure: true });
    socketRef.current.on("connect", () => {});
    socketRef.current.on("disconnect", () => {});
    socketRef.current.on("getproduct", (newTxn) => setProperties((prev) => [newTxn, ...prev]));
    socketRef.current.on("approved", (app) => setProperties((prev) => prev.map(p => p._id === app._id ? { ...p, ...app } : p)));
    socketRef.current.on("rejected", (rej) => setProperties((prev) => prev.map(p => p._id === rej._id ? { ...p, ...rej } : p)));

    return () => {
      mounted = false;
      try { socketRef.current?.disconnect?.(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const q = (texttype || "").trim().toLowerCase();
    if (!q) { setFilteredText([]); return; }
    const f = properties.filter((prop) => {
      const name = String(prop.propertyname || "").toLowerCase();
      const loc = String(prop.propertylocation || "").toLowerCase();
      const id = String(prop.propertyid || "").toLowerCase();
      return name.includes(q) || loc.includes(q) || id.includes(q);
    });
    setFilteredText(f);
  }, [texttype, properties]);

  /* data to show limited to the two states */
  const dataToShow = (filteredText.length > 0 ? filteredText : properties).filter(p => {
    const st = normalizeState(p.propertystate);
    if (!VISIBLE_STATES.includes(st)) return false;
    if (activeStateFilter) return st === activeStateFilter;
    return true;
  });

  const counts = useMemo(() => {
    const map = {};
    for (const s of VISIBLE_STATES) {
      map[s] = properties.filter((p) => normalizeState(p.propertystate) === s).length;
    }
    return map;
  }, [properties]);

  /* modal helpers (listing modal should match Listings modal design) */
  const openModal = (listing) => {
    setSelectedListing(listing);
    setModalLoading(true);
    clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => setModalLoading(false), 250);
  };
  const closeModal = () => {
    clearTimeout(modalTimerRef.current);
    setSelectedListing(null);
    setModalLoading(false);
  };

  const openImageModal = (src) => { setPreviewSrc(src); setShowImageModal(true); };
  const closeImageModal = () => setShowImageModal(false);

  /* Release escrow modal control */
  const openReleaseModal = (propertyId) => {
    setReleaseInput("");
    setReleaseFeedback(null);
    setReleaseModal({ open: true, propertyId });
  };
  const closeReleaseModal = () => {
    setReleaseModal({ open: false, propertyId: null });
    setReleaseInput("");
    setReleaseFeedback(null);
  };

  /* Auto-detect Answer behavior:
     - accept 'yes' or 'no' (case-insensitive)
     - if valid, call API and close modal immediately (no submit button)
     - invalid input (>3 chars or not yes/no) will show warning and not call API
  */
  useEffect(() => {
    if (!releaseModal.open) return;
    const val = String(releaseInput || "").trim();
    if (val.length === 0) { setReleaseFeedback(null); return; }
    const lower = val.toLowerCase();
    const pid = releaseModal.propertyId;
    if (lower === "yes") {
      setReleaseFeedback({ type: "ok", text: "Releasing escrow… (applying owner-accepted flow)" });

      // Perform same effect as chat.acceptDeal: set property to owneraccepted
      axios.put(`${API_BASE_URL.replace(/\/$/, "")}/house/${pid}`, { propertystate: "rented" })
        .then(({ data }) => {
          // Update local properties: conservative merge
          setProperties(prev => prev.map(p => {
            if (String(p._id) !== String(pid)) return p;
            const copy = { ...p, propertystate: "rented", _escrowReleased: true };
            if (Array.isArray(copy.propertytour) && copy.propertytour.length > 0) {
              copy.propertytour = copy.propertytour.map((t, i) => i === copy.propertytour.length - 1 ? ({ ...t, releaseEscrow: true, releasedEscrow: true }) : t);
            }
            return copy;
          }));
          // (Do NOT delete conversation here — chat.acceptDeal doesn't remove messages.)
          setTimeout(() => { closeReleaseModal(); }, 800);
        })
        .catch((err) => {
          console.error("Escrow release -> rental failed", err);
          setReleaseFeedback({ type: "error", text: "Failed to release — try again" });
          setTimeout(() => { closeReleaseModal(); }, 800);
        });

      return;
    }

    if (lower === "no") {
      setReleaseFeedback({ type: "ok", text: "Retaining escrow… (applying cancel flow)" });

      // Perform same effect as chat.cancelDeal: set tenant null and propertystate approved
      axios.put(`${API_BASE_URL.replace(/\/$/, "")}/house/${pid}`, { tenant: null, propertystate: "approved" })
        .then(async ({ data }) => {
          // attempt to delete conversation like chat.deleteMessages()
          try {
            // We try to discover tenant & landlord ids from the local properties list (best-effort)
            const localProp = findLocalProperty(pid);
            const { tenant, landlord } = extractParticipantIdsFromProperty(localProp || data || {});
            if (tenant && landlord) {
              // call same endpoint pattern the chat uses: DELETE /messages/{tenantId}/{landlordId}
              await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/${tenant}/${landlord}`).catch(() => null);
              // also attempt reverse deletion in case server expects reverse ordering
              await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/${landlord}/${tenant}`).catch(() => null);
            } else {
              // best-effort: try generic "delete by property" endpoint if available
              await axios.delete(`${API_BASE_URL.replace(/\/$/, "")}/messages/byProperty/${pid}`).catch(() => null);
            }
          } catch (e) {
            console.warn("Attempt to delete conversation after escrow retain failed", e);
          }

          // update local properties fairly: clear tenant markers and mark approved
          setProperties(prev => prev.map(p => {
            if (String(p._id) !== String(pid)) return p;
            const copy = { ...p };
            // clear tenant on top-level if present
            if ("tenant" in copy) copy.tenant = null;
            copy.propertystate = "approved";
            if (Array.isArray(copy.propertytour) && copy.propertytour.length > 0) {
              copy.propertytour = copy.propertytour.map((t, i) => i === copy.propertytour.length - 1 ? ({ ...t, releaseEscrow: false, releasedEscrow: false }) : t);
            }
            copy._escrowReleased = false;
            return copy;
          }));

          setTimeout(() => { closeReleaseModal(); }, 800);
        })
        .catch((err) => {
          console.error("Escrow retain/cancel failed", err);
          setReleaseFeedback({ type: "error", text: "Failed to save — try again" });
          setTimeout(() => { closeReleaseModal(); }, 800);
        });

      return;
    }

    // not exact yes/no; show warning if length > 2 (per your instruction)
    if (val.length > 2) {
      setReleaseFeedback({ type: "warn", text: "Only 'Yes' or 'No' accepted — action blocked." });
      setTimeout(() => { closeReleaseModal(); }, 600);
    } else {
      setReleaseFeedback(null);
    }
  }, [releaseInput, releaseModal.open]); // eslint-disable-line

  /* ListingModal — identical visual design to your Listings modal (kept content the same) */
  const ListingModal = ({ listing, onClose, modalLoading }) =>
    ReactDOM.createPortal(
      <div className="modal-overlay fade-in" role="dialog" aria-modal="true">
        <div className="modal-container modal-premium">
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>

          {modalLoading ? (
            <div className="modal-loading">
              <div className="spinner large" />
            </div>
          ) : (
            <div className="modal-premium-grid">
              <GalleryPanel listing={listing} onPreview={openImageModal} />
              <div className="modal-premium-info">
                <h2 className="prop-title">{getField(listing, ["propertyname", "name"], "Not provided")}</h2>
                <div className="prop-submeta">
                  <div><strong>Price:</strong> KSH {getField(listing, ["propertyprice", "price"], "Not provided").toString()}</div>
                  <div><strong>Location:</strong> {getField(listing, ["propertylocation", "location", "address", "placeName"], "Not provided")}</div>
                  <div><strong>ID:</strong> {getField(listing, ["propertyid", "id"], "Not provided")}</div>
                </div>

                <div className="modal-actions-block">
                  <div className="action-group-left">
                    {getField(listing, ["landlord._id", "landlordId", "landlord"], null) ? (
                      <a className="btn btn-primary" href={`/messages/new?to=${getField(listing, ["landlord._id", "landlordId", "landlord"], "")}`}>Message</a>
                    ) : (
                      <button className="btn btn-primary disabled" title="No landlord id">Message</button>
                    )}

                    {(() => {
                      const phone = getField(listing, ["landlord.contact", "landlord.phone", "contact", "phone"], null);
                      const whatsapp = sanitizePhoneForWhatsapp(phone);
                      return whatsapp ? (
                        <a className="btn btn-outline" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${whatsapp}`}>WhatsApp</a>
                      ) : (
                        <button className="btn btn-outline disabled">WhatsApp</button>
                      );
                    })()}
                  </div>

                  <div className="action-group-right">
                    {normalizeState(listing.propertystate) !== "approved" && (
                      <button className="btn success" onClick={() => {
                        axios.put(`${API_BASE_URL}/house/approve/${listing._id}`, { approved: true, propertystate: "approved" })
                          .then(() => { onClose(); })
                          .catch((e) => console.error(e));
                      }}>Approve</button>
                    )}
                    {normalizeState(listing.propertystate) !== "rejected" && (
                      <button className="btn danger" onClick={() => {
                        axios.put(`${API_BASE_URL}/house/reject/${listing._id}`, { approved: false, propertystate: "rejected" })
                          .then(() => { onClose(); })
                          .catch((e) => console.error(e));
                      }}>Reject</button>
                    )}
                    <a className="btn neutral" href={`/property/${listing._id}`} target="_blank" rel="noopener noreferrer">Open Property Page</a>
                  </div>
                </div>

                <section className="modal-section large">
                  <h4>Description</h4>
                  <p className="description">{getField(listing, ["description", "propdesc", "details"], "No description provided.")}</p>
                </section>

                <section className="modal-section">
                  <h4>Details</h4>
                  <div className="detail-grid">
                    <div><strong>Category</strong><div>{getField(listing, ["category", "propertycategory"], "Not provided")}</div></div>
                    <div><strong>Type</strong><div>{getField(listing, ["propertytype", "type"], "Not provided")}</div></div>
                    <div><strong>Size</strong><div>{getField(listing, ["propertysize", "size", "area"], "Not provided")}</div></div>
                    <div><strong>On market</strong><div>{getField(listing, ["propertyonmarket", "onMarket"], "Not provided")}</div></div>
                    <div><strong>Access roads</strong><div>{String(getField(listing, ["propertyaccessroads", "accessroads"], "Not provided"))}</div></div>
                    <div><strong>Proximity (town)</strong><div>{getField(listing, ["propertyproximityfromnearbytown", "proximity"], "Not provided")}</div></div>
                    <div><strong>Topography</strong><div>{getField(listing, ["topography", "propertytopography"], "Not provided")}</div></div>
                    <div><strong>Soil</strong><div>{getField(listing, ["soiltype", "propertysoil", "soil"], "Not provided")}</div></div>
                  </div>
                </section>

                <section className="modal-section">
                  <h4>Amenities</h4>
                  <div className="chips-row">
                    {(() => {
                      try {
                        const raw = getField(listing, ["propertyfacilities", "propertyFacilities", "facilities"], null);
                        if (!raw) return <span className="muted">No amenities listed</span>;
                        const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
                        if (!Array.isArray(arr)) return <span className="muted">No amenities listed</span>;
                        return arr.slice(0, 20).map((a, i) => <span className="chip" key={i}>{a}</span>);
                      } catch (e) {
                        const raw = getField(listing, ["propertyfacilities", "propertyFacilities"], "");
                        const arr = typeof raw === "string" ? raw.split(",").map(s => s.trim()).filter(Boolean) : [];
                        if (arr.length === 0) return <span className="muted">No amenities listed</span>;
                        return arr.map((a, i) => <span className="chip" key={i}>{a}</span>);
                      }
                    })()}
                  </div>
                </section>

                <section className="modal-section">
                  <h4>Landlord</h4>
                  <div className="landlord-card">
                    <div className="landlord-left">
                      <div className="landlord-name">{`${getField(listing, ["landlord.firstname", "landlord.first", "landlordName", "landlord.fullname"], "")} ${getField(listing, ["landlord.lastname", "landlord.last"], "")}`.trim() || "Not provided"}</div>
                      <div className="muted">{getField(listing, ["landlord.email", "contactEmail", "email"], "Not provided")}</div>
                    </div>
                    <div className="landlord-right">
                      <div className="muted">Contact</div>
                      <div>{getField(listing, ["landlord.contact", "landlord.phone", "contact", "phone"], "Not provided")}</div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>,
      document.getElementById("modal-root") || document.body
    );

  const ImageModal = ({ src, onClose }) =>
    ReactDOM.createPortal(
      <div className="modal-overlay fade-in" onClick={onClose}>
        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>×</button>
          <img className="image-large" src={src} alt="Preview" onError={(e) => (e.target.src = "/placeholder-hero.png")} />
        </div>
      </div>,
      document.getElementById("modal-root") || document.body
    );

  /* GalleryPanel identical to Listings — compact */
  function GalleryPanel({ listing, onPreview }) {
    const allImgs = useMemo(() => {
      if (!listing?.images) return [];
      const arr = [];
      for (const key of Object.keys(listing.images)) {
        const imgs = Array.isArray(listing.images[key]) ? listing.images[key] : [listing.images[key]];
        for (const u of imgs) {
          const uri = makeImageUrl(u?.url ? u.url : u);
          if (uri) arr.push({ key, uri, raw: u });
        }
      }
      const seen = new Set();
      return arr.filter((x) => {
        if (!x.uri) return false;
        if (seen.has(x.uri)) return false;
        seen.add(x.uri);
        return true;
      });
    }, [listing]);

    const [index, setIndex] = useState(0);
    useEffect(() => setIndex(0), [listing]);
    const next = () => setIndex((i) => Math.min(i + 1, Math.max(0, allImgs.length - 1)));
    const prev = () => setIndex((i) => Math.max(0, i - 1));
    const current = allImgs[index];

    return (
      <div className="gallery-panel">
        <div className="hero-main">
          {allImgs.length > 0 ? (
            <>
              <img src={current.uri} alt={`hero-${index}`} onError={(e) => (e.target.src = "/placeholder-hero.png")} />
              <div className="hero-caption">
                <div className="hero-caption-left">
                  <div className="hero-key">{current.key}</div>
                  <div className="hero-file">{typeof current.raw === "string" ? current.raw.split("/").pop() : (current.raw?.public_id || "")}</div>
                </div>
                <div className="gallery-indicator">{index + 1} / {allImgs.length}</div>
              </div>
            </>
          ) : (
            <img src="/placeholder-hero.png" alt="placeholder" />
          )}

          <div className="gallery-controls">
            <button onClick={prev} disabled={index === 0} className="gallery-btn">‹</button>
            <button onClick={() => onPreview(current?.uri || "/placeholder-hero.png")} className="gallery-btn primary">Preview</button>
            <button onClick={next} disabled={index >= allImgs.length - 1} className="gallery-btn">›</button>
          </div>
        </div>

        <div className="thumb-row">
          {allImgs.length === 0 ? (
            <div className="thumb empty-thumb">No images</div>
          ) : allImgs.slice(0, 12).map((i, idx) => (
            <button key={idx} className={`thumb ${idx === index ? "active" : ""}`} onClick={() => setIndex(idx)}>
              <img src={i.uri} alt={`t-${idx}`} onError={(e) => (e.target.src = "/placeholder-thumb.png")} />
              <div className="thumb-label">{i.key}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* Render all non-null data fields for a property (except images & propertytour which we show separately) */
  const renderAllFields = (p) => {
    // choose keys to show in reasonable order first, then fallback to the rest
    const priority = [
      "propertyid", "propertyname", "description", "propertyprice", "currency", "yearBuilt", "propertytype",
      "category", "rentalproperty", "propertyonmarket", "propertysize", "propertyaccessroads",
      "propertyproximityfromnearbytown", "propertyproximityfromtarmacroad", "propertyrating",
      "placeName", "propertylocation", "latitude", "longitude", "tenant", "landlord", "approved",
      "createdAt", "__v"
    ];
    const shown = new Set();
    const rows = [];

    for (const k of priority) {
      if (k in p) {
        const val = unwrapValue(p[k]);
        if (val !== null && (String(val).trim?.() !== "")) {
          rows.push([k, val]);
          shown.add(k);
        }
      }
    }
    // fallback: all other keys
    for (const [k, v] of Object.entries(p)) {
      if (shown.has(k)) continue;
      if (k === "images" || k === "propertytour" || k === "propertyfacilities") continue;
      const val = unwrapValue(v);
      if (val === null) continue;
      if (typeof val === "string" && (val === "undefined" || val.trim() === "")) continue;
      rows.push([k, val]);
    }

    return (
      <div className="expanded-details all-fields">
        <div className="detail-grid expanded">
          {rows.map(([k, v]) => (
            <div key={k} className="kv">
              <strong>{k}</strong>
              <div style={{ marginTop: 6 }}>
                {Array.isArray(v) ? (
                  <div>
                    {v.length === 0 ? <span className="muted">[]</span> : v.map((it, i) => <div key={i} style={{ fontSize: 13 }}>{typeof it === "object" ? JSON.stringify(it) : String(it)}</div>)}
                  </div>
                ) : v instanceof Date ? v.toString() : (typeof v === "object" ? JSON.stringify(v) : String(v))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* Card render - no expand button; inline all needed info plus tour history front and release button if tourconfirmed */
  return (
    <div className="app-shell-escrow">
      <header className="app-header">
        <div className="header-left">
          <h1>Escrow & Tours</h1>
          <p className="sub">Properties awaiting or confirmed for tours</p>
        </div>

        <div className="header-actions">
          <input
            className="header-search"
            value={texttype}
            onChange={(e) => setTypeText(e.target.value)}
            placeholder="Search by name, location or ID..."
          />
        </div>
      </header>

      <main className="app-main">
        <aside className="left-filter">
          <div className="filter-header"><strong>Filter by tour state</strong></div>

          <div className="filter-list">
            {VISIBLE_STATES.map((s) => {
              const count = counts[s] || 0;
              return (
                <button
                  key={s}
                  className={`filter-item ${activeStateFilter === s ? "active" : ""}`}
                  onClick={() => setActiveStateFilter((v) => (v === s ? null : s))}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)} <span className="badge">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="filter-footer muted">Tip: click Details to open the full property modal (same design as Listings).</div>
        </aside>

        <section className="center-content centered">
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner large" />
              <div className="loading-text">Loading properties…</div>
            </div>
          ) : dataToShow.length === 0 ? (
            <div className="empty-wrap">
              <div className="empty-illustration">🏠</div>
              <h3>No matching listings</h3>
              <p className="muted">No properties with awaiting tour or confirmed tour match your query.</p>
            </div>
          ) : (
            <div className="groups">
              {dataToShow.map((lst) => {
                const state = normalizeState(lst.propertystate);
                const isConfirmed = state === "tourconfirmed";
                return (
                  <article className={`listing-card full`} key={lst._id}>
                    <div className="card-media" role="button" onClick={() => openModal(lst)}>
                      <img
                        src={makeImageUrl(lst.images?.frontface?.[0]) || "/placeholder-thumb.png"}
                        alt={lst.propertyname}
                        onError={(e) => (e.target.src = "/placeholder-thumb.png")}
                      />
                    </div>

                    <div className="card-body">
                      <div className="card-head">
                        <h4 className="card-title">{lst.propertyname || "—"}</h4>
                        <div className={`status-mini ${state}`}>{lst.propertystate || "—"}</div>
                      </div>

                      <div className="card-meta">
                        <div className="meta-left">
                          <div className="meta-location">{lst.propertylocation ?? lst.placeName ?? "—"}</div>
                          <div className="meta-price">KSH {unwrapValue(lst.propertyprice) ?? "—"}</div>
                        </div>

                        <div className="meta-right">
                          <div className="meta-date">{(() => {
                            const dt = unwrapValue(lst.createdAt);
                            if (dt instanceof Date) return dt.toLocaleDateString();
                            try { return new Date(dt).toLocaleDateString(); } catch { return new Date().toLocaleDateString(); }
                          })()}</div>
                          <div className="meta-actions">
                            <button className="action-link" onClick={() => openModal(lst)}>Details</button>
                          </div>
                        </div>
                      </div>

                      {/* Tour history (front) — show all tour objects fully but compact */}
                      <section className="tour-history">
                        <div className="tour-header">
                          <strong>Tour history</strong>
                          <span className="muted">({Array.isArray(lst.propertytour) ? lst.propertytour.length : 0})</span>
                        </div>

                        {Array.isArray(lst.propertytour) && lst.propertytour.length > 0 ? (
                          <div className="tour-list">
                            {lst.propertytour.map((t, i) => {
                              const visitdate = t.visitdate ?? t.visitDate ?? t.date;
                              const visittime = t.visittime ?? t.visitTime ?? t.time;
                              const { text, status } = formatVisit(visitdate, visittime);
                              return (
                                <div className="tour-item" key={`tour-${i}`}>
                                  <div className="tour-left">
                                    <div className="tour-status">{t.propertystate ?? "—"}</div>
                                    <div className="tour-when">{text}</div>
                                    <div className="tour-tenant muted">Tenant: {t.tenant ?? t.tenantId ?? "—"}</div>
                                    {t.visitplace && <div className="muted">Place: {t.visitplace}</div>}
                                  </div>

                                  <div className="tour-right">
                                    <div className="tour-comments">{t.comments ? (t.comments.length > 160 ? `${t.comments.slice(0, 160)}…` : t.comments) : "No comments"}</div>

                                    <div className="tour-meta">
                                      <span className={`tour-badge tour-${status}`}>{status === "tbd" ? "TBD" : (status === "today" ? "Today" : (status === "upcoming" ? "Upcoming" : "Past"))}</span>
                                      <span style={{ marginLeft: 8 }}>{t.releaseEscrow ?? t.releasedEscrow ? "Escrow released" : "Escrow not released"}</span>
                                    </div>

                                    {/* Show any additional keys for each tour that exist (non-null) */}
                                    <div style={{ marginTop: 8 }}>
                                      {Object.entries(t).filter(([k]) => !["propertystate","tenant","visitdate","visittime","visitplace","comments","releaseEscrow","releasedEscrow"].includes(k)).map(([k,v]) => {
                                        const val = unwrapValue(v);
                                        return (val !== null && String(val).trim?.() !== "") ? (
                                          <div key={k} style={{ fontSize: 12, color: "#333", marginTop: 4 }}>
                                            <strong style={{ fontWeight: 700 }}>{k}:</strong> <span style={{ marginLeft: 6 }}>{typeof val === "object" ? JSON.stringify(val) : String(val)}</span>
                                          </div>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : <div className="muted">No tour history</div>}
                      </section>

                      {/* Release escrow button — only for tourconfirmed */}
                      {isConfirmed && (
                        <div style={{ marginTop: 12 }}>
                          <button className="btn btn-primary" onClick={() => openReleaseModal(lst._id)}>
                            Release / Retain Escrow
                          </button>
                        </div>
                      )}

                  
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="right-spacer" />
      </main>

      {/* Release modal (small) */} 
      {releaseModal.open && ReactDOM.createPortal(
        <div className="modal-overlay fade-in" role="dialog" aria-modal="true">
          <div className="modal-container modal-small">
            <button className="modal-close-btn" onClick={closeReleaseModal} aria-label="Close">×</button>
            <div style={{ marginBottom: 8 }}>
              <h3>Release escrow?</h3>
              <p className="muted">Type <strong>Yes</strong> to release escrow, or <strong>No</strong> to retain. (Auto-detects and closes.)</p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                autoFocus
                value={releaseInput}
                onChange={(e) => setReleaseInput(e.target.value)}
                placeholder="Type Yes or No"
                style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }}
              />
              <div style={{ minWidth: 110, textAlign: "right" }}>
                {releaseFeedback ? (
                  <div style={{ color: releaseFeedback.type === "warn" ? "#B91C1C" : (releaseFeedback.type === "error" ? "#B91C1C" : "#047857") }}>
                    {releaseFeedback.text}
                  </div>
                ) : <div className="muted">Waiting…</div>}
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13 }} className="muted">
              Tip: only "Yes" or "No" are accepted; typing other text will show a warning and nothing will happen.
            </div>
          </div>
        </div>,
        document.getElementById("modal-root") || document.body
      )}

      {selectedListing && <ListingModal listing={selectedListing} onClose={closeModal} modalLoading={modalLoading} />}
      {showImageModal && <ImageModal src={previewSrc} onClose={closeImageModal} />}
    </div>
  );
};

export default Escrow;
