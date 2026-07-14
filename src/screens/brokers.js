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
import axios from "axios";


export const Brokers = () => {

    const API_BASE_URL =process.env.REACT_APP_DOMAIN;
 const [allbrokers, setallbrokers] = useState([]);

 
 
/* Helper function: returns a CSS class based on status */
const getStatusClass = (status) => {
   if (typeof status !== 'string') {
    // no status? fall back to your default class
    return "status-default";
  }
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



  const brokers = [
    { id: 1, name: "Broker A", email: "brokerA@example.com", phone: "123-4567", status: "Active", joined: "2025-03-10" },
    { id: 2, name: "Broker B", email: "brokerB@example.com", phone: "234-5678", status: "Active", joined: "2025-03-15" },
    { id: 3, name: "Broker C", email: "brokerC@example.com", phone: "345-6789", status: "Inactive", joined: "2025-04-01" },
  ];




  //function to get all the brokers
useEffect(()=>{
const fetchUsers = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/auth`);
    const filterbrokers=data.filter((user)=>user.space==='broker');
    setallbrokers(filterbrokers);
  } catch (err) {
    console.error("Failed to load users:", err);
  }
}
fetchUsers();
},[])



  return (
    <div className="main">
      <header className="header">
        <h1>Brokers</h1>
        <p>Manage broker profiles</p>
      </header>
      <div className="brokers">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allbrokers?.map((b,index) => (
                <tr key={b._id}>
                  <td>{index}</td>
                  <td>{b.firstname}</td>
                  <td>{b.email}</td>
                  <td>{b.contact}</td>
                  <td className={getStatusClass(b.status)}>{b.status}</td>
                  <td>{b.joined}</td>
                  <td>
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn suspend">Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
