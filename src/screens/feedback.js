// src/pages/Feedbacks.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../feedback.css"; // styles below

const API_BASE = process.env.REACT_APP_DOMAIN || "";
const SOCKET_BASE = (API_BASE || "").replace(/\/$/, "");

const getDisplayName = (sender) => {
  if (!sender) return "Unknown";
  if (typeof sender === "string") return sender;
  if (sender.name) return sender.name;
  const first = sender.firstname || "";
  const last = sender.lastname || "";
  return (first + (last ? " " + last : "")).trim() || sender.email || String(sender._id || sender.id || "Unknown");
};

const getAvatar = (sender) => {
  if (!sender) return null;
  if (typeof sender === "object" && sender.profileImage) return sender.profileImage;
  // fallback: gravatar or placeholder
  return null;
};

export const Feedback = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all|unread|read
  const [selected, setSelected] = useState(null);
  const [marking, setMarking] = useState(false);

  const socketRef = useRef(null);

  // fetch feed
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/feedback`);
      const arr = Array.isArray(res.data) ? res.data : (res.data?.data ? res.data.data : []);
      setItems(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error("Could not fetch feedback:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const s = io(SOCKET_BASE, { transports: ["websocket"], secure: SOCKET_BASE.startsWith("https"), reconnection: true });
    socketRef.current = s;

    s.on("connect", () => setSocketConnected(true));
    s.on("disconnect", () => setSocketConnected(false));

    s.on("newfeed", (feed) => {
      if (!feed) return;
      setItems(prev => {
        if (prev.some(p => String(p._id) === String(feed._id))) return prev;
        return [feed, ...prev];
      });
    });

    s.on("feedUpdated", (feed) => {
      if (!feed) return;
      setItems(prev => prev.map(p => (String(p._id) === String(feed._id) ? feed : p)));
    });

    return () => {
      try { s.disconnect(); } catch (e) {}
    };
  }, []);

  const counts = useMemo(() => {
    const unread = items.filter(i => !i.isRead).length;
    return { total: items.length, unread };
  }, [items]);

  const filtered = useMemo(() => {
    const qlc = (q || "").trim().toLowerCase();
    return items.filter(it => {
      if (filter === "unread" && it.isRead) return false;
      if (filter === "read" && !it.isRead) return false;
      if (!qlc) return true;
      const title = (it.title || "").toLowerCase();
      const msg = (it.message || "").toLowerCase();
      const name = (typeof it.senderid === 'object' ? (it.senderid.name || `${it.senderid.firstname || ""} ${it.senderid.lastname || ""}`) : String(it.senderid || "")).toLowerCase();
      return title.includes(qlc) || msg.includes(qlc) || name.includes(qlc);
    });
  }, [items, q, filter]);

  const openDetails = async (it) => {
    setSelected(it);
    // auto mark read when opened
    if (!it.isRead) await toggleRead(it, true, { localOnly: false });
  };
  const closeDetails = () => setSelected(null);

  // toggle read: if localOnly true only updates UI, else calls API
  const toggleRead = async (it, toState = null, opts = { localOnly: false }) => {
    try {
      const newVal = (toState === null) ? !it.isRead : Boolean(toState);
      if (opts.localOnly) {
        setItems(prev => prev.map(p => (String(p._id) === String(it._id) ? { ...p, isRead: newVal } : p)));
        if (selected && String(selected._id) === String(it._id)) setSelected(prev => prev ? ({ ...prev, isRead: newVal }) : prev);
        return;
      }
      setMarking(true);
      const res = await axios.patch(`${API_BASE}/feedback/${it._id}/read`, { isRead: newVal });
      if (res && res.data) {
        const updated = res.data;
        setItems(prev => prev.map(p => (String(p._id) === String(updated._id) ? updated : p)));
        if (selected && String(selected._id) === String(updated._id)) setSelected(updated);
      }
    } catch (err) {
      console.error('toggleRead error', err);
    } finally {
      setMarking(false);
    }
  };

  const markAllRead = async () => {
    const unread = items.filter(i => !i.isRead);
    if (unread.length === 0) return;
    setMarking(true);
    try {
      await Promise.all(unread.map(i => axios.patch(`${API_BASE}/feedback/${i._id}/read`, { isRead: true })));
      await fetchAll();
    } catch (err) {
      console.error('markAllRead failed', err);
    } finally {
      setMarking(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="fb-shell">
      <header className="fb-header">
        <div className="fb-head-left">
          <h1>Feedback Inbox</h1>
          <div className="fb-sub">All user feedback — real time</div>
        </div>

        <div className="fb-head-right">
          <div className="fb-search">
            <input placeholder="Search name, title, or message..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="fb-stats">
            <div className="fb-chip" title="Total">
              Total <span className="fb-badge">{counts.total}</span>
            </div>

            <div className="fb-chip" title="Unread">
              Unread <span className="fb-badge">{counts.unread}</span>
            </div>

            <button className="fb-chip" onClick={markAllRead} disabled={marking || counts.unread === 0}>
              Mark all read
            </button>

            <div className={`fb-socket ${socketConnected ? "online" : "offline"}`} title={socketConnected ? "Realtime connected" : "Offline"}>
              {socketConnected ? "● Live" : "○ Offline"}
            </div>
          </div>
        </div>
      </header>

      <main className="fb-main">
        <aside className="fb-left">
          <div className="fb-filters">
            <button className={`fb-filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
            <button className={`fb-filter ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>Unread</button>
            <button className={`fb-filter ${filter === "read" ? "active" : ""}`} onClick={() => setFilter("read")}>Read</button>
          </div>

          <div className="fb-list">
            {loading ? (
              <div className="fb-empty">Loading feedback…</div>
            ) : filtered.length === 0 ? (
              <div className="fb-empty">No feedback found.</div>
            ) : filtered.map(it => {
              const sender = it.senderid && typeof it.senderid === 'object' ? it.senderid : null;
              const name = getDisplayName(sender || it.senderid);
              const avatar = getAvatar(sender);
              const isRead = Boolean(it.isRead);
              return (
                <div key={it._id} className={`fb-item ${isRead ? "read" : "unread"}`} onClick={() => openDetails(it)}>
                  <div className="fb-leftcol">
                    <div className="fb-avatar-wrap">
                      {avatar ? <img src={avatar} alt={name} className="fb-avatar" /> : <div className="fb-avatar-fallback">{(name || "U").charAt(0)}</div>}
                      {!isRead && <div className="fb-dot" />}
                    </div>
                  </div>

                  <div className="fb-content">
                    <div className="fb-row">
                      <div className={`fb-title ${!isRead ? "bold" : ""}`}>{it.title || "(no title)"}</div>
                      <div className="fb-time">{formatDate(it.createdAt)}</div>
                    </div>

                    <div className="fb-subrow">
                      <div className="fb-name">{name}</div>
                      <div className="fb-snippet">{(it.message || "").slice(0, 100)}{(it.message || "").length > 100 ? "…" : ""}</div>
                    </div>

                    <div className="fb-meta">
                      <span className="fb-user">From: {name}</span>
                      {!isRead && <span className="fb-unread-badge">Unread</span>}
                    </div>
                  </div>

                  <div className="fb-actions">
                    <button className="fb-action" onClick={(e) => { e.stopPropagation(); toggleRead(it); }}>{isRead ? "Mark unread" : "Mark read"}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="fb-view">
          {selected ? (
            <div className="fb-detail">
              <div className="fb-detail-head">
                <div>
                  <h2>{selected.title || "(no title)"}</h2>
                  <div className="fb-detail-sub">From: {getDisplayName(selected.senderid)} • {formatDate(selected.createdAt)}</div>
                </div>

                <div className="fb-detail-actions">
                  <button className="fb-btn" onClick={() => toggleRead(selected)}>{selected.isRead ? "Mark unread" : "Mark read"}</button>
                  {selected.senderid && typeof selected.senderid === 'object' && selected.senderid.email && (
                    <a className="fb-btn ghost" href={`mailto:${selected.senderid.email}`}>Email</a>
                  )}
                  {selected.senderid && typeof selected.senderid === 'object' && selected.senderid.phone && (
                    <a className="fb-btn ghost" href={`tel:${selected.senderid.phone}`}>Call</a>
                  )}
                </div>
              </div>

              <div className="fb-detail-meta">
                <div><strong>User:</strong> {getDisplayName(selected.senderid)}</div>
                {selected.senderid && typeof selected.senderid === 'object' && <div><strong>Email:</strong> {selected.senderid.email || '—'}</div>}
                {selected.senderid && typeof selected.senderid === 'object' && <div><strong>Phone:</strong> {selected.senderid.phone || '—'}</div>}
                <div><strong>Received:</strong> {formatDate(selected.createdAt)}</div>
                <div><strong>Status:</strong> {selected.isRead ? "Read" : "Unread"}</div>
              </div>

              <div className="fb-detail-body">
                <pre className="fb-message">{selected.message || "(no message provided)"}</pre>
              </div>
            </div>
          ) : (
            <div className="fb-empty-view">
              <h3>Select a feedback to view details</h3>
              <p>Click an item on the left. New feedback will appear in real-time with sender details.</p>
            </div>
          )}
        </section>
      </main>

    
    </div>
  );
};

export default Feedback;
