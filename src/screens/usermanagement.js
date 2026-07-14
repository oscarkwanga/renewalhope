import React, { useEffect, useRef, useState, useMemo } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../usermanagement.css";

const API_BASE_URL = process.env.REACT_APP_DOMAIN || "";

/* -------------------- Helpers -------------------- */

// Normalize many image shapes (string path, cloudinary-like object, relative path)
const normalizeImageValue = (value) => {
  if (!value) return null;
  try {
    if (typeof value === "string") {
      if (/^https?:\/\//i.test(value)) return value;
      // relative path -> prefix with API base
      const base = API_BASE_URL.replace(/\/$/, "");
      return `${base}/${String(value).replace(/^\//, "")}`;
    }
    if (typeof value === "object") {
      if (value.secure_url) return value.secure_url;
      if (value.url) return value.url;
      if (value.path) {
        const base = API_BASE_URL.replace(/\/$/, "");
        return `${base}/${String(value.path).replace(/^\//, "")}`;
      }
      if (value.public_id) {
        // best-effort: maybe cloudinary config; try url first if present
        if (value.url) return value.url;
        const base = API_BASE_URL.replace(/\/$/, "");
        return `${base}/${String(value.public_id).replace(/^\//, "")}`;
      }
    }
  } catch (e) {
    console.warn("normalizeImageValue error", e);
  }
  return null;
};

// Create a nice SVG placeholder with initials as data URI
const svgPlaceholderDataUrl = (name = "", size = 128) => {
  const initials = (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("") || "U";

  // choose deterministic color based on name
  let h = 200;
  for (let i = 0; i < initials.length; i++) h = (h * (initials.charCodeAt(i) + 29)) % 360;
  const bg1 = `hsl(${h} 70% 60%)`;
  const bg2 = `hsl(${(h + 40) % 360} 65% 52%)`;

  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0' stop-color='${bg1}' />
          <stop offset='1' stop-color='${bg2}' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' rx='20' fill='url(#g)'/>
      <text x='50%' y='55%' font-family='Poppins, Inter, system-ui, -apple-system, Roboto, Arial' font-weight='600' font-size='${Math.round(size * 0.42)}' fill='#fff' text-anchor='middle' alignment-baseline='middle'>${initials}</text>
    </svg>`
  );

  return `data:image/svg+xml;utf8,${svg}`;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString();
  } catch {
    return String(iso);
  }
};

const getFullName = (u) => {
  if (!u) return "Unknown";
  const first = u.firstname || u.firstName || u.first || "";
  const last = u.lastname || u.lastName || u.last || "";
  const joined = `${first} ${last}`.trim();
  if (joined) return joined;
  if (u.name) return u.name;
  if (u.email) return u.email.split("@")[0];
  return "User";
};

const getAvatarSrc = (u) => {
  // prefer property like coverimage, avatar, image, images array ...
  const candidates = [
    u.avatar,
    u.coverimage,
    u.image,
    u.profileImage,
    u.profile_image,
    u.images && Array.isArray(u.images) && u.images[0],
    u.images && typeof u.images === "object" && u.images.frontface && (Array.isArray(u.images.frontface) ? u.images.frontface[0] : u.images.frontface),
  ];

  for (const c of candidates) {
    const norm = normalizeImageValue(c);
    if (norm) return norm;
  }
  // fallback SVG with initials
  return svgPlaceholderDataUrl(getFullName(u), 160);
};

const getStatusClass = (status) => {
  if (!status) return "status-default";
  const s = String(status).toLowerCase();
  if (s.includes("pending")) return "status-pending";
  if (s.includes("active") || s.includes("confirmed")) return "status-success";
  if (s.includes("suspend")) return "status-suspended";
  if (s.includes("rejected") || s.includes("blocked")) return "status-rejected";
  if (s.includes("released")) return "status-released";
  return "status-default";
};

/* -------------------- Modal -------------------- */
const UserDetailModal = ({ user, onClose, onRemove }) => {
  if (!user) return null;
  return ReactDOM.createPortal(
    <div className="um-modal-overlay" onClick={onClose}>
      <div className="um-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="um-modal-header">
          <div className="um-modal-header-left">
            <img className="um-modal-avatar" src={getAvatarSrc(user)} alt={getFullName(user)} />
            <div className="um-modal-header-meta">
              <h2 className="um-modal-title">{getFullName(user)}</h2>
              <div className="um-modal-sub">{user.email || "No email provided"}</div>
            </div>
          </div>

          <div className="um-modal-actions">
            <button className="um-btn um-btn-danger" onClick={() => onRemove(user)}>Remove user</button>
            <button className="um-modal-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>

        <div className="um-modal-body">
          <aside className="um-modal-left">
            <div className="um-info-card">
              <div className="um-info-row"><strong>Role</strong><span>{user.role || user.userRole || "User"}</span></div>
              <div className="um-info-row"><strong>Status</strong><span className={getStatusClass(user.status)}>{user.status || "—"}</span></div>
              {user.registered && <div className="um-info-row"><strong>Registered</strong><span>{formatDate(user.registered)}</span></div>}
              {user.lastLogin && <div className="um-info-row"><strong>Last active</strong><span>{formatDate(user.lastLogin)}</span></div>}
            </div>

            <div className="um-info-card">
              <h4>Contact</h4>
              {user.contact ? <div className="um-field"><strong>Phone:</strong><span>{user.contact}</span></div> : null}
              {user.email ? <div className="um-field"><strong>Email:</strong><span>{user.email}</span></div> : null}
              {user.location ? <div className="um-field"><strong>Location:</strong><span>{user.location}</span></div> : null}
            </div>
          </aside>

          <section className="um-modal-right">
            <div className="um-section">
              <h3>Profile</h3>
              {getFullName(user) && <div className="um-kv"><strong>Full name</strong><div>{getFullName(user)}</div></div>}
              {user.role && <div className="um-kv"><strong>Role</strong><div>{user.role}</div></div>}
              {user.status && <div className="um-kv"><strong>Status</strong><div>{user.status}</div></div>}
              {user.bio && <div className="um-kv"><strong>Bio / Notes</strong><div className="um-pre">{user.bio}</div></div>}
            </div>

            <div className="um-section">
              <h3>Metadata</h3>
              {user._id && <div className="um-kv"><strong>ID</strong><div>{user._id}</div></div>}
              {user.createdAt && <div className="um-kv"><strong>Created</strong><div>{formatDate(user.createdAt)}</div></div>}
              {user.lastLogin && <div className="um-kv"><strong>Last login</strong><div>{formatDate(user.lastLogin)}</div></div>}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") || document.body
  );
};

/* -------------------- Main component -------------------- */
export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const socketRef = useRef(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get(`${API_BASE_URL}/auth`)
      .then(({ data }) => { if (!mounted) return; setUsers(Array.isArray(data) ? data : []); })
      .catch((err) => { console.error("Failed to load users:", err); setUsers([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { transports: ["websocket"], upgrade: false, secure: true });
    socketRef.current.on("connect", () => console.debug("socket connected"));
    socketRef.current.on("adduser", (u) => setUsers((prev) => [u, ...prev]));
    socketRef.current.on("updateUser", (u) => setUsers((prev) => prev.map(x => (x._id === u._id ? u : x))));
    return () => { try { socketRef.current.disconnect(); } catch (e) {} };
  }, []);

  const roles = useMemo(() => {
    const s = new Set((users || []).map(u => (u.role || u.userRole || "User")).filter(Boolean));
    return ["all", ...Array.from(s)];
  }, [users]);

  const statuses = useMemo(() => {
    const s = new Set((users || []).map(u => (u.status || "unknown")).filter(Boolean));
    return ["all", ...Array.from(s)];
  }, [users]);

  const filtered = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();
    return (users || []).filter((u) => {
      if (roleFilter !== "all" && String(u.role || u.userRole || "user").toLowerCase() !== String(roleFilter).toLowerCase()) return false;
      if (statusFilter !== "all" && String(u.status || "unknown").toLowerCase() !== String(statusFilter).toLowerCase()) return false;
      if (!q) return true;
      const name = getFullName(u).toLowerCase();
      const email = (u.email || "").toLowerCase();
      const phone = (u.contact || u.phone || "").toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [users, searchText, roleFilter, statusFilter]);

  // Remove user
  const removeUser = async (u) => {
    if (!u) return;
    const id = u._id || u.id;
    if (!id) {
      alert("Can't remove this user (missing id).");
      return;
    }
    if (!window.confirm(`Remove ${getFullName(u)}? This will delete the user from the system.`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/auth/${encodeURIComponent(id)}`);
      setUsers((prev) => prev.filter((x) => (x._id || x.id) !== id));
      setSelectedUser(null);
      setToast("User removed");
      setTimeout(() => setToast(null), 2500);
    } catch (e) {
      console.error("delete user failed", e);
      alert("Could not remove user. Check logs / network.");
    }
  };

  return (
    <div className="um-root">
      <header className="um-topbar">
        <div>
          <h1 className="um-title">User Management</h1>
          <p className="um-sub">Track, filter and manage platform users</p>
        </div>

        <div className="um-top-actions">
          <div className="um-stats">
            <div className="um-stat">
              <div className="um-stat-num">{users.length}</div>
              <div className="um-stat-label">Total users</div>
            </div>
            <div className="um-stat">
              <div className="um-stat-num">{filtered.length}</div>
              <div className="um-stat-label">Shown</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="um-btn um-btn-outline" onClick={() => alert("Invite flow (not implemented)")}>Invite</button>
            <button className="um-btn um-btn-primary" onClick={() => alert("New user flow (not implemented)")}>New user</button>
          </div>
        </div>
      </header>

      <section className="um-panel">
        <div className="um-panel-header">
          <input className="um-search" placeholder="Search by name, email or phone..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select className="um-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              {roles.map(r => <option key={r} value={r}>{r === "all" ? "All roles" : r}</option>)}
            </select>

            <select className="um-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map(s => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
            </select>
          </div>
        </div>

        <div className="um-table-wrap">
          {loading ? (
            <div className="um-spinner-wrap"><div className="um-spinner" /></div>
          ) : (
            <table className="um-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th style={{ minWidth: 280 }}>User</th>
                  <th style={{ width: 140 }}>Role</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 160 }}>Contact</th>
                  <th style={{ width: 140 }}>Last active</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id || u.id || i} className="um-row">
                    <td>{i + 1}</td>

                    <td className="um-user-cell">
                      <img className="um-avatar" src={getAvatarSrc(u)} alt={getFullName(u)} />
                      <div className="um-user-meta">
                        <div className="um-user-name">{getFullName(u)}</div>
                        {u.email && <div className="um-user-email">{u.email}</div>}
                      </div>
                    </td>

                    <td>{u.role || u.userRole || "User"}</td>
                    <td><span className={`um-badge ${getStatusClass(u.status)}`}>{u.status || "—"}</span></td>
                    <td>{u.contact || "—"}</td>
                    <td>{formatDate(u.lastLogin || u.lastActive || u.updatedAt)}</td>

                    <td>
                      <button className="um-action-btn" onClick={() => setSelectedUser(u)}>View / Edit</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 28, color: "#6B7280" }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onRemove={(u) => removeUser(u)} />}

      {toast && <div className="um-toast">{toast}</div>}
    </div>
  );
};

export default UserManagement;
