// src/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate
} from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaHome,
  FaExchangeAlt,
  FaCalendar,
  FaChartBar,
  FaLock,
  FaUserTie,
  FaCog,
  FaLifeRing,
 FaComment,
 FaPenAlt
} from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";

import "./App.css";

import { Brokers } from "./screens/brokers";
import { Escrow } from "./screens/escrow";
import { Listings } from "./screens/listings";
import { Reports } from "./screens/reports";
import { Settings } from "./screens/settings";
import { Support } from "./screens/support";
import { TransactionsPage } from "./screens/transactionspage";
import { Tours } from "./screens/tours";
import { UserManagement } from "./screens/usermanagement";
import { Chat } from "./screens/chat";
import { Signin } from "./screens/signin";
import { Feedback } from "./screens/feedback";
import {PrivacyPolicy} from"./screens/privacy";
import {AlfaPolicy} from"./screens/alfaprivacy";
import {Property} from"./screens/property";
import {Confirmpay} from"./screens/confirmpay";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = process.env.REACT_APP_DOMAIN || "";

/* ----------------------
   Auth helpers (no tokens)
   - presence of localStorage.dw_user_profile = "signed in"
----------------------*/
const AUTH_KEY = "dw_user_profile";

function getStoredProfile() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (e) {
    console.warn("getStoredProfile parse error", e);
    return null;
  }
}

const isAuthenticated = () => !!getStoredProfile();

/* -----------------------
   Small helpers
-----------------------*/
const getStatusClass = (status) => {
  if (!status) return "status-unknown";
  switch ((status || "").toString().toLowerCase()) {
    case "available":
      return "status-available";
    case "pending":
      return "status-pending";
    case "sold":
      return "status-sold";
    case "success":
      return "status-success";
    case "failed":
      return "status-failed";
    default:
      return "status-unknown";
  }
};

/* -----------------------
   Modal via React Portal
-----------------------*/
const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;
  const root = document.getElementById("modal-root") || document.body;
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        {children}
        <button className="action-btn" onClick={onClose}>Close</button>
      </div>
    </div>,
    root
  );
};

/* -----------------------
   EditModal Component (unchanged)
-----------------------*/
const EditModal = ({ listing = {}, onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    title: listing.title || "",
    address: listing.address || "",
    price: listing.price || ""
  });
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };
  const handleSave = () => {
    alert("Changes saved for " + (listing.title || ""));
    onClose();
  };
  return (
    <Modal isOpen title="Edit Listing" onClose={onClose}>
      <div className="modal-content">
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} />
        <label>Address:</label>
        <input name="address" value={formData.address} onChange={handleChange} />
        <label>Price:</label>
        <input name="price" value={formData.price} onChange={handleChange} />
        <button className="action-btn edit" onClick={handleSave}>Save</button>
      </div>
    </Modal>
  );
};

/* -----------------------
   ApproveModal Component (unchanged)
-----------------------*/
const ApproveModal = ({ listing = {}, onClose = () => {} }) => {
  const handleApprove = () => {
    alert("Listing approved: " + (listing.title || ""));
    onClose();
  };
  return (
    <Modal isOpen title="Approve Listing" onClose={onClose}>
      <div className="modal-content">
        <p>Approve listing "{listing.title}"?</p>
        <button className="action-btn approve" onClick={handleApprove}>Yes, Approve</button>
      </div>
    </Modal>
  );
};

