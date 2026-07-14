import React, { useState } from "react";
import "./sermons.css";

export const Sermons = () => {
  const [selectedSeries, setSelectedSeries] = useState("all");

  const sermons = [
    {
      id: 1,
      title: "Faith Over Fear",
      speaker: "Pastor John Smith",
      series: "faith",
      date: "June 16, 2024",
      duration: "45 min",
      views: "2.3K",
      image: "🙏"
    },
    {
      id: 2,
      title: "The Power of Prayer",
      speaker: "Pastor Sarah Johnson",
      series: "prayer",
      date: "June 9, 2024",
      duration: "38 min",
      views: "1.8K",
      image: "🙏"
    },
    {
      id: 3,
      title: "Living with Purpose",
      speaker: "Pastor John Smith",
      series: "faith",
      date: "June 2, 2024",
      duration: "42 min",
      views: "2.1K",
      image: "🎯"
    },
    {
      id: 4,
      title: "Grace in Every Season",
      speaker: "Pastor Sarah Johnson",
      series: "grace",
      date: "May 26, 2024",
      duration: "40 min",
      views: "1.9K",
      image: "✨"
    },
    {
      id: 5,
      title: "Building Strong Foundations",
      speaker: "David Williams",
      series: "foundations",
      date: "May 19, 2024",
      duration: "44 min",
      views: "2.5K",
      image: "🏗️"
    },
    {
      id: 6,
      title: "The Love of God",
      speaker: "Pastor John Smith",
      series: "grace",
      date: "May 12, 2024",
      duration: "39 min",
      views: "3.2K",
      image: "❤️"
    }
  ];

  const series = [
    { id: "all", name: "All Sermons" },
    { id: "faith", name: "Faith Over Fear" },
    { id: "prayer", name: "Prayer Series" },
    { id: "grace", name: "Grace & Mercy" },
    { id: "foundations", name: "Strong Foundations" }
  ];

  return (
    <div className="sermons-page">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="containerr">
          <div className="navbar-content">
            <div className="logo-section">
              <div className="logo-circle">KLC</div>
              <h2> Deliverence Church International Kona Ya Musa</h2>
            </div>
            <nav className="desktop-nav">
              <a href="/">Home</a>
              <a href="/sermons">Sermons</a>
              <a href="/giving">Giving</a>
              <a href="/contact">Contact</a>
            </nav>
            <div className="navbar-actions">
              <button className="btn-secondary">Subscribe</button>
              <button className="btn-primary">Watch Live</button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="containerr">
          <h1>Our Sermons</h1>
          <p>Explore powerful messages that transform hearts and minds.</p>
            <div className="hero-image-area2">

              <div className="hero-image-card2">

                <img
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754"
                  alt="Church Worship"
                />

              </div>

             
              </div>
        </div>
        
      </section>

      {/* FILTER 
      <section className="filter-bar">
        <div className="containerr">
          <div className="series-filter">
            {series.map(s => (
              <button
                key={s.id}
                className={`filter-btn ${selectedSeries === s.id ? 'active' : ''}`}
                onClick={() => setSelectedSeries(s.id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </section>
*/}




      {/* SERMONS GRID */}
      <section className="sermons-grid-section">
        <div className="containerr">
          <div className="sermons-grid">
            {sermons
              .filter(s => selectedSeries === "all" || s.series === selectedSeries)
              .map(sermon => (
                <div key={sermon.id} className="sermon-item">
                  <div className="sermon-image">{sermon.image}</div>
                  <div className="sermon-details">
                    <h3>{sermon.title}</h3>
                    <p className="speaker">{sermon.speaker}</p>
                    <p className="date">{sermon.date}</p>
                    <div className="sermon-stats">
                      <span>⏱️ {sermon.duration}</span>
                      <span>👁️ {sermon.views}</span>
                    </div>
                  </div>
                  <button className="play-btn">▶ Play</button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="containerr">
          <h2>Subscribe to Our Channel</h2>
          <p>Never miss a message. Get new sermons delivered to your inbox.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="containerr">
          <div className="footer-content">
            <div className="footer-section">
              <h4> Deliverence Church International Kona Ya Musa</h4>
              <p>Transforming lives through God's Word.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/sermons">Sermons</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: sermons@wordrevelationchurch.com</p>
              <p>Phone: +254798104979</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <p>Facebook • Instagram • YouTube</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026  Deliverence Church International Kona Ya Musa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
