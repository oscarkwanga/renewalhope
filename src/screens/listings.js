// src/Listings.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../listings.css";

const API_BASE_URL = (process.env.REACT_APP_DOMAIN || "").replace(/\/$/, "");

/* ------------------------ Utility helpers ------------------------ */

const STATUS_ORDER = ["approved", "pending", "rejected", "available", "rented"];
const normalizeState = (s) => (s ? String(s).toLowerCase() : "other");

const sanitizePhoneForWhatsapp = (raw) => {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d]/g, "");
  return digits || null;
};

const makeImageUrl = (value) => {
  if (!value) return null;
  try {
    if (typeof value === "string") {
      if (/^https?:\/\//i.test(value)) return value;
      if (API_BASE_URL) return `${API_BASE_URL}/${String(value).replace(/^\//, "")}`;
      return value;
    }
    if (typeof value === "object") {
      if (value.secure_url) return value.secure_url;
      if (value.url) return value.url;
      if (value.path) {
        if (API_BASE_URL) return `${API_BASE_URL}/${String(value.path).replace(/^\//, "")}`;
        return value.path;
      }
      if (value.public_id) {
        if (API_BASE_URL) return `${API_BASE_URL}/${String(value.public_id).replace(/^\//, "")}`;
        return value.public_id;
      }
    }
  } catch (e) {}
  return null;
};

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
    if (ok && (val !== null && typeof val !== "undefined" && String(val).trim() !== "")) return val;
  }
  return fallback;
};

/* ------------------------ Axios client ------------------------ */
// Keep withCredentials true for admin cookie-based auth. Toggle via env if needed.
const client = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
  timeout: 30000,
});

/* ----------------------------- Component ----------------------------- */

