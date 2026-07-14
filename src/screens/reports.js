// src/screens/Reports.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../App.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Reports = () => {
  const API = process.env.REACT_APP_DOMAIN;

  // --- State for cards ---
  const [listingsCount, setListingsCount] = useState(0);
  const [usersCount, setUsersCount]       = useState(0);
  const [revenueTotal, setRevenueTotal]   = useState(0);

  // --- State for transactions & chart ---
  const [txns, setTxns]     = useState([]);
  const [labels, setLabels] = useState([]);
  const [dataPts, setDataPts] = useState([]);

  const socketRef = useRef(null);

  // 1. Fetch initial data
  useEffect(() => {
    axios.get(`${API}/house`)
      .then(({ data }) => setListingsCount(data.length))
      .catch(console.error);

    axios.get(`${API}/auth`)
      .then(({ data }) => setUsersCount(data.length))
      .catch(console.error);

    axios.get(`${API}/api/mpesa/transactions`)
      .then(({ data }) => setTxns(data))
      .catch(console.error);
  }, [API]);

  // 2. Compute total revenue
  useEffect(() => {
    const sum = txns
      .filter(t => t.status === "SUCCESS")
      .reduce((acc, t) => acc + Number(t.amount), 0);
    setRevenueTotal(sum);
  }, [txns]);

  // 3. Real‑time updates
  useEffect(() => {
    socketRef.current = io(API, {
      transports: ["websocket"],
      upgrade: false,
      secure: true,
    });
    socketRef.current.on("newtransaction", txn =>
      setTxns(prev => [txn, ...prev])
    );
    socketRef.current.on("transactionUpdated", updated =>
      setTxns(prev => prev.map(t =>
        t.checkoutRequestID === updated.checkoutRequestID ? updated : t
      ))
    );
    return () => socketRef.current.disconnect();
  }, [API]);

  // 4. Build chart data
  useEffect(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("default", { month: "short", year: "numeric" }),
        month: d.getMonth(),
        year: d.getFullYear(),
      });
    }
    const sums = months.map(({ month, year }) =>
      txns
        .filter(t => {
          const d = new Date(t.createdAt);
          return t.status === "SUCCESS"
              && d.getFullYear() === year
              && d.getMonth() === month;
        })
        .reduce((acc, t) => acc + Number(t.amount), 0)
    );
    setLabels(months.map(m => m.label));
    setDataPts(sums);
  }, [txns]);

  // Chart config
  const chartData = {
    labels,
    datasets: [{ label: "Revenue (KSH)", data: dataPts, borderRadius: 4 }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true }, x: {} },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Last 6 Months Revenue (Live)" }
    }
  };

  // Additional metrics
  const totalTxns   = txns.length;
  const successCnt  = txns.filter(t => t.status === "SUCCESS").length;
  const pendingCnt  = txns.filter(t => t.status === "PENDING").length;
  const failedCnt   = txns.filter(t => t.status === "FAILED").length;
  const avgTxnValue = successCnt > 0
    ? Math.round(revenueTotal / successCnt)
    : 0;

  // Subcomponent for summary cards
  const DashboardCard = ({ title, value }) => (
    <div className="card">
      <h3>{title}</h3>
      <p>{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="main">
      <header className="header">
        <h1>Reports</h1>
        <p>Generate and review performance reports</p>
      </header>

      <div className="reports">
        {/* Summary Cards */}
        <div className="cards">
          <DashboardCard title="Total Listings" value={listingsCount} />
          <DashboardCard title="Total Users"    value={usersCount} />
          <DashboardCard title="Total Revenue"  value={revenueTotal} />
        </div>

        {/* Revenue Chart */}
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Key Insights Section */}
        <div className="report-summary">
          <h2>Key Insights</h2>
          <p>
            To date, the platform hosts <strong>{listingsCount}</strong> property listings
            and serves <strong>{usersCount}</strong> registered users. We have processed
            <strong> {totalTxns}</strong> transactions in total.
          </p>
          <div className="insight-grid">
            <div className="insight-card">
              <h4>Total Revenue</h4>
              <p>KSH {revenueTotal.toLocaleString()}</p>
            </div>
            <div className="insight-card">
              <h4>Successful Payments</h4>
              <p>{successCnt} (<small>avg. KSH {avgTxnValue.toLocaleString()}</small>)</p>
            </div>
            <div className="insight-card">
              <h4>Pending Payments</h4>
              <p>{pendingCnt}</p>
            </div>
            <div className="insight-card">
              <h4>Failed Transactions</h4>
              <p>{failedCnt}</p>
            </div>
          </div>
          <p className="insight-notes">
            Use these insights to forecast cash flow, prioritize follow‑ups on pending payments,
            and spot listing performance trends.
          </p>
        </div>
      </div>
    </div>
  );
};
