import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";

/**
 * PropertyPage.jsx
 * - Detects property vs package
 * - Loads record by id from API
 * - Mirrors fields & layout from your mobile Property.js
 *
 * Usage:
 *   <PropertyPage /> -- reads id and type from URL query (id, type)
 *   or pass `id` and `type` as props.
 *
 * Set your API base in environment: REACT_APP_DOMAIN (same as your App.jsx)
 */

const API_BASE_URL = (process.env.REACT_APP_DOMAIN || "").replace(/\/$/, "");

function safeGetId(obj) {
  if (!obj) return null;
  if (typeof obj === "string") return obj;
  if (obj.$oid) return String(obj.$oid);
  if (obj._id && obj._id.$oid) return String(obj._id.$oid);
  if (obj._id) return String(obj._id);
  if (obj.id) return String(obj.id);
  return null;
}

function gatherAllImageUrls(imagesObj) {
  if (!imagesObj || typeof imagesObj !== "object") return [];
  const out = [];
  try {
    for (const k of Object.keys(imagesObj)) {
      const val = imagesObj[k];
      if (!val) continue;
      if (Array.isArray(val)) {
        val.forEach((entry) => {
          if (!entry) return;
          if (typeof entry === "string") out.push(entry);
          else if (typeof entry === "object") {
            const url = entry.url || entry.secure_url || entry.uri || entry.path || entry.src || null;
            if (url) out.push(url);
          }
        });
      } else if (typeof val === "object") {
        const nested = Object.values(val).flat(Infinity);
        nested.forEach((entry) => {
          if (!entry) return;
          if (typeof entry === "string") out.push(entry);
          else if (typeof entry === "object") {
            const url = entry.url || entry.secure_url || entry.uri || entry.path || entry.src || null;
            if (url) out.push(url);
          }
        });
      } else if (typeof val === "string") {
        out.push(val);
      }
    }
  } catch (e) {
    try {
      Object.values(imagesObj).flat().forEach((v) => {
        if (!v) return;
        if (typeof v === "string") out.push(v);
        else if (typeof v === "object") {
          const url = v.url || v.secure_url || v.uri || v.path || v.src || null;
          if (url) out.push(url);
        }
      });
    } catch (err) {}
  }
  return Array.from(new Set(out));
}

const AMENITY_LABELS = {
  wifi: "WiFi",
  kitchen: "Kitchen",
  parking: "Parking",
  pool: "Pool",
  washer: "Washer",
  dryer: "Dryer",
  tv: "TV",
  aircon: "Air conditioning",
  heating: "Heating",
  pets: "Pets allowed",
  balcony: "Balcony",
  hot_tub: "Hot tub",
  fireplace: "Fireplace",
  gym: "Gym",
  elevator: "Elevator",
  wheelchair_accessible: "Accessible",
  breakfast_included: "Breakfast",
  workspace: "Workspace",
  iron: "Iron",
  hair_dryer: "Hair dryer",
  street_parking: "Street parking",
  private_parking: "Private parking",
  bbq_grill: "BBQ grill",
  fenced_yard: "Fenced yard",
  baby_crib: "Baby crib",
  high_chair: "High chair",
  security_cameras: "Security cameras",
  smoke_alarm: "Smoke alarm",
  carbon_monoxide_alarm: "Carbon monoxide alarm",
  first_aid_kit: "First aid kit",
  fire_extinguisher: "Fire extinguisher",
  pet_bed: "Pet bed",
  pool_heating: "Pool heating",
};

function formatMoney(amount) {
  if (amount === undefined || amount === null) return "";
  const n = Number(amount) || 0;
  return n.toLocaleString();
}

function useQuery() {
  return new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
}

