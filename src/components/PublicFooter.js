import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter = () => (
  <footer className="footer">
    <div className="containerr footer-content">
      <div className="footer-section">
        <h4>Deliverance Church International Kona Ya Musa</h4>
        <p>Building faith, restoring hope, and serving our community with compassion.</p>
      </div>
      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/ministries">Ministries</Link></li>
          <li><Link to="/events">Events</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Contact</h4>
        <p>Email: info@church.org</p>
        <p>Phone: +254 700 000 000</p>
      </div>
      <div className="footer-section">
        <h4>Connect</h4>
        <p>Facebook · Instagram · YouTube</p>
      </div>
    </div>
    <div className="containerr footer-bottom">
      <p>&copy; 2026 DCI Kona Ya Musa. All rights reserved.</p>
    </div>
  </footer>
);