/* -----------------------
   DeclineModal Component (unchanged)
-----------------------*/
const DeclineModal = ({ listing = {}, onClose = () => {} }) => {
  const reasons = ["Insufficient Information","Poor Image Quality","Non-compliant","Other"];
  const [selected, setSelected] = useState([]);
  const toggle = e => {
    const { value, checked } = e.target;
    setSelected(s => checked ? [...s, value] : s.filter(r => r!==value));
  };
  const handleDecline = () => {
    if (!selected.length) return alert("Select at least one reason.");
    alert(`Declined "${listing.title}" reasons: ${selected.join(", ")}`);
    onClose();
  };
  return (
    <Modal isOpen title="Decline Listing" onClose={onClose}>
      <div className="modal-content">
        <p>Reasons to decline "{listing.title}":</p>
        {reasons.map((r,i) => (
          <div key={i}>
            <input type="checkbox" id={`r${i}`} value={r} onChange={toggle}/>
            <label htmlFor={`r${i}`}>{r}</label>
          </div>
        ))}
        <button className="action-btn decline" onClick={handleDecline}>Submit Decline</button>
      </div>
    </Modal>
  );
};

/* -----------------------
   RecentTransactions Component (defensive)
-----------------------*/
const RecentTransactions = () => {
  const [txns, setTxns] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/mpesa/transactions`)
      .then(({data}) => setTxns(Array.isArray(data) ? data.slice(0,5) : []))
      .catch(console.error);
  }, []);
  const sock = useRef();
  useEffect(() => {
    if (!API_BASE_URL) return;
    try {
      sock.current = io(API_BASE_URL,{transports:["websocket"],upgrade:false,secure:API_BASE_URL.startsWith("https")});
      sock.current.on("newtransaction", t => setTxns(s=>[t,...s].slice(0,5)));
      sock.current.on("transactionUpdated", u=>setTxns(s=>s.map(t=>t.checkoutRequestID===u.checkoutRequestID?u:t)));
    } catch(e){ console.warn("socket err", e); }
    return ()=>{ try{ sock.current && sock.current.disconnect(); }catch(e){} };
  }, []);
  const fm = n=>n>=1e3?n.toLocaleString():n;
  const toLocal = s=> (typeof s === "string" && s.startsWith("0")) ? s : String(s).replace(/^(\+?254)/,"0");
  const fmtDate = iso=>{const d=new Date(iso);return`${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;};
  return (
    <div className="transactions">
      <h2>Recent Transactions</h2>
      <div className="table-wrapper">
        <table><thead><tr>
          <th>#</th><th>Code</th><th>Phone</th><th>Amt</th><th>Status</th><th>Date</th>
        </tr></thead>
        <tbody>
          {txns.map((t,i)=>(
            <tr key={t._id || i}>
              <td>{i+1}</td>
              <td>{t.mpesaReceiptNumber}</td>
              <td>{toLocal(String(t.phone || ""))}</td>
              <td>{fm(t.amount)}/-</td>
              <td className={getStatusClass(t.status)}>{t.status}</td>
              <td>{fmtDate(t.createdAt)}</td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
};

/* -----------------------
   DashboardCard Component
-----------------------*/
const DashboardCard = ({title,value}) => (
  <div className="card"><h3>{title}</h3><p>{value}</p></div>
);

/* -----------------------
   ChartComponent: Last 7 Days Revenue (defensive)
-----------------------*/
const ChartComponent = () => {
  const [txns, setTxns]       = useState([]);
  const [labels, setLabels]   = useState([]);
  const [dataPts, setDataPts] = useState([]);
  const sockRef = useRef();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/mpesa/transactions`)
      .then(({data})=>setTxns(Array.isArray(data)?data:[]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!API_BASE_URL) return;
    try {
      sockRef.current = io(API_BASE_URL,{transports:["websocket"],upgrade:false,secure:API_BASE_URL.startsWith("https")});
      sockRef.current.on("newtransaction", t=>setTxns(s=>[t,...s]));
      sockRef.current.on("transactionUpdated", u=>setTxns(s=>s.map(t=>t.checkoutRequestID===u.checkoutRequestID?u:t)));
    } catch(e){ console.warn("socket err", e); }
    return ()=>{ try{ sockRef.current && sockRef.current.disconnect(); }catch(e){} };
  }, []);

  useEffect(() => {
    const now = new Date();
    const days = [];
    for (let i=6; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()-i);
      days.push({
        label: d.toLocaleDateString("default",{month:"short",day:"numeric"}),
        year: d.getFullYear(), month: d.getMonth(), date: d.getDate()
      });
    }
    const sums = days.map(({year,month,date}) =>
      txns
        .filter(t => {
          if (t.status !== "SUCCESS") return false;
          const d = new Date(t.createdAt);
          return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date;
        })
        .reduce((a,t) => a + Number(t.amount || 0), 0)
    );
    setLabels(days.map(d => d.label));
    setDataPts(sums);
  }, [txns]);

  const chartData = { labels, datasets:[{label:"Revenue (KSH)",data:dataPts,borderRadius:4}]};
  const chartOptions = {
    responsive:true,maintainAspectRatio:false,
    scales:{y:{beginAtZero:true},x:{}},
    plugins:{legend:{position:"top"},title:{display:true,text:"Last 7 Days Revenue (Live)"}}
  };

  return <div style={{height:"300px"}}><Bar data={chartData} options={chartOptions}/></div>;
};

/* -----------------------
   Sidebar Component (shows signed in user & sign out)
-----------------------*/
const Sidebar = () => {
  const [pending,setPending]=useState([]),[lords,setLords]=useState([]),[brokers,setBrokers]=useState([]);
  useEffect(()=>{
    axios.get(`${API_BASE_URL}/house`).then(({data})=>setPending(Array.isArray(data)?data.filter(l=>l.status==="not approved"):[])).catch(console.error);
    axios.get(`${API_BASE_URL}/auth`).then(({data})=>{
      const arr = Array.isArray(data) ? data : [];
      setLords(arr.filter(u=>u.space==="landlord"));
      setBrokers(arr.filter(u=>u.space==="broker"));
    }).catch(console.error);
  },[]);
  const fmt=n=>n>=1e3?n.toLocaleString():n;
  const profile = getStoredProfile();

  const handleSignOut = () => {
    try { localStorage.removeItem(AUTH_KEY); } catch(e){}
    window.location.href = "/signin";
  };

  return (<div className="sidebar">
    <h2>Dwelify Admin</h2>
    {profile ? <div className="sidebar-user"><strong>{profile.firstname || profile.email || "Admin"}</strong></div> : null}
    <nav><ul>
      <li><Link to="/dashboard"><FaTachometerAlt/><span>Dashboard</span></Link></li>
      <li><Link to="/users"><FaUsers/><span>Users</span></Link></li>
      <li><Link to="/listings"><FaHome/><span>Listings</span></Link></li>
      <li><Link to="/transactions"><FaExchangeAlt/><span>Transactions</span></Link></li>

      <li><Link to="/reports"><FaChartBar/><span>Reports</span></Link></li>
      <li><Link to="/escrow"><FaLock/><span>Escrow</span></Link></li>
      <li><Link to="/chat"><FaComment/><span>Chat</span></Link></li>
       <li><Link to="/feedback"><FaPenAlt/><span>Feedback</span></Link></li>
         <li><Link to="/support"><FaLifeRing/><span>Support</span></Link></li>
      {/* 
      <li><Link to="/brokers"><FaUserTie/><span>Brokers</span></Link></li>
      <li><Link to="/settings"><FaCog/><span>Settings</span></Link></li>
      <li><Link to="/support"><FaLifeRing/><span>Support</span></Link></li>
       <li><Link to="/tours"><FaCalendar/><span>Tours</span></Link></li>
      */}
    </ul></nav>

    <div className="sidebar-stats">
      <h3>Quick Stats</h3>
      <div className="stat"><span>Pending Listings:</span><span>{fmt(pending.length)}</span></div>
      <div className="stat"><span>Landlords:</span><span>{fmt(lords.length)}</span></div>
      <div className="stat"><span>Brokers:</span><span>{fmt(brokers.length)}</span></div>
    </div>

    <div style={{ marginTop: 12 }}>
      <button className="action-btn" onClick={handleSignOut}>Sign out</button>
    </div>
  </div>);
};

/* -----------------------
   Dashboard Page Component
-----------------------*/
const Dashboard = () => {
  const [listings,setList]=useState([]),[users,setUsers]=useState([]),
        [txns,setTxns]=useState([]),[escrow,setEscrow]=useState(0),
        [tours,setTours]=useState([]),[comm,setComm]=useState(0);

  useEffect(()=>{
    axios.get(`${API_BASE_URL}/house`).then(({data})=>setList(Array.isArray(data)?data.filter(l=>l.status!=="not approved"):[])).catch(console.error);
    axios.get(`${API_BASE_URL}/auth`).then(({data})=>setUsers(Array.isArray(data)?data:[])).catch(console.error);
    axios.get(`${API_BASE_URL}/api/mpesa/transactions`).then(({data})=>{
      const arr = Array.isArray(data) ? data : [];
      setTxns(arr);
      const succ = arr.filter(t=>t.status==="SUCCESS").reduce((a,t)=>a+Number(t.amount || 0),0);
      setComm(Math.trunc(succ*0.05));
      const pend = arr.filter(t=>t.status==="PENDING").reduce((a,t)=>a+Number(t.amount || 0),0);
      setEscrow(pend);
      setTours(arr.filter(t=>t.status==="PENDING"));
    }).catch(console.error);
  },[]);

  const fmt=n=>n>=1e3?n.toLocaleString():n;
  return (
    <div className="main">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <p>Overview of activities & transactions</p>
      </header>
      <div className="cards">
        <DashboardCard title="Active Listings" value={fmt(listings.length)} />
        <DashboardCard title="Total Revenue" value={fmt(txns.filter(t=>t.status==="SUCCESS").reduce((a,t)=>a+Number(t.amount || 0),0))} />
        <DashboardCard title="Users Registered" value={fmt(users.length)} />
        <DashboardCard title="Escrow Funds" value={fmt(escrow)} />
        <DashboardCard title="Pending Tours" value={fmt(tours.length)} />
        <DashboardCard title="Broker Commission" value={fmt(comm)} />
      </div>
      <div className="chart-container"><ChartComponent/></div>
      <RecentTransactions/>
    </div>
  );
};

/* -----------------------
   Layout & RequireAuth wrapper
-----------------------*/
const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children || <Outlet />;
};

const Layout = () => (
  <div className="container"><Sidebar/><Outlet/></div>
);

const Home = () => (
  <Router>
    <Routes>
      {/* Public signin route */}
      <Route path="/signin" element={<Signin/>} />
<Route path="/privacy" element={<PrivacyPolicy/>} />
<Route path="/alfaprivacy" element={<AlfaPolicy/>} />
      {/* All other routes require auth */}
      <Route path="/" element={<RequireAuth><Layout/></RequireAuth>}>
        <Route index element={<Dashboard/>}/>
        <Route path="dashboard"   element={<Dashboard/>}/>
        <Route path="users"       element={<UserManagement/>}/>
        <Route path="listings"    element={<Listings/>}/>
        <Route path="transactions"element={<TransactionsPage/>}/>
        <Route path="tours"       element={<Tours/>}/>
        <Route path="reports"     element={<Reports/>}/>
        <Route path="escrow"      element={<Escrow/>}/>
        <Route path="chat"        element={<Chat/>}/>
        <Route path="brokers"     element={<Brokers/>}/>
        <Route path="settings"    element={<Settings/>}/>
        <Route path="support"     element={<Support/>}/>
          <Route path="Property"     element={<Property/>}/>
           <Route path="Confirmpay"     element={<Confirmpay/>}/>
         <Route path="feedback"    element={<Feedback/>}/>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/signin"} replace />} />
    </Routes>
  </Router>
);

export default Home;