/* ---------------- small date helpers (web) ---------------- */
function parseDate(val) {
  if (!val) return null;
  try {
    if (val instanceof Date) return val;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch (e) {
    return null;
  }
}
function daysBetween(a, b) {
  if (!a || !b) return null;
  try {
    const da = parseDate(a);
    const db = parseDate(b);
    if (!da || !db) return null;
    da.setHours(0, 0, 0, 0);
    db.setHours(0, 0, 0, 0);
    const diffMs = db - da;
    const days = Math.round(diffMs / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  } catch (e) {
    return null;
  }
}

/* ---------------- Component ---------------- */
export const Property = (props) => {
  const query = useQuery();
  const propIdFromQuery = query.get("id") || query.get("propertyId") || null;
  const typeFromQuery = query.get("type") || null; // "package" or "property"

  const id = props.id || propIdFromQuery || (props.item && safeGetId(props.item)) || null;
  const initialType = props.type || typeFromQuery || (props.item && (props.item.bookingType || props.item.type)) || null;

  const [loading, setLoading] = useState(!props.item);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(props.item || null);
  const [detectedType, setDetectedType] = useState(initialType || "property");

  // UI state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // booking fields (editable on web)
  const [bookStart, setBookStart] = useState("");
  const [bookEnd, setBookEnd] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  // nights as editable state (mirrors Deposit)
  const [nightsState, setNightsState] = useState(1);

  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);

  // pricing/total computed states
  const [depositPerUnit, setDepositPerUnit] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [estimatedTotal, setEstimatedTotal] = useState(0);

  // inject component CSS once
  useEffect(() => {
    const id = "prop-page-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.innerHTML = css;
      document.head.appendChild(s);
    }
  }, []);

  // fetch item when we have an id and no initial item
  useEffect(() => {
    let mounted = true;
    async function fetchItem() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // prefer explicit type in query; else try property endpoint and fallback to package
        const t = (initialType || typeFromQuery || "").toLowerCase();
        let resp = null;
        let finalType = "property";
        if (t === "package") {
          resp = await axios.get(`${API_BASE_URL}/packages/${id}`);
          finalType = "package";
        } else if (t === "property") {
          resp = await axios.get(`${API_BASE_URL}/properties/${id}`);
          finalType = "property";
        } else {
          // try property then package
          try {
            resp = await axios.get(`${API_BASE_URL}/properties/${id}`);
            finalType = "property";
          } catch (e) {
            resp = await axios.get(`${API_BASE_URL}/packages/${id}`);
            finalType = "package";
          }
        }
        const data = resp?.data ?? resp;
        if (!mounted) return;
        setItem(data);
        setDetectedType(finalType);
      } catch (err) {
        console.error("fetch item error", err);
        if (!mounted) return;
        setError("Failed to load listing.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (!item) fetchItem();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // === prefill booking from URL query (or from item.booking) ===
  useEffect(() => {
    try {
      const q = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      const qiDateIn = q.get("dateIn") || q.get("startDate");
      const qiDateOut = q.get("dateOut") || q.get("endDate");
      const qiAdults = q.get("adults");
      const qiChildren = q.get("children");
      const qiNights = q.get("nights");

      if (qiDateIn) {
        setBookStart(qiDateIn);
        if (qiDateOut) setBookEnd(qiDateOut);
        if (qiAdults && !Number.isNaN(Number(qiAdults))) setAdults(Math.max(1, Number(qiAdults)));
        if (qiChildren && !Number.isNaN(Number(qiChildren))) setChildren(Math.max(0, Number(qiChildren)));
        if (qiNights && !Number.isNaN(Number(qiNights))) setNightsState(Math.max(1, Number(qiNights)));
        return;
      }

      // fallback: if the item itself includes booking (navigated with payload), use that
      if (item && item.booking) {
        if (item.booking.dateIn) setBookStart(item.booking.dateIn.split("T")[0] || item.booking.dateIn);
        if (item.booking.dateOut) setBookEnd(item.booking.dateOut.split("T")[0] || item.booking.dateOut);
        if (item.booking.adults !== undefined) setAdults(item.booking.adults);
        if (item.booking.children !== undefined) setChildren(item.booking.children);
        // set nights from booking
        if (item.booking.dateIn && item.booking.dateOut) {
          const d = daysBetween(item.booking.dateIn, item.booking.dateOut);
          if (d) setNightsState(d);
        } else if (detectedType === "package" && Array.isArray(item.days) && item.days.length) {
          setNightsState(item.days.length);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [item, detectedType]);

  // normalized images
  const normalized = useMemo(() => {
    if (!item) return { images: [], galleryGroups: [], overallImages: [] };

    const urls = gatherAllImageUrls(item.images || {});
    const imgsFlat = urls.map((u) => ({ uri: u }));
    const groups = [];
    if (item.images && typeof item.images === "object" && !Array.isArray(item.images)) {
      for (const k of Object.keys(item.images)) {
        const arr = item.images[k];
        if (!arr) continue;
        const mapped = (Array.isArray(arr) ? arr : []).map((it) => {
          if (!it) return null;
          if (typeof it === "string") return { uri: it, key: k };
          if (typeof it === "object") return { uri: it.url || it.uri || it.secure_url || it.path || null, key: k, name: it.originalName || it.title || null };
          return null;
        }).filter(Boolean);
        if (mapped.length) groups.push({ key: k, label: k, images: mapped });
      }
    }
    const overallImages = imgsFlat.length ? imgsFlat : (item.images && Array.isArray(item.images) ? item.images.map(it => ({ uri: typeof it === "string" ? it : (it.url || it.uri || null) })).filter(Boolean) : []);
    return { images: imgsFlat, galleryGroups: groups, overallImages };
  }, [item]);

  // derived fields
  const title = item?.title || item?.summary || item?.propertyname || "Listing";
  const description = item?.description || item?.summary || "";
  const pricing = item?.pricing || {};
  const currency = pricing.currency || item?.currency || "KSh";
  const pricePerNight = pricing.pricePerNight ?? item?.price ?? item?.propertyprice ?? 0;
  const pricePerPerson = pricing.pricePerPerson ?? item?.price ?? 0;
  const capacity = item?.capacity || {};
  const bedrooms = capacity.bedrooms ?? item?.bedrooms ?? "-";
  const bathrooms = capacity.bathrooms ?? item?.bathrooms ?? "-";
  const sqft = capacity.sqft ?? item?.sqft ?? "-";
  const maxGuests = capacity.maxGuests ?? item?.guests ?? 1;

  const loc = item?.location || {};
  const locationLabel = [loc.city, loc.region, loc.country].filter(Boolean).join(", ");
  const inclusives = Array.isArray(item?.inclusives) ? item.inclusives : Array.isArray(item?.inclusive) ? item.inclusive : [];
  const services = Array.isArray(item?.services) ? item.services : [];
  const houseRules = Array.isArray(item?.houseRules) ? item.houseRules : Array.isArray(item?.rules) ? item.rules : [];
  const days = Array.isArray(item?.days) ? item.days : [];

  // compute default nights (non-editable source); used to initialize nightsState if not set
  const computeNights = () => {
    try {
      const dateIn = item?.booking?.dateIn ? new Date(item.booking.dateIn) : null;
      const dateOut = item?.booking?.dateOut ? new Date(item.booking.dateOut) : null;
      if (dateIn && dateOut && !isNaN(dateIn.getTime()) && !isNaN(dateOut.getTime())) {
        const ms = 1000 * 60 * 60 * 24;
        const n = Math.max(1, Math.round((dateOut - dateIn) / ms));
        return n;
      }
      if (detectedType === "package" && days.length) return days.length;
    } catch (e) {}
    return 1;
  };
  const inferredNights = useMemo(() => computeNights(), [item, detectedType]);

  // when inferredNights changes, ensure nightsState is in sync (but do not overwrite if user already edited)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      setNightsState(inferredNights || 1);
      initializedRef.current = true;
    }
  }, [inferredNights]);

  // when dates change compute nightsState automatically (user can still edit nights with steppers)
  useEffect(() => {
    if (bookStart && bookEnd) {
      const d = daysBetween(bookStart, bookEnd);
      if (d && d > 0) setNightsState(d);
    }
  }, [bookStart, bookEnd]);

  // --- totals calculation (mirrors Deposit.js logic) ---
  useEffect(() => {
    const isPackage = detectedType === "package";
    if (isPackage) {
      const p = Number(pricePerPerson) || 0;
      const n = Number(nightsState) || 1;
      const a = Number(adults) || 1;
      // depositPerUnit = 50% × pricePerPerson × nights (rounded)
      const depositPer = Math.round(p * 0.5 * n);
      const est = p * a * n;
      const dTotal = depositPer * a;
      setDepositPerUnit(depositPer);
      setDepositAmount(dTotal);
      setEstimatedTotal(est);
    } else {
      const pn = Number(pricePerNight) || 0;
      const n = Number(nightsState) || 1;
      const a = Math.max(1, Number(adults) || 1);
      const depositPerNight = Math.round(pn * 0.5);
      const est = pn * n * a;
      const dTotal = depositPerNight * n * a;
      setDepositPerUnit(depositPerNight);
      setDepositAmount(dTotal);
      setEstimatedTotal(est);
    }
  }, [detectedType, pricePerNight, pricePerPerson, adults, nightsState]);

  // gallery helpers
  const openGalleryAt = (i = 0) => { setGalleryIndex(i); setGalleryOpen(true); };
  const closeGallery = () => setGalleryOpen(false);

  // booking actions
  const openBooking = () => {
    // ensure sensible defaults if empty
    if (!bookStart) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      setBookStart(d.toISOString().slice(0, 10));
    }
    if (!bookEnd) {
      const d2 = new Date();
      d2.setDate(d2.getDate() + (nightsState || 1));
      setBookEnd(d2.toISOString().slice(0, 10));
    }
  };

  const buildPayload = () => {
    const isPackage = detectedType === "package";
    if (isPackage) {
      return {
        bookingType: 'package',
        property: item._id ?? item.id ?? null,
        packageTitle: item.title ?? item.summary,
        amount: Number(pricePerPerson) || 0,
        depositPerPerson: depositPerUnit,
        depositAmount,
        estimatedTotal,
        nights: Number(nightsState) || 1,
        guests: Number(adults) || 1,
        children: Number(children) || 0,
        startDate: bookStart || "",
        endDate: bookEnd || "",
        booking: {
          dateIn: bookStart || "",
          dateOut: bookEnd || "",
          adults: Number(adults) || 1,
          children: Number(children) || 0,
        },
        item,
      };
    }
    return {
      bookingType: 'property',
      property: item._id ?? item.id ?? null,
      propertyname: item.title ?? item.summary,
      amount: Number(pricePerNight) || 0,
      depositPerNight: depositPerUnit,
      depositAmount,
      estimatedTotal,
      nights: Number(nightsState) || 1,
      guests: Number(adults) || 1,
      children: Number(children) || 0,
      startDate: bookStart || "",
      endDate: bookEnd || "",
      booking: {
        dateIn: bookStart || "",
        dateOut: bookEnd || "",
        adults: Number(adults) || 1,
        children: Number(children) || 0,
      },
      propertyObj: item,
    };
  };

  const onConfirmToConfirmpay = () => {
    // validate dates
    if (!bookStart || !bookEnd) {
      alert("Please set check-in and check-out dates.");
      return;
    }
    const payload = buildPayload();
    window.location.href = '/Confirmpay?payload=' + encodeURIComponent(JSON.stringify(payload));
  };

  if (loading) {
    return <div className="pp-root"><div className="pp-container"><div className="pp-loading">Loading listing…</div></div></div>;
  }

  if (error) {
    return <div className="pp-root"><div className="pp-container"><div className="pp-error">{error}</div></div></div>;
  }

  return (
    <div className="pp-root">
      <div className="pp-hero">
        <div className="pp-hero-inner">
          <div className="pp-hero-left">
            <h1 className="pp-title">{title}</h1>
            <div className="pp-sub">{locationLabel}</div>
            <div className="pp-meta">
              <div className="chip">{bedrooms} Beds</div>
              <div className="chip">{bathrooms} Baths</div>
              <div className="chip">{maxGuests} Guests</div>
              <div className="chip">{sqft} Sqft</div>
            </div>
          </div>

          <div className="pp-hero-right">
            <div className="pp-price">
              <div className="pp-price-big">{detectedType === "package" ? `${currency} ${formatMoney(pricePerPerson)}` : `${currency} ${formatMoney(pricePerNight)}`}</div>
              <div className="pp-price-small">{detectedType === "package" ? "/ person" : "/ night"}</div>
            </div>
            <div className="pp-actions">
              <button className="btn btn-primary" onClick={() => { openBooking(); /* scroll to right column or focus */ }}>{detectedType === "package" ? "Book package" : "Book now"}</button>
              <button className="btn btn-ghost" onClick={() => openGalleryAt(0)}>View photos</button>
            </div>
          </div>
        </div>
      </div>

      <div className="pp-container">
        <div className="pp-grid">
          <div className="pp-leftcol">
            {/* Gallery carousel */}
            <div className="carousel">
              <div className="carousel-main">
                {normalized.overallImages && normalized.overallImages.length ? (
                  <img src={normalized.overallImages[0].uri} alt="cover" onClick={() => openGalleryAt(0)} />
                ) : (
                  <div className="no-photo">No photo</div>
                )}
              </div>

              <div className="carousel-thumbs">
                {(normalized.overallImages || []).map((im, i) => (
                  <button key={i} className="thumb" onClick={() => openGalleryAt(i)}>
                    <img src={im.uri} alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Overview */}
            {description ? (
              <section className="section">
                <h3>Overview</h3>
                <p>{description}</p>
              </section>
            ) : null}

            {/* Itinerary / days (packages) */}
            {detectedType === "package" && days && days.length > 0 && (
              <section className="section">
                <h3>Itinerary</h3>
                {days.map((d, idx) => (
                  <div key={idx} className="day-block">
                    <div className="day-header"><strong>{d.title || `Day ${idx + 1}`}</strong> <span className="muted">{Array.isArray(d.images) ? `${d.images.length} photo(s)` : ""}</span></div>
                    {d.description ? <p className="muted">{d.description}</p> : null}
                  </div>
                ))}
              </section>
            )}

            {/* Pricing + inclusives */}
            <section className="section">
              <h3>{detectedType === "package" ? "Package details" : "Pricing & details"}</h3>

              {detectedType === "property" ? (
                <>
                  <div className="info-row"><div className="label">Price per night</div><div className="value">{currency} {formatMoney(pricePerNight)}</div></div>
                  {pricing.cleaningFee !== undefined && <div className="info-row"><div className="label">Cleaning fee</div><div className="value">{currency} {formatMoney(pricing.cleaningFee)}</div></div>}
                  {pricing.securityDeposit !== undefined && <div className="info-row"><div className="label">Security deposit</div><div className="value">{currency} {formatMoney(pricing.securityDeposit)}</div></div>}
                </>
              ) : (
                <>
                  <div className="info-row"><div className="label">Price per person</div><div className="value">{currency} {formatMoney(pricePerPerson)}</div></div>
                  <div className="info-row"><div className="label">Duration</div><div className="value">{item.durationLabel || item.duration || `${days.length} day(s)`}</div></div>
                </>
              )}

              {inclusives && inclusives.length ? (
                <div style={{ marginTop: 10 }}>
                  <strong>Inclusions</strong>
                  <ul className="simple-list">{inclusives.map((inc, i) => <li key={i}>{inc}</li>)}</ul>
                </div>
              ) : null}
            </section>

            {/* Amenities */}
            <section className="section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {(() => {
                  const keys = Object.keys(AMENITY_LABELS).filter((k) => item?.amenities && Object.prototype.hasOwnProperty.call(item.amenities, k) && !!item.amenities[k]);
                  if (!keys.length) return <div className="muted">No amenities listed</div>;
                  const shown = amenitiesExpanded ? keys : keys.slice(0, 12);
                  return <>
                    {shown.map((k) => <div key={k} className="amenity"><span className="dot" />{AMENITY_LABELS[k]}</div>)}
                    {keys.length > 12 ? (
                      <button className="btn-link" onClick={() => setAmenitiesExpanded((s) => !s)}>{amenitiesExpanded ? "Show less" : `+ ${keys.length - 12} more`}</button>
                    ) : null}
                  </>;
                })()}
              </div>
            </section>

            {/* Services */}
            {services && services.length ? (
              <section className="section">
                <h3>Services</h3>
                <ul className="simple-list">{services.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </section>
            ) : null}

            {/* House rules */}
            {houseRules && houseRules.length ? (
              <section className="section">
                <h3>House rules</h3>
                <ul className="simple-list">{houseRules.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </section>
            ) : null}

            {/* Documents */}
            {item?.documents && Object.keys(item.documents || {}).length ? (
              <section className="section">
                <h3>Documents</h3>
                <ul className="simple-list">
                  {Object.entries(item.documents).map(([k, v]) => <li key={k}>{k}: {typeof v === "string" ? v : (v.name || v.title || "Document")}</li>)}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="pp-rightcol">
            {/* REPLACED: deposit-style booking box (mirrors Deposit.js) */}
            <div className="sticky-box">
              <div className="sticky-top">
                <div className="sticky-price">{detectedType === "package" ? `${currency} ${formatMoney(pricePerPerson)}` : `${currency} ${formatMoney(pricePerNight)}`}</div>
                <div className="muted">{detectedType === "package" ? "/ person" : "/ night"}</div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="field"><label>Check-in</label>
                  <input type="date" value={bookStart || ""} onChange={(e) => setBookStart(e.target.value)} />
                </div>
                <div className="field"><label>Check-out</label>
                  <input type="date" value={bookEnd || ""} onChange={(e) => setBookEnd(e.target.value)} />
                </div>

                <div className="field-row" style={{ marginTop: 10 }}>
                  <div className="step">
                    <label>Adults</label>
                    <div className="step-row">
                      <button onClick={() => setAdults((a) => Math.max(1, a - 1))}>−</button>
                      <div className="step-val">{adults}</div>
                      <button onClick={() => setAdults((a) => Math.min(99, a + 1))}>＋</button>
                    </div>
                  </div>

                  <div className="step">
                    <label>Children</label>
                    <div className="step-row">
                      <button onClick={() => setChildren((c) => Math.max(0, c - 1))}>−</button>
                      <div className="step-val">{children}</div>
                      <button onClick={() => setChildren((c) => Math.min(99, c + 1))}>＋</button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label>Days / Nights</label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setNightsState((n) => Math.max(1, (n || 1) - 1))}>−</button>
                    <div style={{ minWidth: 36, textAlign: 'center', alignSelf: 'center' }}>{nightsState}</div>
                    <button onClick={() => setNightsState((n) => Math.min(365, (n || 1) + 1))}>＋</button>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={onConfirmToConfirmpay} style={{ width: "100%" }}>
                    {detectedType === "package" ? "Book package" : "Continue to payment"}
                  </button>
                </div>

                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-ghost" onClick={() => {
                    if (item?.contact?.phone) window.open(`tel:${item.contact.phone}`);
                  }} style={{ width: "100%" }}>Call host</button>
                </div>
              </div>

              <div style={{ marginTop: 12, borderTop: "1px solid #eef2f7", paddingTop: 12 }}>
                <strong>Price summary</strong>
                <div style={{ marginTop: 8 }} className="info-row"><div className="label">Deposit per unit</div><div className="value">{depositPerUnit ? formatMoney(depositPerUnit) : '—'}</div></div>
                <div className="info-row"><div className="label">Total deposit</div><div className="value">{depositAmount ? formatMoney(depositAmount) : '—'}</div></div>
                <div className="info-row"><div className="label">Estimated total</div><div className="value">{estimatedTotal ? formatMoney(estimatedTotal) : '—'}</div></div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Host</strong>
                <div className="muted">{item?.contact?.ownerName || item?.hostName || "Host"}</div>
                {item?.contact?.phone ? <div style={{ marginTop: 8 }}><a className="link" href={`tel:${item.contact.phone}`}>Call: {item.contact.phone}</a></div> : null}
                {item?.contact?.email ? <div style={{ marginTop: 6 }}><a className="link" href={`mailto:${item.contact.email}`}>{item.contact.email}</a></div> : null}
              </div>

              {loc && loc.lat && loc.lng && (
                <div style={{ marginTop: 12 }}>
                  <strong>Location</strong>
                  <div className="muted" style={{ marginTop: 8 }}>{locationLabel}</div>
                  <div style={{ marginTop: 8 }}>
                    <iframe
                      title="map"
                      width="100%"
                      height="160"
                      frameBorder="0"
                      style={{ borderRadius: 8 }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(loc.lat + "," + loc.lng)}&z=14&output=embed`}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Gallery modal */}
      {galleryOpen && (
        <div className="pp-modal" role="dialog" onClick={closeGallery}>
          <div className="pp-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeGallery}>×</button>
            <div className="modal-gallery">
              {(normalized.overallImages || []).length ? (
                <img src={normalized.overallImages[galleryIndex]?.uri} alt={`img-${galleryIndex}`} />
              ) : <div className="no-photo large">No photos</div>}
            </div>
            <div className="modal-thumbs">
              {(normalized.overallImages || []).map((im, i) => (
                <button key={i} className={`thumb ${i === galleryIndex ? "active" : ""}`} onClick={() => setGalleryIndex(i)}>
                  <img src={im.uri} alt={`t-${i}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- CSS (scoped string injected) ---------------- */
const css = `

/* Page root */
.pp-root{font-family:Inter,system-ui,Arial,sans-serif;color:#0f172a;background:#f7f9fc;min-height:100vh}
.pp-container{max-width:1200px;margin:22px auto;padding:0 18px}
.pp-hero{background:linear-gradient(180deg,rgba(11,120,163,0.06),rgba(124,58,237,0.02));padding:22px;border-radius:12px;margin:18px auto;max-width:1200px}
.pp-hero-inner{display:flex;justify-content:space-between;align-items:center;gap:18px}
.pp-hero-left{flex:1}
.pp-title{margin:0;font-size:22px}
.pp-sub{color:#6b7280;margin-top:6px}
.pp-meta{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.chip{background:#fff;padding:8px 10px;border-radius:10px;border:1px solid #eef2f7;font-size:13px;color:#111}

/* hero right */
.pp-hero-right{text-align:right;min-width:220px}
.pp-price{background:#fff;padding:10px 12px;border-radius:10px;border:1px solid #e6eef6;display:inline-block}
.pp-price-big{font-weight:700;color:#0b78a3}
.pp-price-small{color:#6b7280;font-size:13px}
.pp-actions{margin-top:10px;display:flex;gap:8px;justify-content:flex-end}
.btn{padding:10px 12px;border-radius:10px;border:0;cursor:pointer;font-weight:600}
.btn-primary{background:linear-gradient(90deg,#0B78A3,#7C3AED);color:#fff}
.btn-ghost{background:transparent;border:1px solid #e6eef6;color:#0f172a}

/* layout */
.pp-grid{display:grid;grid-template-columns:1fr 320px;gap:20px;margin-top:18px}
.pp-leftcol{}
.pp-rightcol{}

/* carousel */
.carousel{background:#fff;border-radius:12px;padding:12px;border:1px solid #E8EEF3}
.carousel-main img{width:100%;height:360px;object-fit:cover;border-radius:8px;cursor:pointer}
.no-photo{height:360px;display:flex;align-items:center;justify-content:center;background:#f3f7f8;color:#9aa3ad;border-radius:8px}
.carousel-thumbs{display:flex;gap:8px;margin-top:10px;overflow:auto}
.thumb{border:0;background:transparent;padding:0;border-radius:6px;cursor:pointer}
.thumb img{width:90px;height:64px;object-fit:cover;border-radius:6px;display:block}

/* sections */
.section{background:#fff;padding:14px;border-radius:12px;border:1px solid #E8EEF3;margin-top:14px}
.section h3{margin:0 0 8px 0}
.simple-list{padding-left:18px;margin:6px 0}
.muted{color:#6b7280}

/* amenities */
.amenities-grid{display:flex;flex-wrap:wrap;gap:8px}
.amenity{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;background:#f8fafc;border:1px solid rgba(15,23,42,0.04)}
.btn-link{background:none;border:0;color:#0b78a3;cursor:pointer;margin-top:8px}

/* sticky box right */
.sticky-box{background:#fff;border-radius:12px;padding:12px;border:1px solid #E8EEF3;position:sticky;top:18px}
.field{margin-top:8px}
.field label{font-size:13px;color:#6b7280;display:block;margin-bottom:6px}
.field input[type="date"]{width:100%;padding:8px;border-radius:8px;border:1px solid #eef2f7}
.field-row{display:flex;gap:8px}
.step{flex:1}
.step-row{display:flex;align-items:center;gap:8px}
.step-row button{width:36px;height:36px;border-radius:8px;border:0;background:#f3f5f7;cursor:pointer}
.step-val{min-width:30px;text-align:center}

/* info layout */
.info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #f1f5f9}

/* modal / gallery */
.pp-modal{position:fixed;inset:0;background:rgba(4,12,20,0.6);display:flex;align-items:center;justify-content:center;z-index:120}
.pp-modal-inner{width:94%;max-width:1100px;background:#fff;border-radius:12px;padding:16px;position:relative}
.modal-close{position:absolute;right:12px;top:12px;border:0;background:transparent;font-size:22px;cursor:pointer}
.modal-gallery img{width:100%;height:62vh;object-fit:contain}
.modal-thumbs{display:flex;gap:8px;margin-top:8px;overflow:auto}
.modal-thumbs .thumb img{width:100px;height:70px;object-fit:cover;border-radius:6px}
.modal-thumbs .thumb.active{outline:3px solid rgba(11,120,163,0.12)}

/* drawer */
.pp-drawer{position:fixed;right:0;top:0;bottom:0;width:420px;background:rgba(0,0,0,0.3);display:flex;align-items:flex-end;z-index:130}
.pp-drawer-inner{width:100%;background:#fff;padding:18px;height:100%;overflow:auto;position:relative}
.drawer-close{position:absolute;left:12px;top:12px;border:0;background:transparent;font-size:22px;cursor:pointer}

/* small utilities */
.link{color:#0b78a3}
.pp-loading,.pp-error{padding:18px;background:#fff;border-radius:12px;margin:40px auto;text-align:center;max-width:720px;box-shadow:0 10px 30px rgba(2,6,23,0.06)}

/* responsive */
@media(max-width:980px){
  .pp-grid{grid-template-columns:1fr}
  .pp-hero-inner{flex-direction:column;align-items:flex-start}
  .pp-hero-right{text-align:left;min-width:unset;width:100%}
}
`;

export default Property;
