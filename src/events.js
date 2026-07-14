import React, { useState } from "react";
import "./events.css";
import { Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

export const Events = () => {
  const [viewMode, setViewMode] = useState("list"); // list or calendar

  
      const [mobileMenu, setMobileMenu] = useState(false);
    

  const upcomingEvents = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: "June 16, 2024",
      time: "10:00 AM - 12:00 PM",
      location: "Main Sanctuary",
      category: "worship",
      description: "Join us for dynamic worship, inspiring messages, and community connection.",
      attendees: "500+",
      image: "🙏"
    },
    {
      id: 2,
      title: "Youth Night: Gaming & Fellowship",
      date: "June 18, 2024",
      time: "6:00 PM - 8:30 PM",
      location: "Youth Center",
      category: "youth",
      description: "Game night, snacks, and meaningful conversations with friends.",
      attendees: "150+",
      image: "🎮"
    },
    {
      id: 3,
      title: "Community Food Drive",
      date: "June 22, 2024",
      time: "8:00 AM - 2:00 PM",
      location: "Church Parking Lot",
      category: "community",
      description: "Help us collect and distribute food to families in need.",
      attendees: "200+",
      image: "🤝"
    },
    {
      id: 4,
      title: "Prayer Meeting",
      date: "June 20, 2024",
      time: "7:00 PM - 8:30 PM",
      location: "Prayer Room",
      category: "spiritual",
      description: "Join our prayer warriors in interceding for our church and community.",
      attendees: "50+",
      image: "🙏"
    },
    {
      id: 5,
      title: "Women's Conference 2024",
      date: "June 25-26, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Fellowship Hall",
      category: "conference",
      description: "Two-day conference with inspiring speakers, workshops, and networking.",
      attendees: "300+",
      image: "👩‍💼"
    },
    {
      id: 6,
      title: "Kids Summer Camp Registration",
      date: "June 24, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Main Office",
      category: "youth",
      description: "Register for our exciting summer camp filled with activities and learning.",
      attendees: "100+",
      image: "👶"
    },
    {
      id: 7,
      title: "Baptism Sunday",
      date: "July 7, 2024",
      time: "11:00 AM",
      location: "Jordan River Park",
      category: "worship",
      description: "Celebrate baptisms and new commitments to Christ.",
      attendees: "300+",
      image: "💧"
    },
    {
      id: 8,
      title: "Annual Mission Trip Commissioning",
      date: "July 14, 2024",
      time: "6:00 PM",
      location: "Main Sanctuary",
      category: "missions",
      description: "Send off our teams heading to international mission fields.",
      attendees: "400+",
      image: "🌍"
    }
  ];

  return (
    <div className="events-page">
        {/* ========================= */}
                     {/* NAVBAR */}
                     {/* ========================= */}
                 <header className="navbar">
               
                 <div className="navbar-container">
               
                   <div className="logo-section">
               
                     <div className="logo-circle">✝</div>
               
                     <h2>DCI Kona Ya Musa</h2>
               
                   </div>
               
                   <nav className="desktop-nav">
               
                     <Link to="/">Home</Link>
                     <Link to="/about">About</Link>
                     <Link to="/ministries">Ministries</Link>
                     <Link to="/events">Events</Link>
                     <Link to="/sermons">Sermons</Link>
               
                   </nav>
               
                   <button
                     className="menu-toggle"
                     onClick={() => setMobileMenu(!mobileMenu)}
                   >
                     {mobileMenu ? <X size={28} /> : <Menu size={28} />}
                   </button>
               
                 </div>
            {mobileMenu && (
             <div style={{background:' darkslategray', flexDirection:'column', display:'flex',
             gap:'0.7rem' , paddingBottom:'1rem',alignItems:'çenter',justifyContent:'center',
             marginTop:'1rem'
             }}>
            
              <Link
              style={{ color:'white',textAlign:'center'}}
                to="/"
                onClick={() => setMobileMenu(false)}
              >
                Home
              </Link>
            
              <Link
              style={{ color:'white',textAlign:'center'}}
                to="/about"
                onClick={() => setMobileMenu(false)}
              >
                About
              </Link>
            
              <Link
              style={{ color:'white',textAlign:'center'}}
                to="/ministries"
                onClick={() => setMobileMenu(false)}
              >
                Ministries
              </Link>
            
              <Link
              style={{ color:'white',textAlign:'center'}}
                to="/events"
                onClick={() => setMobileMenu(false)}
              >
                Events
              </Link>
            
            </div>
             )}
              
               
               </header>




               
                     {/* ========================= */}
                     {/* HERO SECTION */}
                     {/* ========================= */}
               
               <section className="premium-hero">
               
                 <div className="hero-overlay">
               
                   <div className="hero-inner">
               
               
                     <h2 className="hero-title">
                       Our Events
                     </h2>
               
                     <p className="hero-inner-text">
                       Stay connected with our church calendar. Join us for worship, fellowship, and spiritual growth.
                     </p>
               
                    
                      <a href="#our-journey" className="scroll-indicator">Explore Our Events</a>
               </div>
               </div>
               
                 </section>


               
      {/* ========================= */}
      {/* VIEW MODE */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="hero-grid">
  {/* RIGHT */}

            <div className="hero-image-area2">

              <div className="hero-image-card2">

                <img
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754"
                  alt="Church Worship"
                />

              </div>

             
          <h3 style={{fontSize:'2rem',alignSelf:'center'}}>Rev.Gideon Muuo</h3>

            </div>
            {/* LEFT */}

            <div className="hero-content">

           

              <p className="hero-description2">
              "  Join a vibrant church community where people encounter God,
                build meaningful relationships, discover purpose, and impact
                the world through faith and service."
              </p>

              

              HERO STATS 

              <div className="hero-stats">

                <div className="stat-card">
                  <h3>15K+</h3>
                  <p>Members</p>
                </div>

                <div className="stat-card">
                  <h3>120+</h3>
                  <p>Countries Reached</p>
                </div>

                <div className="stat-card">
                  <h3>500+</h3>
                  <p>Weekly Volunteers</p>
                </div>

              </div>

            </div>

          

          </div>

 <div className="hero-grid">
  {/* RIGHT */}

            <div className="hero-image-area2">

              <div className="hero-image-card2">

                <img
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754"
                  alt="Church Worship"
                />

              </div>

             
          <h3 style={{fontSize:'2rem',alignSelf:'center'}}>Rev.Gideon Muuo</h3>

            </div>
            {/* LEFT */}

            <div className="hero-content">

           

              <p className="hero-description2">
              "  Join a vibrant church community where people encounter God,
                build meaningful relationships, discover purpose, and impact
                the world through faith and service."
              </p>

              

              HERO STATS 

              <div className="hero-stats">

                <div className="stat-card">
                  <h3>15K+</h3>
                  <p>Members</p>
                </div>

                <div className="stat-card">
                  <h3>120+</h3>
                  <p>Countries Reached</p>
                </div>

                <div className="stat-card">
                  <h3>500+</h3>
                  <p>Weekly Volunteers</p>
                </div>

              </div>

            </div>

          

          </div>

 <div className="hero-grid">
  {/* RIGHT */}

            <div className="hero-image-area2">

              <div className="hero-image-card2">

                <img
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754"
                  alt="Church Worship"
                />

              </div>

             
          <h3 style={{fontSize:'2rem',alignSelf:'center'}}>Rev.Gideon Muuo</h3>

            </div>
            {/* LEFT */}

            <div className="hero-content">

           

              <p className="hero-description2">
              "  Join a vibrant church community where people encounter God,
                build meaningful relationships, discover purpose, and impact
                the world through faith and service."
              </p>

              

              HERO STATS 

              <div className="hero-stats">

                <div className="stat-card">
                  <h3>15K+</h3>
                  <p>Members</p>
                </div>

                <div className="stat-card">
                  <h3>120+</h3>
                  <p>Countries Reached</p>
                </div>

                <div className="stat-card">
                  <h3>500+</h3>
                  <p>Weekly Volunteers</p>
                </div>

              </div>

            </div>

          

          </div>

        </div>

      </section>
      {/* ========================= */}
      {/* VIEW MODE TOGGLE */}
      {/* ========================= 
      <section className="toggle-section">
        <div className="containerr">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List View
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              📅 Calendar View
            </button>
          </div>
        </div>
      </section>
*/}
      {/* ========================= */}
      {/* EVENTS LIST */}
      {/* ========================= */}
      
        <section className="values-section">
          <div className="containerr">
            <div className="events-list">
              {upcomingEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-left">
                  {/*    <div className="event-emoji">{event.image}</div> */}
                    <div className="event-date-badge">
                      <span className="date-month">Jun</span>
                      <span className="date-day">16</span>
                    </div>
                  </div>

                  <div className="event-content">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <span className={`event-category event-${event.category}`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                    </div>

                    <p className="event-description">{event.description}</p>

                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">🕐</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span>{event.attendees}</span>
                      </div>
                    </div>
                  </div>

                  <div className="event-right">
                    <button className="event-btn">Learn More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    

      {/* ========================= */}
      {/* CALENDAR VIEW */}
      {/* ========================= */}
     
        <section className="values-section">
          <div className="containerr">
            <div className="calendar-header">
              <h2>June 2024</h2>
              <div className="calendar-nav">
                <button className="calendar-btn">← Previous</button>
                <button className="calendar-btn">Next →</button>
              </div>
            </div>

            <div className="calendar-grid">
              <div className="calendar-day-header">Sun</div>
              <div className="calendar-day-header">Mon</div>
              <div className="calendar-day-header">Tue</div>
              <div className="calendar-day-header">Wed</div>
              <div className="calendar-day-header">Thu</div>
              <div className="calendar-day-header">Fri</div>
              <div className="calendar-day-header">Sat</div>

              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const hasEvent = upcomingEvents.some(e => e.date.includes(day.toString()));
                return (
                  <div key={i} className={`calendar-day ${hasEvent ? 'has-event' : ''}`}>
                    <span className="day-number">{day}</span>
                    {hasEvent && <div className="event-dot"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      

      {/* ========================= */}
      {/* FEATURED EVENTS */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <div className="section-header">
            <p>Featured Events</p>
            <p>Don't miss these special opportunities</p>
          </div>

          <div className="featured-grid">
            <div className="featured-card featured-1">
              <div className="featured-content">
                <span className="featured-label">🎯 Major Event</span>
                <h3>Women's Conference 2024</h3>
                <p>Inspiring speakers, workshops, and community</p>
                <div className="featured-meta">
                  <span>June 25-26</span>
                  <button className="featured-btn">Register Now</button>
                </div>
              </div>
            </div>

            <div className="featured-card featured-2">
              <div className="featured-content">
                <span className="featured-label">🌊 Spiritual</span>
                <h3>Baptism Sunday</h3>
                <p>Celebrate new commitments to Christ</p>
                <div className="featured-meta">
                  <span>July 7</span>
                  <button className="featured-btn">Learn More</button>
                </div>
              </div>
            </div>

            <div className="featured-card featured-3">
              <div className="featured-content">
                <span className="featured-label">🌍 Missions</span>
                <h3>Mission Trip Commissioning</h3>
                <p>Send off our teams to international fields</p>
                <div className="featured-meta">
                  <span>July 14</span>
                  <button className="featured-btn">Support</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* SUBSCRIBE SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <h2>Never Miss an Event</h2>
          <p>Subscribe to our event calendar and get notifications about upcoming activities.</p>
          
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}
      <footer className="footer">
        <div className="containerr">
          <div className="footer-content">
            <div className="footer-section">
              <h4> Deliverence Church International Kona Ya Musa</h4>
              <p>Building faith, transforming lives, impacting communities.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/ministries">Ministries</a></li>
                <li><a href="/events">Events</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: events@wordrevelationchurch.com</p>
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
