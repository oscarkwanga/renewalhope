// App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * App.jsx — Booking landing page (web)
 * - Fetches real properties & packages from backend (same endpoints as your mobile app)
 * - Keeps UI markup/design but restores compact cards with bed/bath/sqft, rating, price pill
 * - Removes like/heart and merges actions into single Book now button
 *
 * Set REACT_APP_API_BASE_URL in env or edit API_BASE_URL here.
 */
const API_BASE_URL = (process.env.REACT_APP_DOMAIN || "").replace(/\/$/, "");

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
            const url = entry.url || entry.secure_url || entry.uri || entry.path || null;
            if (url && String(url).startsWith("http")) out.push(url);
          }
        });
      } else if (typeof val === "object") {
        const nested = Object.values(val).flat(Infinity);
        nested.forEach((entry) => {
          if (!entry) return;
          if (typeof entry === "string") out.push(entry);
          else if (typeof entry === "object") {
            const url = entry.url || entry.secure_url || entry.uri || entry.path || null;
            if (url && String(url).startsWith("http")) out.push(url);
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
          const url = v.url || v.secure_url || v.uri || null;
          if (url) out.push(url);
        }
      });
    } catch (err) {}
  }
  return Array.from(new Set(out));
}

function formatMoney(amount) {
  if (amount === undefined || amount === null) return "";
  const n = Number(amount) || 0;
  return n.toLocaleString();
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

export const Support = () => {
  const [properties, setProperties] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [error, setError] = useState(null);

  // Booking / details panel state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookStart, setBookStart] = useState("");
  const [bookEnd, setBookEnd] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    // inject styles once
    const id = "booking-compact-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const server = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;

    async function fetchProperties() {
      setLoadingProps(true);
      try {
        const resp = await axios.get(`${server}properties`);
        const data = resp.data || [];
        const normalized = (Array.isArray(data) ? data : []).map((h) => {
          const urls = gatherAllImageUrls(h.images || {});
          const imgs = urls.length ? urls.map((u) => ({ url: u })) : [];
          const price = (h.pricing && (h.pricing.pricePerNight ?? h.pricing.pricePerNight)) || h.price || h.propertyprice || 0;
          const capacity = h.capacity || {};
          return {
            ...h,
            images: imgs,
            pricing: h.pricing || { pricePerNight: price },
            price,
            capacity,
          };
        });
        if (!mounted) return;
        setProperties(normalized);
      } catch (err) {
        console.error("fetch properties error", err);
        if (mounted) {
          setError("Failed to load properties");
          setProperties([]);
        }
      } finally {
        if (mounted) setLoadingProps(false);
      }
    }

    async function fetchPackages() {
      setLoadingPkgs(true);
      try {
        const resp = await axios.get(`${server}packages`);
        const data = resp.data || [];
        const normalized = (Array.isArray(data) ? data : []).map((p) => {
          const galleryUrls = gatherAllImageUrls(p.images || {});
          const daysWithImgs = (p.days || []).map((d, idx) => {
            const key = `day_${idx + 1}`;
            const dayImgsRaw = p.images && p.images[key] ? p.images[key] : [];
            const dayImgs = Array.isArray(dayImgsRaw)
              ? dayImgsRaw.map((it) => {
                  if (!it) return null;
                  if (typeof it === "string") return { uri: it };
                  if (typeof it === "object") return { uri: it.url || it.uri || null };
                  return null;
                }).filter(Boolean)
              : [];
            return { ...d, images: dayImgs };
          });
          return {
            ...p,
            images: galleryUrls.map((u) => ({ url: u })),
            days: daysWithImgs,
          };
        });
        if (!mounted) return;
        setPackages(normalized);
      } catch (err) {
        console.error("fetch packages error", err);
        if (mounted) {
          setError("Failed to load packages");
          setPackages([]);
        }
      } finally {
        if (mounted) setLoadingPkgs(false);
      }
    }

    fetchProperties();
    fetchPackages();

    return () => { mounted = false; };
  }, []);

  // ---------- Booking helpers ----------
  const openBookingFor = (item) => {
    setSelectedItem(item);

    // Prefill dates: if package (has days) compute range; else default in/out
    const today = new Date();
    const isoToday = today.toISOString().slice(0, 10);
    if (item && Array.isArray(item.days) && item.days.length > 0) {
      // package: start today, end = start + days.length - 1
      setBookStart(isoToday);
      const end = new Date(today);
      end.setDate(end.getDate() + Math.max(1, item.days.length) - 1);
      setBookEnd(end.toISOString().slice(0, 10));
    } else {
      const inDate = new Date();
      inDate.setDate(inDate.getDate() + 1);
      const outDate = new Date(inDate);
      outDate.setDate(outDate.getDate() + 1);
      setBookStart(inDate.toISOString().slice(0, 10));
      setBookEnd(outDate.toISOString().slice(0, 10));
    }
    setAdults(1);
    setChildren(0);
    setBookingOpen(true);
  };

  const confirmBooking = () => {
    const payload = {
      dateIn: bookStart || null,
      dateOut: bookEnd || null,
      startDate: bookStart || null,
      endDate: bookEnd || null,
      adults,
      children,
      item: selectedItem || null,
    };
    // demo: alert — replace with router or API call when ready
    // get a stable id from selectedItem
const stableId = selectedItem?._id?.$oid ?? selectedItem?._id ?? selectedItem?.id ?? null;
const isPackage = !!(selectedItem && Array.isArray(selectedItem.days) && selectedItem.days.length > 0);
const type = isPackage ? 'package' : 'property';

// build URL with booking params so PropertyPage can read and prefill
const qs = new URLSearchParams();
if (stableId) qs.set('id', String(stableId));
qs.set('type', type);
if (payload.dateIn) qs.set('dateIn', payload.dateIn);
if (payload.dateOut) qs.set('dateOut', payload.dateOut);
if (payload.adults !== undefined) qs.set('adults', String(payload.adults));
if (payload.children !== undefined) qs.set('children', String(payload.children));


 // alert("Booking payload:\n" + JSON.stringify(payload, null, 2));
    setBookingOpen(false);
// navigate to property page (lowercase)
window.location.href = '/Property?' + qs.toString();

  
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const closePanels = () => {
    setBookingOpen(false);
    setDetailsOpen(false);
    setSelectedItem(null);
  };

  const renderAmenityChips = (amenitiesObj) => {
    if (!amenitiesObj || typeof amenitiesObj !== "object") return null;
    const keys = Object.keys(AMENITY_LABELS).filter((k) => Object.prototype.hasOwnProperty.call(amenitiesObj, k) && !!amenitiesObj[k]);
    if (keys.length === 0) return null;
    const max = 6;
    const display = keys.slice(0, max);
    return display.map((k, i) => {
      if (i === max - 1 && keys.length > max) {
        return (<span key={"ellipsis"} className="amenity-chip">…</span>);
      }
      return (<span key={k} className="amenity-chip">{AMENITY_LABELS[k]}</span>);
    });
  };

  return (
    <div className="page-root">
      {/* HERO */}
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <h1 className="hero-title">Book Extraordinary Stays</h1>
          <p className="hero-sub">Curated hotels, apartments and unique homes across Africa and beyond.</p>

          <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
            <div className="search-field">
              <div className="icon-left location-svg" aria-hidden />
              <input placeholder="Where are you going? (city, region)" aria-label="Location" />
            </div>

            <div className="search-field">
              <div className="icon-left guests-svg" aria-hidden />
              <input placeholder="Guests or amenity (e.g., 2 guests, pool)" aria-label="Guests or amenity" />
            </div>

            <div className="search-controls">
              <select aria-label="Minimum rating">
                <option value={0}>Any rating</option>
                <option value={4.5}>4.5+</option>
                <option value={4.0}>4.0+</option>
                <option value={3.5}>3.5+</option>
              </select>
              <button className="btn-primary" type="submit">Search</button>
              <button className="btn-ghost" type="button">Reset</button>
            </div>
          </form>
        </div>
      </header>

      {/* TRUST */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item"><strong>2M+</strong><span>Bookings</span></div>
          <div className="trust-item"><strong>150+</strong><span>Countries</span></div>
          <div className="trust-item"><strong>24/7</strong><span>Support</span></div>
          <div className="trust-item"><strong>98%</strong><span>Satisfaction</span></div>
        </div>
      </section>

      {/* LISTINGS */}
      <main className="listings-section">
        <div className="listings-header">
          <h2>Top Rated Stays</h2>
          <p className="muted">Handpicked stays with powerful filters and clear booking details.</p>
        </div>

        {loadingProps ? (
          <div className="loading-placeholder">Loading properties…</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : (
          <div className="cards-grid">
            {properties.length === 0 ? (
              <div className="empty-box">No properties available — try later.</div>
            ) : properties.map((item, idx) => {
              const id = item._id ? (typeof item._id === "object" && item._id.$oid ? String(item._id.$oid) : String(item._id)) : (item.id ? String(item.id) : `prop-${idx}`);
              const imgs = Array.isArray(item.images) ? item.images : (item.images && typeof item.images === "object" ? gatherAllImageUrls(item.images).map(u => ({ url: u })) : []);
              const imgUri = imgs[0] ? (imgs[0].url || imgs[0].uri) : null;
              const price = item.pricing?.pricePerNight ?? item.price ?? item.propertyprice ?? 0;
              const beds = item.capacity?.bedrooms ?? item.bedroom ?? "-";
              const baths = item.capacity?.bathrooms ?? item.bathroom ?? "-";
              const sqft = item.capacity?.sqft ?? item.size ?? "-";
              const loc = `${item.location?.city || ""} ${item.location?.region || ""} ${item.location?.country || ""}`.trim();

              const amenityChips = Object.keys(AMENITY_LABELS)
                .filter((k) => item.amenities && Object.prototype.hasOwnProperty.call(item.amenities, k) && !!item.amenities[k])
                .map((k) => AMENITY_LABELS[k]);

              return (
                <article className="card" key={id}>
                  <div className="card-media">
                    {imgUri ? <img src={imgUri} alt={item.title} /> : <div className="no-photo">No photo</div>}

                    <div className="card-price">
                      {item.pricing && item.pricing.currency ? `${item.pricing.currency} ${formatMoney(price)} / night` : `KSh ${formatMoney(price)} / night`}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-top">
                      <h3 className="card-title" title={item.title}>{item.title || "Untitled property"}</h3>
                      <div className="rating">
                        <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" /></svg>
                        <span className="rating-value">{item.rating ?? "-"}</span>
                        <span className="rating-reviews">{item.reviews ? `(${item.reviews})` : ""}</span>
                      </div>
                    </div>

                    {/* Bed / Bath / Sqft row restored */}
                    <div className="card-stats">
                      <div className="stat-chip"><strong>{beds}</strong><span>Beds</span></div>
                      <div className="stat-chip"><strong>{baths}</strong><span>Baths</span></div>
                      <div className="stat-chip"><strong>{sqft}</strong><span>Sqft</span></div>
                    </div>

                    <div className="card-location">
                      <svg className="loc-icon" viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="8" r="2" fill="#374151"/></svg>
                      <span>{loc}</span>
                    </div>

                    <div className="card-amenities">
                      {amenityChips.length === 0 ? (
                        <>
                          <span className="amenity-chip">WiFi</span>
                          <span className="amenity-chip">Breakfast</span>
                        </>
                      ) : (
                        // show up to 6 chips and use ellipsis if more
                        (() => {
                          const keys = Object.keys(AMENITY_LABELS).filter((k) => item.amenities && Object.prototype.hasOwnProperty.call(item.amenities, k) && !!item.amenities[k]);
                          const max = 6;
                          return keys.slice(0, max).map((k, i) => {
                            if (i === max - 1 && keys.length > max) {
                              return <span key={"ellips-" + i} className="amenity-chip">…</span>;
                            }
                            return <span key={k} className="amenity-chip">{AMENITY_LABELS[k]}</span>;
                          });
                        })()
                      )}
                    </div>

                    <div className="card-actions">
                      <button className="btn-primary" onClick={() => openBookingFor(item)}>Book now</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* PACKAGES (unchanged) */}
      <section className="packages-section">
        <div className="packages-inner">
          <div className="packages-header">
            <h3>Featured packages</h3>
            <a className="view-all" href="#allpackages">View all</a>
          </div>

          {loadingPkgs ? (
            <div className="loading-placeholder small">Loading packages…</div>
          ) : packages.length === 0 ? (
            <div className="empty-box small">No packages available — try later.</div>
          ) : (
            <div className="packages-row">
              {packages.map((p, i) => {
                const stableKey = p._id ?? p.id ?? `pkg-${i}`;
                const imgUri = (p.images && p.images[0] && (p.images[0].url || p.images[0].uri)) ? (p.images[0].url || p.images[0].uri) : null;
                return (
                  <div key={String(stableKey)} className="package-card">
                    {imgUri ? <img src={imgUri} alt={p.title} /> : <div className="no-photo small">No photo</div>}
                    <div className="package-info">
                      <div className="package-title">{p.title || "Package"}</div>
                      <div className="package-meta">{p.durationLabel || p.duration || "1 day"} • {Array.isArray(p.days) ? p.days.length : 0} stops</div>
                      <div className="package-price">{p.pricing?.pricePerPerson ? `KSh ${formatMoney(p.pricing.pricePerPerson)}` : p.price ? `KSh ${formatMoney(p.price)}` : ""}</div>
                    </div>
                  </div>
                );
              })}
              <div className="package-card explore-more">
                <div className="package-info" style={{ padding: 28 }}>
                  <div className="package-title">Explore more</div>
                  <div style={{ color: "#666", marginTop: 8 }}>See all packages & offers</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <h4>BookingPro</h4>
            <p className="muted">World-class booking platform inspired by the best in the industry.</p>
          </div>
          <div>
            <h5>Company</h5>
            <ul className="footer-links"><li>About</li><li>Careers</li><li>Press</li></ul>
          </div>
          <div style={{ gridColumn: "1 / -1", marginTop: 12 }}>
            <small>© {new Date().getFullYear()} BookingPro — Built for scale.</small>
          </div>
        </div>
      </footer>

      {/* Booking Drawer (right-side) */}
      <div className={`booking-drawer ${bookingOpen ? "open" : ""}`} role="dialog" aria-hidden={!bookingOpen}>
        <div className="drawer-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>{selectedItem?.title || "Booking"}</h3>
              <div style={{ color: "#6b7280", marginTop: 6, fontSize: 13 }}>
                {selectedItem?.location?.city ? `${selectedItem.location.city}, ${selectedItem.location.region || ""}` : ""}
              </div>
            </div>
            <button className="drawer-close" onClick={closePanels} aria-label="Close booking panel">×</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ width: "100%", height: 160, overflow: "hidden", borderRadius: 8 }}>
              <img
                src={(selectedItem && selectedItem.images && selectedItem.images[0] && (selectedItem.images[0].url || selectedItem.images[0].uri)) || "https://images.unsplash.com/photo-1502920514313-52581002a659?w=1200&q=60&auto=format&fit=crop"}
                alt={selectedItem?.title || "cover"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  {selectedItem?.pricing?.currency ? `${selectedItem.pricing.currency} ${formatMoney(selectedItem.pricing.pricePerNight ?? selectedItem.price ?? 0)}` : `KSh ${formatMoney(selectedItem?.price ?? 0)}`}
                </div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>/ night</div>
              </div>
              <div>
                <button className="btn-outline" onClick={() => openDetails(selectedItem)}>View details</button>
              </div>
            </div>

            {/* Date pickers */}
            <div style={{ marginTop: 14 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#6b7280" }}>Check-in</label>
              <input type="date" value={bookStart} onChange={(e) => setBookStart(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: "#6b7280" }}>Check-out</label>
              <input type="date" value={bookEnd} onChange={(e) => setBookEnd(e.target.value)} style={inputStyle} />
            </div>

            {/* guests steppers */}
            <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Adults</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button className="step-btn" onClick={() => setAdults((a) => Math.max(1, a - 1))}>−</button>
                  <div style={{ minWidth: 34, textAlign: "center" }}>{adults}</div>
                  <button className="step-btn" onClick={() => setAdults((a) => Math.min(99, a + 1))}>＋</button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Children</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button className="step-btn" onClick={() => setChildren((c) => Math.max(0, c - 1))}>−</button>
                  <div style={{ minWidth: 34, textAlign: "center" }}>{children}</div>
                  <button className="step-btn" onClick={() => setChildren((c) => Math.min(99, c + 1))}>＋</button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                className="btn-primary"
                onClick={confirmBooking}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10 }}
              >
                Confirm
              </button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="btn-ghost" onClick={closePanels} style={{ width: "100%" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <div className={`details-modal ${detailsOpen ? "open" : ""}`} role="dialog" aria-hidden={!detailsOpen}>
        <div className="details-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{selectedItem?.title || "Details"}</h3>
            <button className="drawer-close" onClick={() => setDetailsOpen(false)} aria-label="Close details">×</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ width: "100%", height: 240, overflow: "hidden", borderRadius: 8 }}>
              <img
                src={(selectedItem && selectedItem.images && selectedItem.images[0] && (selectedItem.images[0].url || selectedItem.images[0].uri)) || "https://images.unsplash.com/photo-1502920514313-52581002a659?w=1200&q=60&auto=format&fit=crop"}
                alt={selectedItem?.title || "cover"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ color: "#6b7280", marginBottom: 8 }}>{selectedItem?.summary || selectedItem?.description || "No description available."}</div>

              <div style={{ marginTop: 8 }}>
                <strong>Amenities</strong>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {selectedItem?.amenities ? (
                    Object.keys(AMENITY_LABELS)
                      .filter((k) => selectedItem.amenities && Object.prototype.hasOwnProperty.call(selectedItem.amenities, k) && !!selectedItem.amenities[k])
                      .map((k) => (
                        <span key={k} className="amenity-chip">
                          {AMENITY_LABELS[k]}
                        </span>
                      ))
                  ) : (
                    <div style={{ color: "#6b7280" }}>No amenities listed</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Location</strong>
                <div style={{ color: "#111827", marginTop: 6 }}>{selectedItem?.location?.address || ""}</div>
                <div style={{ color: "#6b7280", marginTop: 2 }}>
                  {selectedItem?.location?.city || ""} {selectedItem?.location?.region || ""} {selectedItem?.location?.country || ""}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn-primary" onClick={() => { setDetailsOpen(false); setBookingOpen(true); }}>
                Book now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Styles — compact card + restored stats + small fixes for icons/price visibility */
const styles = `
:root{
  --bg:#f7f9fc;
  --card:#ffffff;
  --muted:#6b7280;
  --primary:#0B78A3;
  --accent:#7c3aed;
  --shadow: 0 10px 30px rgba(2,6,23,0.08);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:#0f172a;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.page-root{min-height:100vh;display:flex;flex-direction:column;font-family:Inter,system-ui,Segoe UI,Roboto,Arial}

/* HERO */
.hero{position:relative;background-image:linear-gradient(180deg,rgba(15,23,42,0.25),rgba(15,23,42,0.45)),url('https://images.unsplash.com/photo-1502920514313-52581002a659?w=1800&q=60&auto=format&fit=crop');background-size:cover;background-position:center;color:#fff;padding:64px 20px 48px;text-align:center}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg, rgba(15,23,42,0.25), rgba(15,23,42,0.55));}
.hero-inner{position:relative;z-index:2;max-width:1100px;margin:0 auto}
.hero-title{font-size:40px;margin:0 0 8px;font-weight:700}
.hero-sub{margin:0 0 20px;color:rgba(255,255,255,0.95);font-size:16px}

/* Search bar */
.search-bar{display:flex;gap:12px;align-items:center;justify-content:center;background:rgba(255,255,255,0.06);backdrop-filter:blur(5px);padding:12px;border-radius:14px;box-shadow:var(--shadow);flex-wrap:wrap}
.search-field{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border-radius:10px;padding:10px 12px;min-width:200px;color:#fff}
.search-field input{border:0;background:transparent;color:#fff;padding:6px;outline:none;min-width:120px}
.icon-left{display:inline-flex;align-items:center;color:rgba(255,255,255,0.95)}
.search-controls{display:flex;gap:10px;align-items:center}
.search-controls select{padding:10px;border-radius:10px;border:0;background:#fff;font-size:14px}
.btn-primary{background:linear-gradient(90deg,var(--primary),var(--accent));color:white;border:0;padding:10px 14px;border-radius:10px;cursor:pointer;font-weight:600}
.btn-ghost{background:transparent;border:0;color:white;padding:8px;font-weight:600}

/* TRUST */
.trust-section{padding:28px 16px;background:#fff;margin-top:-20px;box-shadow:0 6px 24px rgba(2,6,23,0.04)}
.trust-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:14px;text-align:center;padding:8px}
@media(min-width:800px){.trust-grid{grid-template-columns:repeat(4,1fr)}}
.trust-item{padding:16px;border-radius:10px;background:linear-gradient(180deg,#fff,#fbfbfd);box-shadow:inset 0 -1px 0 rgba(15,23,42,0.02)}
.trust-item strong{display:block;font-size:20px}
.trust-item span{color:var(--muted);font-size:13px}

/* LISTINGS */
.listings-section{max-width:1200px;margin:28px auto;padding:0 20px 36px}
.listings-header{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
.listings-header h2{margin:0;font-size:28px}
.muted{color:var(--muted)}

.cards-grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:700px){.cards-grid{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1100px){.cards-grid{grid-template-columns:repeat(3,1fr)}}

/* card */
.card{background:var(--card);border-radius:14px;overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column;transition:transform .18s ease,box-shadow .18s ease}
.card:hover{transform:translateY(-8px);box-shadow:0 18px 40px rgba(2,6,23,0.12)}
.card-media{position:relative;height:0;padding-bottom:56%;overflow:hidden;background:#eee}
.card-media img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}
.no-photo{position:absolute;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f3f7f8;color:#9aa3ad}
.card-price{position:absolute;right:2;bottom:12;background:linear-gradient(90deg,#0b78a3,#4c66a3);color:white;padding:8px 10px;border-radius:10px;font-weight:700;font-size:14px;z-index:5}

/* body */
.card-body{padding:14px;display:flex;flex-direction:column;gap:10px}
.card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.card-title{margin:0;font-size:16px;font-weight:700;line-height:1.1}
.rating{display:flex;align-items:center;gap:6px;color:#f59e0b;font-weight:600}
.rating-value{color:#0f172a}
.rating-reviews{color:var(--muted);font-size:12px;margin-left:6px}

/* stat chips row (beds/baths/sqft) */
.card-stats{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap}
.stat-chip{display:flex;flex-direction:column;align-items:flex-start;background:#f8fafc;border:1px solid rgba(15,23,42,0.04);padding:6px 10px;border-radius:10px;font-size:13px;color:#111}
.stat-chip strong{font-size:14px}
.stat-chip span{font-size:12px;color:var(--muted)}

/* location + amenities */
.card-location{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;margin-top:6px}
.loc-icon{width:14px;height:14px}
.card-amenities{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.amenity-chip{background:linear-gradient(180deg,#f8fafc,#ffffff);border:1px solid rgba(15,23,42,0.04);padding:6px 8px;border-radius:999px;font-size:12px;color:var(--muted)}

/* single action button */
.card-actions{margin-top:12px;display:flex}
.card-actions .btn-primary{flex:1}

/* PACKAGES */
.packages-section{padding:24px 20px;background:#fff;margin-top:18px}
.packages-inner{max-width:1200px;margin:0 auto}
.packages-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.packages-row{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px}
.package-card{width:320px;border-radius:12px;overflow:hidden;background:#fff;border:1px solid #E8EEF3;flex-shrink:0}
.package-card img{width:100%;height:140px;object-fit:cover}
.package-info{padding:12px}
.package-title{font-weight:700}
.package-meta{color:var(--muted);margin-top:6px}
.package-price{margin-top:8px;color:var(--primary);font-weight:800}
.explore-more{background:#FAFBFF;display:flex;align-items:center;justify-content:center}

/* FOOTER */
.site-footer{background:#0f172a;color:rgba(255,255,255,0.9);padding:36px 20px;margin-top:36px}
.footer-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.footer-inner{grid-template-columns:repeat(3,1fr)}}
.footer-links{list-style:none;padding:0;margin:0;display:flex;gap:12px}
.loading-placeholder{padding:18px;text-align:center;background:#fff;border-radius:12px;box-shadow:var(--shadow)}
.empty-box{padding:18px;background:#fff;border-radius:12px;box-shadow:var(--shadow)}
.error-box{padding:12px;background:#fee2e2;color:#991b1b;border-radius:10px;text-align:center}

/* small utility */
.small{font-size:13px}

/* icons in search (simple svg backgrounds) */
.location-svg{width:18px;height:18px;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><path d='M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='12' cy='8' r='2' fill='%23ffffff'/></svg>");background-size:contain;background-repeat:no-repeat;opacity:0.95}
.guests-svg{width:18px;height:18px;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'><path d='M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM8 13c-2.5 0-7 1.25-7 3.75V20h14v-3.25C15 14.25 10.5 13 8 13zM16 13c-.29 0-.583.017-.876.05C15.61 13.1 16 13.495 16 14v2h6v-3.25C22 14.25 17.5 13 16 13z' /></svg>");background-size:contain;background-repeat:no-repeat;opacity:0.95}

/* Booking drawer (minimal, appended so we don't change original styles) */
.booking-drawer{
  position:fixed; right:0; top:0; bottom:0; width:420px; transform:translateX(110%); transition:transform .28s ease; z-index:60;
  box-shadow:-20px 0 40px rgba(2,6,23,0.12);
}
.booking-drawer.open{transform:translateX(0)}
.booking-drawer .drawer-inner{background:#fff;height:100%;padding:18px;display:flex;flex-direction:column;gap:12px;overflow:auto}
.drawer-close{background:transparent;border:0;font-size:22px;line-height:1;cursor:pointer}

/* Details modal (centered) */
.details-modal{position:fixed;left:0;top:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:rgba(4,12,20,0.45);z-index:70}
.details-modal.open{display:flex}
.details-content{background:#fff;max-width:820px;width:92%;border-radius:12px;padding:18px;max-height:86vh;overflow:auto}

/* amenity chip (already present but ensure tiny tweaks) */
.amenity-chip{background:linear-gradient(180deg,#f8fafc,#ffffff);border:1px solid rgba(15,23,42,0.04);padding:6px 8px;border-radius:999px;font-size:12px;color:var(--muted)}

/* small steppers */
.step-btn{width:36px;height:36px;border-radius:8px;border:0;background:#f3f5f7;cursor:pointer}
`;

/* small inline styles used in JSX */
const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #e6eef6",
  outline: "none",
  fontSize: 14,
};

export default Support;
