import React, { useState } from "react";
import "./ministries.css";
import { Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

export const Ministries = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "worship", "community", "youth", "discipleship"];

  const ministries = [
    {
      id: 1,
      name: "Contemporary Worship",
      category: "worship",
      description: "Experience dynamic worship with modern music and passionate praise.",
      image: "🎵",
      impact: "500+ weekly participants"
    },
    {
      id: 2,
      name: "Community Outreach",
      category: "community",
      description: "Serving our neighborhood through food drives, mentorship, and care.",
      image: "🤲",
      impact: "1000+ lives touched"
    },
    {
      id: 3,
      name: "Youth Ministry",
      category: "youth",
      description: "Empowering young people to live out their faith with purpose.",
      image: "🎯",
      impact: "200+ youth engaged"
    },
    {
      id: 4,
      name: "Small Groups",
      category: "discipleship",
      description: "Building deeper connections through Bible study and prayer.",
      image: "🔗",
      impact: "600+ members"
    },
    {
      id: 5,
      name: "Children's Ministry",
      category: "youth",
      description: "Creating safe, fun learning environments for kids ages 2-12.",
      image: "👶",
      impact: "350+ children"
    },
    {
      id: 6,
      name: "Prayer Warriors",
      category: "discipleship",
      description: "Interceding for our church, community, and world.",
      image: "🙏",
      impact: "150+ prayer warriors"
    },
    {
      id: 7,
      name: "Missions & Giving",
      category: "community",
      description: "Extending God's love to communities around the world.",
      image: "🌍",
      impact: "50+ countries"
    },
    {
      id: 8,
      name: "Counseling Services",
      category: "discipleship",
      description: "Professional, faith-based counseling for life challenges.",
      image: "💭",
      impact: "100+ lives healed"
    },
    {
      id: 9,
      name: "Men's Ministry",
      category: "community",
      description: "Brotherhood, mentoring, and spiritual growth for men.",
      image: "👨‍🤝‍👨",
      impact: "250+ men"
    }
  ];


  
      const [mobileMenu, setMobileMenu] = useState(false);
    

  const filteredMinistries = 
    activeCategory === "all" 
      ? ministries 
      : ministries.filter(m => m.category === activeCategory);

  return (
    <div className="ministries-page">
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
                     Our Ministries
                   </h2>
             
                   <p className="hero-inner-text">
                    Discover how you can use your gifts and talents to serve God and transform lives
                   </p>
             
                  
                    <a href="#our-journey" className="scroll-indicator">Explore Our Ministries</a>
             </div>
             </div>
             
               </section>
    

      
                  {/* ========================= */}
            {/* MINISTRIES SECTION */}
            {/* ========================= */}
        
            <section className="values-section">
      
              <div className="containerr">
      
                <div className="section-header">
        <div className="section-header">
      
      
        <span>OUR MINISTRIES</span>
      
        <h2>
         <div className="spantwo"/> Find a place to service in Church
        </h2>
      
        
                  
      
                  <p>
                    Discover ministries designed to help every person grow spiritually,
                    build relationships and serve God effectively.
                  </p>
      
                </div>
      
      
      <div className="connection-grid">
      
      
      
        {filteredMinistries.map(ministry => (
        
          
        <div key={ministry.id} className="ministry-card">
         <div className="ministry-image">
                      <img
                        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18"
                        alt="Children Ministry"
                      />
                    </div>
      
          <div className="connection-content">
       <span className="ministry-tag">{ministry.category}</span>
            <span> {ministry.name}</span>
      
             
      
                      <p>
                        {ministry.description}
                      </p>
            <Link to="/new-here">
             Learn more →
            </Link>
      
          </div>
      
        </div>
      
       
      ))}
      
      
      </div>
           
                
      
                </div>
      
                
      
              </div>
      
            </section>
      

      {/* ========================= */}
      {/* GET INVOLVED SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">

           <div className="section-header">
      
      
        <span>GET INVOLVED TODAY</span>
      
        <p>
         <div className="spantwo"/> Find your place in our church family. Whether you're looking to serve, grow, or connect, we have something for you.
        </p>
                </div>
         
          <div className="involvement-grid">
            <div className="involvement-card">
              <div className="involvement-number">1</div>
              <h3>Discover</h3>
              <p>Explore our various ministries and find what resonates with your heart.</p>
            </div>
            <div className="involvement-card">
              <div className="involvement-number">2</div>
              <h3>Connect</h3>
              <p>Meet our ministry leaders and join a community of like-minded believers.</p>
            </div>
            <div className="involvement-card">
              <div className="involvement-number">3</div>
              <h3>Serve</h3>
              <p>Use your gifts and talents to make a meaningful impact in God's kingdom.</p>
            </div>
          </div>
        </div>
      </section>

    {/* LEADERSHIP SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
         
            <div className="section-header">
      
      
        <span>OUR LEADERSHIP</span>
      
        <p>
         <div className="spantwo"/>Meet the passionate team leading our ministries
        </p>
                </div>

          <div className="leadership-grid">
            <div className="ministry-card">
              <div className="leader-image"></div>
              <h3 className="role">Pastor John Smith</h3>
              <p className="bio">Senior Pastor</p>
              <p className="bio">With 25 years of ministry experience, Pastor John leads our church with passion, vision, and a heart for discipleship.</p>
            </div>

            <div className="ministry-card">
              <div className="leader-image"></div>
              
              <h3 className="role">Pastor Sarah Johnson</h3>
              <p className="bio">Associate Pastor</p>
              <p className="bio">Sarah oversees our worship and community outreach programs with dedication and spiritual insight.</p>
            </div>

          </div>
        </div>
      </section>

      

      {/* ========================= */}
      {/* CTA SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <h2>Ready to Make a Difference?</h2>
          <p>Contact us today to learn more about getting involved in ministry.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Join a Ministry</button>
            <button className="btn btn-secondary">Contact Us</button>
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
              <p>Email: ministries@wordrevelationchurch.com</p>
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
