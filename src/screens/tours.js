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


export const Tours = () => {

    

/* Helper function: returns a CSS class based on status */
const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "status-pending";
    case "active":
      return "status-active";
    case "suspended":
      return "status-suspended";
    case "completed":
      return "status-completed";
    case "refunded":
      return "status-refunded";
    case "rejected":
      return "status-rejected";
    case "on hold":
      return "status-onhold";
    case "released":
      return "status-released";
    case "confirmed":
      return "status-confirmed";
    case "in progress":
      return "status-inprogress";
    case "open":
      return "status-open";
    case "closed":
      return "status-closed";
    default:
      return "status-default";
  }
};


  const tours = [
    { id: 1, property: "Apartment #23", scheduled: "2025-06-01", agent: "Agent A", status: "Confirmed" },
    { id: 2, property: "Villa #5", scheduled: "2025-06-05", agent: "Agent B", status: "Pending" },
    { id: 3, property: "House #12", scheduled: "2025-06-10", agent: "Agent C", status: "Completed" },
  ];
  return (
    <div className="main">
      <header className="header">
        <h1>House Tours</h1>
        <p>Manage and schedule property tours</p>
      </header>
      <div className="tours">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property</th>
                <th>Scheduled Date</th>
                <th>Agent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.property}</td>
                  <td>{t.scheduled}</td>
                  <td>{t.agent}</td>
                  <td className={getStatusClass(t.status)}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