export const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [texttype, setTypeText] = useState("");
  const [filteredText, setFilteredText] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [person, setPerson] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [expandGroup, setExpandGroup] = useState({});
  const [activeStateFilter, setActiveStateFilter] = useState(null);

  // deletion + action state
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const socketRef = useRef(null);
  const modalTimerRef = useRef(null);

  const rejectReasons = [
    "Incomplete description",
    "Poor image quality",
    "Incorrect pricing",
    "Invalid location",
    "Spam or duplicate listing",
    "Violates terms of service",
    "Unavailable dates",
    "Other",
  ];

  /* ------------------- initial data + socket setup ------------------- */

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    client
      .get("/house/")
      .then(({ data }) => {
        if (!mounted) return;
        setProperties(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load properties:", err);
        setProperties([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // socket connect to API_BASE_URL if present, otherwise to current origin
    const socketUrl = API_BASE_URL || undefined;
    try {
      socketRef.current = io(socketUrl, { transports: ["websocket"], upgrade: false, secure: true });
    } catch (e) {
      socketRef.current = io();
    }
    const s = socketRef.current;

    s.on("connect", () => {
      console.debug("listings socket connected");
    });

    s.on("getproduct", (newP) => {
      setProperties((prev) => [newP, ...prev]);
    });

    s.on("propertyApproved", (updated) => {
      setProperties((prev) => prev.map((p) => (String(p._id) === String(updated._id) ? { ...p, ...updated } : p)));
    });

    s.on("propertyRejected", (updated) => {
      setProperties((prev) => prev.map((p) => (String(p._id) === String(updated._id) ? { ...p, ...updated } : p)));
    });

    s.on("updated", (updated) => {
      setProperties((prev) => prev.map((p) => (String(p._id) === String(updated._id) ? { ...p, ...updated } : p)));
    });

    s.on("productDeleted", (payload) => {
      let id = payload;
      if (payload && typeof payload === "object" && payload.id) id = payload.id;
      if (!id) return;
      setProperties((prev) => prev.filter((p) => String(p._id) !== String(id)));
      setSelectedListing((cur) => (cur && String(cur._id) === String(id) ? null : cur));
    });

    return () => {
      mounted = false;
      try {
        socketRef.current.disconnect();
      } catch (e) {}
    };
  }, []);

  /* ------------------- searching / filtering ------------------- */

  useEffect(() => {
    const q = (texttype || "").trim().toLowerCase();
    if (!q) {
      setFilteredText([]);
      return;
    }
    const f = properties.filter((prop) => {
      const name = String(prop.propertyname || "").toLowerCase();
      const loc = String(prop.propertylocation || "").toLowerCase();
      const id = String(prop.propertyid || "").toLowerCase();
      return name.includes(q) || loc.includes(q) || id.includes(q);
    });
    setFilteredText(f);
  }, [texttype, properties]);

  const dataToShow = (filteredText.length > 0 ? filteredText : properties).filter((p) =>
    activeStateFilter ? normalizeState(p.propertystate) === activeStateFilter : true
  );

  const grouped = useMemo(() => {
    const map = {};
    for (const p of dataToShow) {
      const st = normalizeState(p.propertystate);
      if (!map[st]) map[st] = [];
      map[st].push(p);
    }
    const result = [];
    for (const s of STATUS_ORDER) {
      if (map[s]) result.push({ state: s, items: map[s] });
    }
    for (const k of Object.keys(map)) {
      if (!STATUS_ORDER.includes(k)) result.push({ state: k, items: map[k] });
    }
    return result;
  }, [dataToShow]);

  const availableStates = useMemo(() => {
    const set = new Set(properties.map((p) => normalizeState(p.propertystate)));
    return Array.from(set);
  }, [properties]);

  /* ------------------- modal open / close ------------------- */

  const openModal = (listing) => {
    setSelectedListing(listing);
    setModalLoading(true);
    clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => setModalLoading(false), 220);
  };
  const closeModal = () => {
    clearTimeout(modalTimerRef.current);
    setSelectedListing(null);
    setModalLoading(false);
  };

  const openImageModal = (src) => {
    setPreviewSrc(src);
    setShowImageModal(true);
  };
  const closeImageModal = () => setShowImageModal(false);

  const toggleExpand = (state) => setExpandGroup((s) => ({ ...s, [state]: !s[state] }));

  /* ------------------- Approve / Reject / Delete flows ------------------- */

  const approveProperty = async (property) => {
    if (!property || !property._id) return;
    setActionLoading(true);
    try {
      await client.put(`/house/approve/${property._id}`, { approved: true, propertystate: "approved" });
      setProperties((prev) => prev.map((p) => (String(p._id) === String(property._id) ? { ...p, propertystate: "approved", approved: true } : p)));
      setToast("Property approved");
      setTimeout(() => setToast(null), 3000);
      closeModal();
    } catch (err) {
      console.error("Approval failed:", err);
      alert(err?.response?.data?.error || err?.message || "Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (listing) => {
    setPerson(listing);
    setSelectedReasons([]);
    setShowRejectModal(true);
  };
  const closeRejectModal = () => setShowRejectModal(false);
  const toggleReason = (r) => setSelectedReasons((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]));

  const submitRejection = async () => {
    if (!person) return;
    setActionLoading(true);
    try {
      await client.put(`/house/reject/${person._id}`, {
        approved: false,
        propertystate: "rejected",
        propertyreject: JSON.stringify(selectedReasons || []),
      });
      setToast("Property rejected");
      setTimeout(() => setToast(null), 3000);
      closeRejectModal();
      closeModal();
    } catch (err) {
      console.error("Rejection failed:", err);
      alert(err?.response?.data?.error || err?.message || "Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const requestRemoveProperty = (prop) => {
    setConfirmDelete(prop);
  };

  const performDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete._id || confirmDelete.id;
    if (!id) {
      alert("Cannot delete: missing id");
      setConfirmDelete(null);
      return;
    }
    setDeletingId(id);
    try {
      await client.delete(`/house/${encodeURIComponent(id)}`);
      setProperties((prev) => prev.filter((p) => String(p._id) !== String(id)));
      setToast("Property deleted");
      setTimeout(() => setToast(null), 3000);
      setSelectedListing((cur) => (cur && String(cur._id) === String(id) ? null : cur));
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.error || err?.message || "Delete failed");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  /* ------------------------- Small UI Portals ------------------------- */

  const ListingModal = ({ listing, onClose, modalLoading }) =>
    ReactDOM.createPortal(
      <div className="modal-overlay fade-in" role="dialog" aria-modal="true">
        <div className="modal-container modal-vertical">
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>

          {modalLoading ? (
            <div className="modal-loading">
              <div className="spinner large" />
            </div>
          ) : (
            <div className="modal-vertical-content">
              <div className="modal-gallery">
                <GalleryPanel listing={listing} onPreview={openImageModal} />
              </div>

              <div className="modal-block">
                <h2 className="prop-title">{getField(listing, ["propertyname", "name"], "Not provided")}</h2>
                <div className="prop-meta-row">
                  <div className="prop-price">KSH {String(getField(listing, ["propertyprice", "price"], "—"))}</div>
                  <div className={`status-pill ${normalizeState(listing.propertystate)}`}>{listing.propertystate || "—"}</div>
                </div>
                <div className="prop-sub">{getField(listing, ["propertylocation", "location", "address"], "Not provided")}</div>
              </div>

              <div className="modal-actions-centered">
                <div className="left-actions">
                  {getField(listing, ["landlord._id", "landlordId", "landlord"], null) ? (
                    <a className="btn btn-primary" href={`/messages/new?to=${getField(listing, ["landlord._id", "landlordId", "landlord"], "")}`}>
                      Message
                    </a>
                  ) : (
                    <button className="btn btn-primary disabled">Message</button>
                  )}

                  {(() => {
                    const phone = getField(listing, ["landlord.contact", "landlord.phone", "contact", "phone"], null);
                    const whatsapp = sanitizePhoneForWhatsapp(phone);
                    return whatsapp ? (
                      <a className="btn btn-outline" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${whatsapp}`}>
                        WhatsApp
                      </a>
                    ) : (
                      <button className="btn btn-outline disabled">WhatsApp</button>
                    );
                  })()}
                </div>

                <div className="right-actions">
                  {normalizeState(listing.propertystate) !== "approved" && (
                    <button className="btn success" onClick={() => approveProperty(listing)} disabled={actionLoading}>
                      {actionLoading ? "Approving…" : "Approve"}
                    </button>
                  )}
                  {normalizeState(listing.propertystate) !== "rejected" && (
                    <button className="btn danger" onClick={() => openRejectModal(listing)} disabled={actionLoading}>
                      Reject
                    </button>
                  )}
                  <button className="btn neutral" onClick={() => window.open(`/property/${listing._id}`, "_blank")}>Open Property Page</button>

                  <button className="btn btn-delete" onClick={() => requestRemoveProperty(listing)} disabled={Boolean(deletingId)}>
                    {deletingId === (listing._id || listing.id) ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>

              <div className="modal-block">
                <h4>Description</h4>
                <p className="description">{getField(listing, ["description", "propdesc", "details"], "No description provided.")}</p>
              </div>

              <div className="modal-block">
                <h4>Details</h4>
                <div className="detail-grid">
                  <div><strong>Category</strong><div>{getField(listing, ["category", "propertycategory"], "Not provided")}</div></div>
                  <div><strong>Type</strong><div>{getField(listing, ["propertytype", "type"], "Not provided")}</div></div>
                  <div><strong>Size</strong><div>{getField(listing, ["propertysize", "size", "area"], "Not provided")}</div></div>
                  <div><strong>On market</strong><div>{getField(listing, ["propertyonmarket", "onMarket"], "Not provided")}</div></div>
                  <div><strong>Topography</strong><div>{getField(listing, ["topography", "propertytopography"], "Not provided")}</div></div>
                  <div><strong>Soil</strong><div>{getField(listing, ["soiltype", "propertysoil", "soil"], "Not provided")}</div></div>
                </div>
              </div>

              <div className="modal-block">
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
              </div>
            </div>
          )}
        </div>
      </div>,
      document.getElementById("modal-root") || document.body
    );

  const ConfirmDeleteModal = ({ prop, onCancel, onConfirm, deletingId }) =>
    ReactDOM.createPortal(
      <div className="modal-overlay fade-in" role="dialog" aria-modal="true" onClick={onCancel}>
        <div className="modal-container modal-small confirm" onClick={(e) => e.stopPropagation()}>
          <div className="reject-header">
            <h3>Delete Listing</h3>
            <p className="muted">This will permanently delete the listing and its images from storage.</p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img alt="thumb" src={makeImageUrl(prop?.images?.cover_front?.[0]) || makeImageUrl(prop?.images?.cover?.[0]) || "/placeholder-thumb.png"} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8 }} />
            <div>
              <div style={{ fontWeight: 700 }}>{prop?.propertyname || prop?.title || "Untitled property"}</div>
              <div className="muted" style={{ fontSize: 13 }}>{prop?.propertylocation || "No location provided"}</div>
            </div>
          </div>

          <div className="reject-footer" style={{ marginTop: 12 }}>
            <button className="btn btn-ghost" onClick={onCancel} disabled={Boolean(deletingId)}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={Boolean(deletingId)}>
              {deletingId ? "Deleting…" : "Yes, delete listing"}
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("modal-root") || document.body
    );

  const RejectModal = ({ reasons, selected, onToggle, onCancel, onSubmit }) =>
    ReactDOM.createPortal(
      <div className="modal-overlay fade-in" role="dialog" aria-modal="true">
        <div className="modal-container modal-small">
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close">×</button>
          <div className="reject-header">
            <h3>Reject listing</h3>
            <p className="muted">Select one or more reasons</p>
          </div>
          <div className="reject-body">
            {reasons.map((r) => (
              <label className="reject-item" key={r}>
                <input type="checkbox" checked={selected.includes(r)} onChange={() => onToggle(r)} />
                <span>{r}</span>
              </label>
            ))}
          </div>
          <div className="reject-footer">
            <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onSubmit} disabled={selected.length === 0}>Submit ({selected.length})</button>
          </div>
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

  function GalleryPanel({ listing, onPreview }) {
    const allImgs = useMemo(() => {
      if (!listing?.images) return [];
      const arr = [];
      for (const key of Object.keys(listing.images)) {
        const imgs = Array.isArray(listing.images[key]) ? listing.images[key] : [listing.images[key]];
        for (const u of imgs) {
          const uri = makeImageUrl(u);
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
      <div className="gallery-panel-vertical">
        <div className="hero-main-vertical">
          {allImgs.length > 0 ? (
            <>
              <img src={current.uri} alt={`hero-${index}`} onError={(e) => (e.target.src = "/placeholder-hero.png")} />
              <div className="hero-caption-vertical">
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

          <div className="gallery-controls-vertical">
            <button onClick={prev} disabled={index === 0} className="gallery-btn">‹</button>
            <button onClick={() => onPreview(current?.uri || "/placeholder-hero.png")} className="gallery-btn primary">Preview</button>
            <button onClick={next} disabled={index >= allImgs.length - 1} className="gallery-btn">›</button>
          </div>
        </div>

        <div className="thumb-row-vertical">
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

  /* -------------------------- Render main UI -------------------------- */

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <h1>Listings Management</h1>
          <p className="sub">Review, message & moderate property listings</p>
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
          <div className="filter-header">
            <strong>Filter by state</strong>
          </div>

          <div className="filter-list">
            {STATUS_ORDER.map((s) => {
              const count = properties.filter((p) => normalizeState(p.propertystate) === s).length;
              if (count === 0) return null;
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

            {availableStates.filter(s => !STATUS_ORDER.includes(s)).map((s) => (
              <button key={s} className={`filter-item ${activeStateFilter === s ? "active" : ""}`} onClick={() => setActiveStateFilter((v) => (v === s ? null : s))}>
                {s.charAt(0).toUpperCase() + s.slice(1)} <span className="badge">{properties.filter(p => normalizeState(p.propertystate) === s).length}</span>
              </button>
            ))}
          </div>

          <div className="filter-footer muted">Tip: click a listing to open full details (actions available there).</div>
        </aside>

        <section className="center-content">
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner large" />
              <div className="loading-text">Loading listings…</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-wrap">
              <div className="empty-illustration">🏠</div>
              <h3>No listings yet</h3>
              <p className="muted">Once listings are available they will appear here. Use the filters to narrow results.</p>
            </div>
          ) : (
            <div className="groups">
              {grouped.length === 0 ? (
                <div className="empty-wrap small">
                  <h4>No matches</h4>
                </div>
              ) : grouped.map((g) => {
                const isExpanded = !!expandGroup[g.state];
                const label = g.state.charAt(0).toUpperCase() + g.state.slice(1);
                return (
                  <section key={g.state} className="group">
                    <div className="group-header">
                      <div>
                        <h3>{label}</h3>
                        <div className="group-sub muted">{g.items.length} item{g.items.length !== 1 ? "s" : ""}</div>
                      </div>
                      <div className="group-actions">
                        <button className="btn btn-ghost" onClick={() => toggleExpand(g.state)}>{isExpanded ? "Collapse" : "Expand"}</button>
                      </div>
                    </div>

                    <div className={`group-content ${isExpanded ? "expanded" : ""}`}>
                      {g.items.map((lst) => (
                        <article className="listing-card" key={lst._id}>
                          <div className="card-media" onClick={() => openModal(lst)} role="button" tabIndex={0}>
                            <img
                              src={makeImageUrl(lst.images?.cover_front?.[0]) || "/placeholder-thumb.png"}
                              alt={lst.propertyname}
                              onError={(e) => (e.target.src = "/placeholder-thumb.png")}
                            />
                          </div>

                          <div className="card-body">
                            <div className="card-head">
                              <h4 className="card-title">{lst.propertyname || "—"}</h4>
                              <div className={`status-mini ${normalizeState(lst.propertystate)}`}>{lst.propertystate || "—"}</div>
                            </div>

                            <div className="card-meta">
                              <div className="meta-left">
                                <div className="meta-location">{lst.propertylocation || "—"}</div>
                                <div className="meta-price">KSH {lst.propertyprice?.toLocaleString?.() || "—"}</div>
                              </div>

                              <div className="meta-right">
                                <div className="meta-date">{new Date(lst.createdAt || Date.now()).toLocaleDateString()}</div>
                                <div className="meta-actions">
                                  <button className="action-link" onClick={() => openModal(lst)}>Details</button>
                                  <button className="action-link danger" onClick={(e) => { e.stopPropagation(); requestRemoveProperty(lst); }}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        <aside className="right-spacer" />
      </main>

      {selectedListing && <ListingModal listing={selectedListing} onClose={closeModal} modalLoading={modalLoading} />}
      {showRejectModal && (
        <RejectModal
          reasons={rejectReasons}
          selected={selectedReasons}
          onToggle={toggleReason}
          onCancel={closeRejectModal}
          onSubmit={submitRejection}
        />
      )}
      {showImageModal && <ImageModal src={previewSrc} onClose={closeImageModal} />}

      {confirmDelete && (
        <ConfirmDeleteModal
          prop={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={performDelete}
          deletingId={deletingId}
        />
      )}

      {toast && <div className="toast-floating">{toast}</div>}
    </div>
  );
};

export default Listings;
