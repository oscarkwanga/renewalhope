// src/TransactionsPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../transactions.css";

const API_BASE_URL = (process.env.REACT_APP_DOMAIN || "").replace(/\/$/, "");

const toLocalKenyanNumber = (msisdn) => {
  if (msisdn === undefined || msisdn === null) return "";
  const s = String(msisdn).trim();
  if (!s) return "";
  if (s.startsWith("0")) return s;
  return s.replace(/^(\+?254)/, "0");
};

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d)) return String(isoDate);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const statusClass = (status) => {
  if (!status) return "status-default";
  const s = String(status).toLowerCase();
  if (s.includes("pending") || s.includes("request")) return "status-pending";
  if (s.includes("success") || s.includes("paid") || s.includes("completed")) return "status-success";
  if (s.includes("failed") || s.includes("error")) return "status-failed";
  if (s.includes("cancel") || s.includes("rejected")) return "status-cancelled";
  return "status-default";
};

const getField = (obj = {}, candidates = [], fallback = "Not provided") => {
  for (const k of candidates) {
    if (!k) continue;
    const parts = (k && k.split) ? k.split(".") : [k];
    let val = obj;
    let ok = true;
    for (const p of parts) {
      if (val && typeof val === "object" && (p in val)) val = val[p];
      else { ok = false; break; }
    }
    if (ok && val !== null && val !== undefined && String(val).trim?.() !== "") return val;
  }
  return fallback;
};

/* ----- small helper to build image URL from a property transaction shape ----- */
const getTransactionImageUrl = (txn) => {
  try {
    const property = txn?.property || txn?.listing || {};
    if (!property) return null;
    const images = property.images || property.imagesObj || {};
    // images could be object of arrays, or array
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      return typeof first === "string" ? first : (first.secure_url || first.url || first.path || null);
    }
    if (typeof images === "object") {
      for (const k of Object.keys(images)) {
        const arr = images[k];
        if (Array.isArray(arr) && arr.length > 0) {
          const item = arr[0];
          if (!item) continue;
          if (typeof item === "string") return item;
          if (item.secure_url) return item.secure_url;
          if (item.url) return item.url;
          if (item.path) return item.path;
        }
      }
    }
    // fallback to property.cover or property.image
    if (property.cover) {
      if (typeof property.cover === "string") return property.cover;
      if (property.cover.secure_url) return property.cover.secure_url;
    }
    if (property.image) {
      if (typeof property.image === "string") return property.image;
      if (property.image.secure_url) return property.image.secure_url;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

/* ----- axios client (with credentials so admin cookie flows work) ----- */
const client = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
  timeout: 30000,
});

