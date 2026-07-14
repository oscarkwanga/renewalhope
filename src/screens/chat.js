// ChatApp.jsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import "../chat.css";

const API_BASE = process.env.REACT_APP_DOMAIN || "";
const SERVER = (API_BASE || "").replace(/\/$/, "");
const THEME = {
  background: "#F6FAFB",
  primary: "#2B8FB5",
  text: "#10242f",
  muted: "#8FA4AF",
  card: "#fff",
  badge: "#FF5B5B",
};

let sharedSocket = null;
function getSharedSocket(base = SERVER) {
  if (!base) return null;
  if (!sharedSocket) {
    try {
      sharedSocket = io(base, { transports: ["websocket"], secure: base.startsWith("https"), reconnection: true });
    } catch (e) {
      console.warn("socket init failed", e);
      sharedSocket = null;
    }
  }
  return sharedSocket;
}

const STARTERS = [
  "Hello! I'm interested — is this available?",
  "Hi — can we chat about the listing?",
  "Good day! Please tell me more.",
  "Hello, are you available for a quick chat?"
];

export const Chat = ({ initialPartnerId = null }) => {
  const AUTH_KEY = "dw_user_profile";

  // load profile safely
  let parsedUser = null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    parsedUser = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("failed to parse auth profile", e);
  }
  const meId = parsedUser?.id || parsedUser?._id || null;

  const server = (process.env.REACT_APP_DOMAIN || API_BASE || "").replace(/\/$/, "");
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(initialPartnerId);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState("");
  const latestTextRef = useRef("");
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [toast, setToast] = useState({ visible: false, text: "", variant: "info" });
  const [avatarModal, setAvatarModal] = useState({ open: false, uri: "" });
  const socketRef = useRef(null);
  const isMounted = useRef(true);
  const listScrollRef = useRef(null);
  const msgsScrollRef = useRef(null);

  useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);
  useEffect(() => { latestTextRef.current = text; }, [text]);

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, visible: false })), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // robust id normalization
  const normalizeId = (v) => {
    if (v === null || v === undefined) return "";
    try {
      if (typeof v === "object") return String(v._id || v.id || v.$oid || v);
      return String(v);
    } catch (e) {
      return String(v || "");
    }
  };

  // Upsert incoming message with optimistic replacement logic
  const upsertMessage = useCallback((incoming) => {
    if (!incoming) return;
    if (!isMounted.current) return;
    setMessages(prev => {
      const arr = Array.isArray(prev) ? [...prev] : [];

      // find optimistic match by text + near timestamp or _cid
      const findOptimisticIndex = () => {
        if (!incoming.message) return -1;
        const incomingText = String(incoming.message).trim();
        for (let i = 0; i < arr.length; i++) {
          const m = arr[i];
          if (m._optimistic) {
            const diff = Math.abs(new Date(m.createdAt).getTime() - new Date(incoming.createdAt || Date.now()).getTime());
            if (String(m.message).trim() === incomingText && diff < 6000) return i;
            if (m._cid && incoming._cid && m._cid === incoming._cid) return i;
          }
        }
        return -1;
      };

      const incomingId = incoming._id ? normalizeId(incoming._id) : null;
      if (incomingId) {
        // replace if exists
        const existsIndex = arr.findIndex(x => normalizeId(x._id) === incomingId);
        if (existsIndex !== -1) {
          arr[existsIndex] = { ...arr[existsIndex], ...incoming };
          return arr.filter((m, idx) => idx === existsIndex || normalizeId(m._id) !== incomingId);
        }
        // replace optimistic
        const optIdx = findOptimisticIndex();
        if (optIdx >= 0) {
          arr[optIdx] = incoming;
          return arr;
        }
        arr.push(incoming);
        return arr;
      }

      // incoming has no server id
      const optIdx2 = arr.findIndex(m => m._optimistic && m.message === incoming.message && Math.abs(new Date(m.createdAt).getTime() - new Date(incoming.createdAt).getTime()) < 6000);
      if (optIdx2 >= 0) {
        arr[optIdx2] = { ...arr[optIdx2], ...incoming };
        return arr;
      }
      arr.push(incoming);
      return arr;
    });
  }, []);

  // dedupe server list
  const setMessagesFromServer = (list) => {
    if (!Array.isArray(list)) { setMessages([]); return; }
    const map = new Map();
    const sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    for (const m of sorted) {
      // stable id fallback ensures keys won't be random
      const id = m._id ? normalizeId(m._id) : `temp-${m._cid || Math.round(new Date(m.createdAt).getTime() / 1000)}`;
      if (!map.has(id)) map.set(id, m);
    }
    setMessages(Array.from(map.values()));
  };

  // fetch chat summaries
  const fetchChats = useCallback(async () => {
    if (!server || !meId) { setLoadingChats(false); return; }
    setLoadingChats(true);
    try {
      const res = await axios.get(`${server}/messages/chats/${meId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      data.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      if (isMounted.current) setChats(data);
      if (!selected && data.length > 0) setSelected(String(data[0]._id || data[0].id));
    } catch (e) {
      console.error("fetchChats", e);
      showToast("Could not fetch conversations", "error");
    } finally {
      if (isMounted.current) setLoadingChats(false);
    }
  }, [server, meId, selected]);

  useEffect(() => { fetchChats(); }, [fetchChats]);

  // fetch messages for current partner
  const fetchMessages = useCallback(async (partnerId) => {
    if (!server || !meId || !partnerId) { setMessages([]); setLoadingMessages(false); return; }
    setLoadingMessages(true);
    try {
      const res = await axios.get(`${server}/messages/${meId}/${partnerId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setMessagesFromServer(data);
      // small delay so DOM updates then scroll
      setTimeout(() => scrollMessagesToBottom(true), 60);
    } catch (e) {
      console.error("fetchMessages", e);
      showToast("Could not load chat", "error");
    } finally {
      if (isMounted.current) setLoadingMessages(false);
    }
  }, [server, meId]);

  useEffect(() => { if (selected) fetchMessages(selected); }, [selected, fetchMessages]);

  // sockets - keep shared style
  useEffect(() => {
    if (!meId || !server) return;
    const s = getSharedSocket(server);
    if (!s) return;
    socketRef.current = s;

    const onConnect = () => { try { s.emit("join", meId); } catch (e) {} };

    const onMessage = (msg) => {
      try {
        if (!msg || (!msg.senderid && !msg.receiverid)) return;
        const sender = normalizeId(msg.senderid && (msg.senderid._id || msg.senderid));
        const receiver = normalizeId(msg.receiverid && (msg.receiverid._id || msg.receiverid));
        const otherId = String(sender) === String(meId) ? receiver : sender;

        // update chat list
        setChats(prev => {
          const arr = Array.isArray(prev) ? [...prev] : [];
          const idx = arr.findIndex(c => String(c._id) === String(otherId) || String(c.id) === String(otherId));
          const unreadInc = String(receiver) === String(meId) ? 1 : 0;
          const summary = {
            _id: otherId,
            firstname: msg.senderName || msg.firstname || (String(sender) === String(meId) ? (msg.receiverName || "") : (msg.senderName || "")),
            lastname: "",
            lastMessage: msg.message,
            lastMessageTime: msg.createdAt || new Date().toISOString(),
            unreadCount: (idx >= 0 ? Number(arr[idx].unreadCount || 0) : 0) + unreadInc,
            coverimage: (String(sender) === String(meId) ? (msg.receiverAvatar || null) : (msg.senderAvatar || null))
          };
          if (idx >= 0) arr.splice(idx, 1);
          arr.unshift(summary);
          return arr.slice(0, 200);
        });

        // message belongs to current conversation?
        if (String(sender) === String(selected) || String(receiver) === String(selected)) {
          upsertMessage(msg);
          setTimeout(() => scrollMessagesToBottom(true), 80);
        }
      } catch (e) {
        console.warn("socket message parse", e);
      }
    };

    const onChatListUpdate = () => { fetchChats(); };

    s.on("connect", onConnect);
    s.on("message", onMessage);
    s.on("chatDeleted", () => { /* handled elsewhere */ });
    s.on("chatListUpdate", onChatListUpdate);

    return () => {
      try {
        s.off("connect", onConnect);
        s.off("message", onMessage);
        s.off("chatListUpdate", onChatListUpdate);
      } catch (e) {}
    };
  }, [meId, server, fetchChats, selected, upsertMessage]);

  // scroll helper - force scroll or only if near bottom
  const scrollMessagesToBottom = (force = false) => {
    try {
      const el = msgsScrollRef.current;
      if (!el) return;
      // modern browsers: use scrollTop
      if (force) { el.scrollTop = el.scrollHeight; return; }
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
      if (isAtBottom) el.scrollTop = el.scrollHeight;
    } catch (e) {}
  };

  // always auto-scroll when messages change (you requested this)
  useEffect(() => {
    setTimeout(() => scrollMessagesToBottom(true), 30);
  }, [messages, selected]);

  // send with optimistic message & lock
  const sendMessage = async (override = null) => {
    const raw = override !== null ? override : latestTextRef.current;
    const trimmed = String(raw || "").trim();
    if (!trimmed || sendingRef.current || sending || !meId || !selected || !server) return;

    sendingRef.current = true;
    setSending(true);

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const optimistic = {
      _id: tempId,
      _cid: tempId,
      senderid: meId,
      receiverid: selected,
      message: trimmed,
      createdAt: new Date().toISOString(),
      _optimistic: true
    };

    // optimistic push
    setMessages(prev => [...(Array.isArray(prev) ? prev : []), optimistic]);
    setText("");
    latestTextRef.current = "";
    scrollMessagesToBottom(true);

    // update chat list preview
    setChats(prev => {
      const arr = Array.isArray(prev) ? [...prev] : [];
      const idx = arr.findIndex(c => String(c._id) === String(selected) || String(c.id) === String(selected));
      const summary = {
        _id: selected,
        firstname: (arr[idx] && (arr[idx].firstname || "")) || "",
        lastname: "",
        lastMessage: trimmed,
        lastMessageTime: new Date().toISOString(),
        coverimage: arr[idx] ? arr[idx].coverimage : null,
        unreadCount: idx >= 0 ? arr[idx].unreadCount : 0
      };
      if (idx >= 0) arr.splice(idx, 1);
      arr.unshift(summary);
      return arr;
    });

    try {
      const res = await axios.post(`${server}/messages`, { senderid: meId, receiverid: selected, message: trimmed });
      const saved = res?.data;
      if (saved && saved._id) {
        // replace optimistic
        setMessages(prev => {
          const arr = Array.isArray(prev) ? [...prev] : [];
          const savedId = normalizeId(saved._id);
          const hasSaved = arr.some(m => normalizeId(m._id) === savedId);
          if (hasSaved) {
            return arr.filter(m => !(m._optimistic && String(m.message).trim() === String(trimmed).trim() && Math.abs(new Date(m.createdAt).getTime() - new Date(saved.createdAt || Date.now()).getTime()) < 6000));
          }
          const tempIndex = arr.findIndex(m => m._cid === tempId || m._id === tempId);
          if (tempIndex >= 0) {
            arr[tempIndex] = saved;
            return arr;
          }
          if (!arr.some(m => normalizeId(m._id) === savedId)) arr.push(saved);
          return arr;
        });
        showToast("Message sent", "success");
        scrollMessagesToBottom(true);
      } else {
        showToast("Message sent (no server id)", "info");
      }
      // refresh chat list to show lastMessage/time
      fetchChats();
    } catch (e) {
      console.error("send failed", e);
      showToast("Send failed — network", "error");
      setMessages(prev => (Array.isArray(prev) ? prev.map(m => (m._cid === tempId ? { ...m, _failed: true } : m)) : prev));
    } finally {
      sendingRef.current = false;
      if (isMounted.current) setSending(false);
    }
  };

  const showToast = (txt, variant = "info") => { if (!isMounted.current) return; setToast({ visible: true, text: txt, variant }); };
  const openAvatar = (uri) => setAvatarModal({ open: true, uri });
  const closeAvatar = () => setAvatarModal({ open: false, uri: "" });

  const [chatSearch, setChatSearch] = useState("");
  const filteredChats = useMemo(() => {
    if (!chatSearch.trim()) return chats;
    const q = chatSearch.toLowerCase();
    return chats.filter(c => (c.firstname || "").toLowerCase().includes(q) || (c.lastMessage || "").toLowerCase().includes(q));
  }, [chats, chatSearch]);

  // group messages by date for display
  const groupedMessages = useMemo(() => {
    const groups = [];
    const list = Array.isArray(messages) ? messages : [];
    for (let i = 0; i < list.length; i++) {
      const it = list[i];
      const d = moment(it.createdAt || new Date()).format("DD MMM YYYY");
      const last = groups.length ? groups[groups.length - 1] : null;
      if (!last || last.date !== d) groups.push({ date: d, items: [it] });
      else last.items.push(it);
    }
    return groups;
  }, [messages]);

  // keyboard send (Enter)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "Enter" || e.keyCode === 13) && !e.shiftKey) {
        const active = document.activeElement;
        if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
          e.preventDefault();
          if (!sendingRef.current) sendMessage(null);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sendMessage]);

  // mark read when selecting conversation
  useEffect(() => {
    if (!selected || !meId || !server) return;
    axios.patch(`${server}/messages/markread/${selected}/${meId}`).catch(() => {});
    fetchChats();
  }, [selected]);

  const handleSelectChat = (c) => {
    const id = String(c._id || c.id);
    setSelected(id);
    fetchMessages(id);
    setChats(prev => (Array.isArray(prev) ? prev.map(x => (String(x._id) === id ? { ...x, unreadCount: 0 } : x)) : prev));
    // small delay to ensure messages area gets focus and scrolled
    setTimeout(() => scrollMessagesToBottom(true), 80);
  };

  const retryMessage = async (msg) => {
    if (!msg || !msg.message) return;
    setMessages(prev => (Array.isArray(prev) ? prev.filter(m => m._id !== msg._id) : prev));
    setTimeout(() => sendMessage(msg.message), 80);
  };

  return (
    <div className="ca-root" style={{ background: THEME.background }}>
      {/* Sidebar */}
      <div className="ca-sidebar">
        <div className="ca-sidebar-header">
          <h2>Dwelify Messages</h2>
          <div className="ca-sidebar-controls">
            <input placeholder="Search conversations..." value={chatSearch} onChange={(e) => setChatSearch(e.target.value)} />
            
          </div>
        </div>

        <div className="ca-security">
          <div className="ca-sec-left">🔒</div>
          <div className="ca-sec-body">
            <div className="ca-sec-title">Keep payments safe — use Dwelify</div>
            <div className="ca-sec-text">Never send PINs, OTPs, or bank credentials in chat. Use in-app payment links for protection.</div>
          </div>
        </div>

        <div className="ca-chatlist" ref={listScrollRef}>
          {loadingChats ? (
            <div className="ca-loading">Loading conversations…</div>
          ) : filteredChats.length === 0 ? (
            <div className="ca-empty">No conversations yet — start chatting by clicking "New".</div>
          ) : (
            filteredChats.map((c) => {
              const id = String(c._id || c.id || "");
              const unread = Number(c.unreadCount || 0);
              return (
                <div key={id} className={`ca-chat-row ${String(selected) === id ? "active" : ""}`} onClick={() => handleSelectChat(c)}>
                  <div className="ca-avatar" onClick={(e) => { e.stopPropagation(); if (c.coverimage) openAvatar(c.coverimage); }}>
                    {c.coverimage ? <img src={c.coverimage} alt="avatar" /> : <div className="ca-avatar-placeholder">👤</div>}
                  </div>
                  <div className="ca-meta">
                    <div className="ca-name">{(c.firstname || "") + (c.lastname ? " " + c.lastname : "") || id}</div>
                    <div className="ca-last" title={c.lastMessage || ""}>{c.lastMessage || "No messages yet"}</div>
                  </div>
                  <div className="ca-right">
                    <div className="ca-time">{c.lastMessageTime ? moment.utc(c.lastMessageTime).local().format("hh:mm A") : ""}</div>
                    {unread > 0 && <div className="ca-unread">{unread > 99 ? "99+" : unread}</div>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="ca-sidebar-footer">
          <div>Quick Stats</div>
          <div className="ca-stats">
            <div><strong>{chats.length}</strong><small>Conversations</small></div>
            <div><strong>{chats.reduce((s, c) => s + (Number(c.unreadCount) || 0), 0)}</strong><small>Unread</small></div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="ca-main">
        <div className="ca-topbar">
          <div className="ca-top-left">
            <button className="ca-back-sm" onClick={() => { /* mobile/back */ }}>☰</button>
            <div className="ca-chat-title">{selected ? (chats.find(x => String(x._id) === String(selected))?.firstname || `Chat ${selected}`) : "Select a conversation"}</div>
            <div className="ca-chat-sub">{selected ? `Chat with ${(chats.find(x => String(x._id) === String(selected))?.firstname || "")}` : ""}</div>
          </div>
          <div className="ca-top-actions">
            <button className="ca-btn small" onClick={() => { fetchChats(); if (selected) fetchMessages(selected); }}>Refresh</button>
          </div>
        </div>

        <div className="ca-messages-wrapper">
          <div className="ca-messages" ref={msgsScrollRef}>
            {loadingMessages ? (
              <div className="ca-loading">Loading messages…</div>
            ) : !selected ? (
              <div className="ca-empty-large">
                <div className="ca-emoji">💬</div>
                <h3>Pick a conversation</h3>
                <p>Click a contact on the left to view messages or press New to start one.</p>
              </div>
            ) : groupedMessages.length === 0 ? (
              <div className="ca-empty-large">
                <div className="ca-emoji">💬</div>
                <h3>No messages yet</h3>
                <p>Use the suggestions below or type your message.</p>
                <div className="ca-starters">
                  {STARTERS.map((s, i) => <button key={i} className="ca-starter" onClick={() => { setText(s); latestTextRef.current = s; }}>{s}</button>)}
                </div>
              </div>
            ) : (
              groupedMessages.map(g => (
                <div key={g.date} className="ca-group">
                  <div className="ca-group-date">{g.date}</div>
                  {g.items.map((m, idx) => {
                    const senderId = normalizeId(m.senderid);
                    const isMe = String(senderId) === String(meId);
                    const time = moment(m.createdAt).format("hh:mm A");
                    // stable key
                    const key = normalizeId(m._id) || m._cid || `temp-${Math.round(new Date(m.createdAt).getTime()/1000)}-${idx}`;

                    return (
                      <div key={key} className={`ca-msg-row ${isMe ? "me" : "them"}`}>
                        <div className="ca-msg-bubble-wrap">
                          {!isMe && (
                            <div className="ca-msg-avatar" onClick={() => m.avatar && openAvatar(m.avatar)}>
                              {m.avatar ? <img src={m.avatar} alt="avatar" /> : <div className="ca-avatar-placeholder">👤</div>}
                            </div>
                          )}

                          <div className={`ca-bubble ${m._optimistic ? "optimistic" : ""} ${m._failed ? "failed" : ""} ${isMe ? "bubble-me" : "bubble-them"}`}>
                            <div className="ca-bubble-text">{m.message}</div>
                            <div className="ca-bubble-time">{time} {m._failed ? <button className="ca-retry" onClick={() => retryMessage(m)}>Retry</button> : null}</div>
                          </div>

                          {isMe && <div className="ca-msg-meta">{m._optimistic ? <small>sending…</small> : null}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* pinned input area - always visible */}
          <div className="ca-input-area">
            <textarea
              placeholder={selected ? "Type a message..." : "Select a conversation to start messaging."}
              value={text}
              onChange={(e) => { setText(e.target.value); latestTextRef.current = e.target.value; }}
              rows={2}
              disabled={!selected}
            />
            <div className="ca-input-actions">
              <button
                className="ca-send"
                onClick={() => sendMessage(null)}
                disabled={!selected || !String(latestTextRef.current || "").trim() || sendingRef.current}
                title={sendingRef.current ? "Sending…" : "Send"}
              >
                {sendingRef.current ? "…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* avatar modal */}
      {avatarModal.open && ReactDOM.createPortal(
        <div className="ca-modal" onClick={closeAvatar}>
          <div className="ca-modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={avatarModal.uri} alt="avatar" />
            <button className="ca-btn" onClick={closeAvatar}>Close</button>
          </div>
        </div>, document.body
      )}

      {/* toast */}
      {toast.visible && ReactDOM.createPortal(
        <div className={`ca-toast ${toast.variant}`}>{toast.text}</div>, document.body
      )}
    </div>
  );
};

export default Chat;
