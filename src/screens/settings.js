import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom"; // Needed for the portal
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
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
  FaLifeRing
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../App.css";

const API_BASE_URL =process.env.REACT_APP_DOMAIN;



export const Settings = () => (
  <div className="main">
    <header className="header">
      <h1>Settings</h1>
      <p>Configure platform preferences</p>
    </header>
    <div className="settings">
      <div className="settings-item">
        <label>Platform Name:</label>
        <input type="text" defaultValue="Dwelify" />
      </div>
      <div className="settings-item">
        <label>Support Email:</label>
        <input type="email" defaultValue="support@dwelify.com" />
      </div>
      <div className="settings-item">
        <label>Timezone:</label>
        <select defaultValue="UTC">
          <option value="UTC">UTC</option>
          <option value="EST">EST</option>
          <option value="PST">PST</option>
        </select>
      </div>
      <button className="action-btn edit">Save Settings</button>
    </div>
  </div>
);