/* ------------------- Component ------------------- */

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const modalTimerRef = useRef(null);
  const socketRef = useRef(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    client.get("/api/mpesa/transactions")
      .then(({ data }) => {
        if (!mounted) return;
        setTransactions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed loading transactions:", err);
        setTransactions([]);
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // connect socket
    try {
      socketRef.current = io(API_BASE_URL || undefined, { transports: ["websocket"], upgrade: false, secure: true });
    } catch (e) {
      socketRef.current = io();
    }

    const s = socketRef.current;
    s.on("connect", () => console.debug("transactions socket connected"));
    s.on("newtransaction", (newTxn) => setTransactions((prev) => [newTxn, ...prev]));
    s.on("transactionUpdated", (updatedTxn) =>
      setTransactions((prev) => prev.map((t) => {
        // match by checkoutRequestID if present, else by _id or id
        if (updatedTxn?.checkoutRequestID && t?.checkoutRequestID === updatedTxn.checkoutRequestID) return updatedTxn;
        if (updatedTxn?._id && t?._id && String(t._id) === String(updatedTxn._id)) return updatedTxn;
        if (updatedTxn?.id && t?.id && String(t.id) === String(updatedTxn.id)) return updatedTxn;
        return t;
      }))
    );

    return () => { try { socketRef.current.disconnect(); } catch (e) {} };
  }, []);

  const filtered = useMemo(() => {
    const q = String(searchText || "").trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) => {
      const phone = toLocalKenyanNumber(getField(t, ["phone", "msisdn", "from"], "")).toLowerCase();
      const mpesa = String(getField(t, ["mpesaReceiptNumber", "receipt"], "")).toLowerCase();
      const pname = String(getField(t, ["property.propertyname", "property.name", "listing.title"], "")).toLowerCase();
      return phone.includes(q) || mpesa.includes(q) || pname.includes(q);
    });
  }, [transactions, searchText]);

  const openModal = (txn) => {
    setSelectedTxn(txn);
    setModalLoading(true);
    clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => setModalLoading(false), 220);
  };
  const closeModal = () => {
    clearTimeout(modalTimerRef.current);
    setSelectedTxn(null);
    setModalLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      setToast("Copied to clipboard");
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      console.error("copy failed", e);
      alert("Could not copy to clipboard");
    }
  };

  /* Modal component showing full transaction + property details */
  const TransactionModal = ({ txn, onClose, loading }) => {
    if (!txn) return null;
    const imageUrl = getTransactionImageUrl(txn);
    const prop = txn.property || txn.listing || null;
    const receipt = getField(txn, ["mpesaReceiptNumber", "receipt", "MpesaReceiptNumber"], "—");
    const phone = toLocalKenyanNumber(getField(txn, ["phone", "msisdn", "from", "msisdn"], ""));
    const amount = getField(txn, ["amount", "Amount", "paidAmount"], "—");
    const status = getField(txn, ["status", "paymentStatus", "resultCode", "resultStatus"], "—");
    const date = getField(txn, ["createdAt", "timestamp", "date"], txn.createdAt || txn.timestamp || txn.date || "");
    const checkoutRequestID = getField(txn, ["checkoutRequestID", "CheckoutRequestID", "checkout_id"], "");
    const raw = txn; // show raw JSON later if needed

    return ReactDOM.createPortal(
      <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Transaction details</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
          </div>

          {loading ? (
            <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="modal-body">
              <div className="modal-left">
                <div className="hero-img-wrap">
                  <img src={imageUrl || "/placeholder-hero.png"} alt="property" onError={(e) => (e.target.src = "/placeholder-hero.png")} />
                </div>

                <div className="info-card">
                  <div className="info-row"><strong>Amount</strong><span>{amount}/-</span></div>
                  <div className="info-row"><strong>Status</strong><span className={`tx-status ${statusClass(status)}`}>{status}</span></div>
                  <div className="info-row"><strong>Receipt</strong><span style={{ fontWeight: 600 }}>{receipt}</span></div>
                  <div className="info-row"><strong>Phone</strong><span>{phone}</span></div>
                  <div className="info-row"><strong>Date</strong><span>{formatDate(date)}</span></div>
                </div>

                <div className="info-card">
                  <h4 style={{ margin: "0 0 8px 0" }}>Quick actions</h4>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn btn-ghost" onClick={() => copyToClipboard(receipt)}>Copy receipt</button>
                    <button className="btn btn-ghost" onClick={() => copyToClipboard(checkoutRequestID)}>Copy checkout ID</button>
                  
                  </div>
                </div>
              </div>

              <div className="modal-right">
                <div className="section-block">
                  <h3>Transaction</h3>
                  <div className="field"><strong>MPESA receipt</strong><div className="desc">{receipt}</div></div>
                  <div className="field"><strong>Amount</strong><div className="desc">{amount} /-</div></div>
                  <div className="field"><strong>Phone</strong><div className="desc">{phone}</div></div>
                  <div className="field"><strong>Status</strong><div className="desc">{status}</div></div>
                  <div className="field"><strong>Checkout ID</strong><div className="desc">{checkoutRequestID || "—"}</div></div>
                  <div className="field"><strong>Timestamp</strong><div className="desc">{formatDate(date)}</div></div>
                </div>

                <div className="section-block">
                  <h3>Property</h3>
                  <div className="field"><strong>Title</strong><div className="desc">{getField(prop, ["propertyname", "name", "title"], "—")}</div></div>
                  <div className="field"><strong>Location</strong><div className="desc">{getField(prop, ["propertylocation", "location", "address"], "—")}</div></div>
                  <div className="field"><strong>Price</strong><div className="desc">{getField(prop, ["propertyprice", "price"], "—")}</div></div>
                  <div className="field"><strong>Landlord</strong><div className="desc">{getField(prop, ["landlord.firstname", "landlordName", "ownerName", "landlord"], "—")}</div></div>
                  <div className="field"><strong>Landlord contact</strong><div className="desc">{toLocalKenyanNumber(getField(prop, ["landlord.contact", "landlord.phone", "contact"], "—"))}</div></div>
                </div>

                <div className="section-block">
                  <h3>Raw data</h3>
                  <div className="expanded-keys" style={{ maxHeight: 260, overflow: "auto" }}>
                    {/* show a few useful keys from the raw txn object */}
                    {Object.entries({
                      id: txn._id || txn.id || "—",
                      checkoutRequestID: checkoutRequestID || "—",
                      resultCode: getField(txn, ["resultCode", "ResultCode"], "—"),
                      resultDesc: getField(txn, ["resultDesc", "ResultDesc", "resultDescription"], "—"),
                      callbackData: txn.callbackData ? "[object]" : "—",
                    }).map(([k, v]) => (
                      <div key={k} className="kv-line">
                        <div className="kv-key">{k}</div>
                        <div className="kv-val">{typeof v === "string" ? v : JSON.stringify(v)}</div>
                      </div>
                    ))}

                    {/* full JSON preview collapsible (lightweight) */}
                    <details style={{ marginTop: 8 }}>
                      <summary className="small">Show full JSON</summary>
                      <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 8 }}>{JSON.stringify(raw, null, 2)}</pre>
                    </details>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>,
      document.getElementById("modal-root") || document.body
    );
  };

  return (
    <div className="tx-page-root">
      <div className="tx-topbar">
        <h1 className="tx-title">Transactions</h1>
        <p className="tx-sub">Click a row to view full property & transaction details</p>
      </div>

      <div className="tx-list-panel">
        <div className="tx-panel-header">
          <input
            className="tx-search"
            placeholder="Search by phone, mpesa receipt or property name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="tx-table-wrap">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <table className="tx-table">
              <thead className="tx-table-head">
                <tr>
                  <th>#</th>
                  <th>Property</th>
                  <th>Mpesa</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="tx-table-body">
                {filtered.map((txn, idx) => {
                  const propName = getField(txn, ["property.propertyname", "property.name", "listing.title"], "—");
                  return (
                    <tr key={txn._id || txn.id || idx} onClick={() => openModal(txn)} className="tx-row">
                      <td>{idx + 1}</td>
                      <td className="tx-prop">{String(propName).slice(0, 60)}</td>
                      <td>{getField(txn, ["mpesaReceiptNumber", "receipt"], "—")}</td>
                      <td>{toLocalKenyanNumber(getField(txn, ["phone", "msisdn", "from"], ""))}</td>
                      <td>{getField(txn, ["amount", "Amount"], "—")}/-</td>
                      <td><span className={`tx-status ${statusClass(getField(txn, ["status"], ""))}`}>{getField(txn, ["status"], "—")}</span></td>
                      <td>{formatDate(getField(txn, ["createdAt", "timestamp", "date"], ""))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTxn && <TransactionModal txn={selectedTxn} onClose={closeModal} loading={modalLoading} />}
      {toast && <div style={{ position: "fixed", right: 22, bottom: 22, background: "#0B78A3", color: "#fff", padding: "8px 12px", borderRadius: 8 }}>{toast}</div>}
    </div>
  );
};

export default TransactionsPage;
