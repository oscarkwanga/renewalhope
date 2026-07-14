import React, { useState } from "react";
import "./about.css";
import { Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

export const About = () => {

  
    const [mobileMenu, setMobileMenu] = useState(false);
  

  return (
    <div className="about-page">
    
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
                 Our Story
               </h2>
         
               <p className="hero-inner-text">
                 Discover how  Deliverence Church International Kona Ya Musa has been transforming lives and communities since 2020
               </p>
         
              
                <a href="#our-journey" className="scroll-indicator">Explore Our Journey</a>
         </div>
         </div>
         
           </section>

   

      {/* ========================= */}
      {/* OUR JOURNEY SECTION */}
      {/* ========================= */}
      <section className="values-section" id="our-journey">
        <div className="containerr">
          <div className="connection-header">

  <span>OUR JOURNEY</span>

  <h2>
   <div className="spantwo"/> From a small gathering to a thriving community
  </h2>

  <p>
    Whether you're exploring faith,
    looking for community or seeking prayer,
    we'd love to connect with you.
  </p>

</div>





        

          <div className="timeline">
           <div className="timeline-item">
              <div className="timeline-content">
                <p> Deliverence Church International (DCI), World Revelation Church, is a prominent Cristian ministry located at Ratinga Kona Ya Musa in Ukunda town.
                  The church is led by Rev.Gideon Muuo, who is known for his inspirational leadership and education to spreading the message of the gospel.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>6th 2020 - The Beginning</h3>
                <p> Deliverence Church International Kona Ya Musa was was planted from Mikindani by Rev.Robert Ngatia.<br/>The church was launched in Millenium Hotel Ukunda.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2021 - Growing Community</h3>
                <p>We started off three people; pastor, his wife and John a member. By December 2021 we had grown to a membership of 25 people .</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>January 2022 - First eviction</h3>
                <p>January 2022 we were evicted from the hotel and we moved to a school dining hall in Mekaela Ratinga.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>August 2022 - Second eviction</h3>
                <p>In August 2022 we bought a land still around Ratinga at a cost of Kshs 900,000 .<br/> In December the same year we moved to our land and bought one tent which we started using that by January 2023 
                we have bought another tent and we gre spiritually and in numbers.</p>
              </div>
            </div>

              <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Today </h3>
                <p>In January 2024 we were a membership of 180 both adults and children. <br/> We have a total of 22 leaders in te church in different departments who are cathartic, analytic and catalytic in service to God
                <br/> We also adopted a children's home called Daystar who se support and work closely with.
                <br/> We believe in training and the church enrolled in 8 students in the JCC School of Ministry last year who graduated on 27th October 2024.
                <br/> We are actively involved in school and colleges ministry and we are reaching out to atleast 6 schools weekly .</p>
              </div>
            </div>

          </div>
        </div>
      </section>




      {/* ========================= */}
      {/* HERO SECTION */}
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

             
          <h3 style={{fontSize:'1rem',alignSelf:'center'}}>Rev.Gideon Muuo (Main Pastor)</h3>

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
      {/* OUR BELIEFS SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <div className="connection-header">
            <span>What We Believe</span>
          
            <h2> <div className="spantwo"/>Our core convictions shape everything we do</h2>
          </div>

          <div className="beliefs-grid">
            <div className="belief-card">
              <div className="belief-icon">📖</div>
              <h3>Biblical Foundation</h3>
              <p>We believe in the authority and truth of God's Word as our guide for faith and practice.</p>
            </div>

            <div className="belief-card">
              <div className="belief-icon">❤️</div>
              <h3>God's Love</h3>
              <p>We celebrate that God loves everyone unconditionally and extends grace to all who believe.</p>
            </div>

            <div className="belief-card">
              <div className="belief-icon">🤝</div>
              <h3>Community</h3>
              <p>We believe in the power of authentic relationships and supporting one another in faith.</p>
            </div>

            <div className="belief-card">
              <div className="belief-icon">🌍</div>
              <h3>Mission</h3>
              <p>We're committed to spreading the Gospel and serving our community with love and action.</p>
            </div>
          </div>
          
        </div>
        
      </section>


 {/* ========================= */}
      {/* VISION SECTION */}
      {/* ========================= */}
      <section className="vision-section">
        <div className="containerr">
          <div className="vision-content">
            <h2>Our Vision</h2>
            <p>
              We envision a future where  Deliverence Church International Kona Ya Musa continues to be a beacon of hope, a place where broken hearts are healed, 
              doubts are transformed into faith, and every person experiences the transformative power of God's love.
            </p>
            <div className="vision-highlights">
              <div className="highlight">
                <span className="highlight-number">1</span>
                <p>Reaching more lives through digital and traditional ministry</p>
              </div>
              <div className="highlight">
                <span className="highlight-number">2</span>
                <p>Expanding community programs and social impact initiatives</p>
              </div>
              <div className="highlight">
                <span className="highlight-number">3</span>
                <p>Developing next-generation leaders in faith and service</p>
              </div>
            </div>
          </div>
           <div className="vision-content">
            <h2>Our Mission</h2>
            <p>
              We envision a future where  Deliverence Church International Kona Ya Musa continues to be a beacon of hope, a place where broken hearts are healed, 
              doubts are transformed into faith, and every person experiences the transformative power of God's love.
            </p>
            <div className="vision-highlights">
              <div className="highlight">
                <span className="highlight-number">1</span>
                <p>Reaching more lives through digital and traditional ministry</p>
              </div>
             
            </div>
          </div>
            {/* ========================= */}
      {/* OUR IMPACT SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <div className="section-header">
            <p>Our Impact</p>
            <p className="section-subtitle">How we're making a difference</p>
          </div>

          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-number">2,000+</div>
              <p>Church Members</p>
            </div>

            <div className="impact-card">
              <div className="impact-number">500+</div>
              <p>Weekly Volunteers</p>
            </div>

            <div className="impact-card">
              <div className="impact-number">10,000+</div>
              <p>Community Members Served</p>
            </div>

            <div className="impact-card">
              <div className="impact-number">50+</div>
              <p>Active Ministries</p>
            </div>
          </div>
        </div>
      </section>

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
              <p>Email: info@wordrevelationchurch.com</p>
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
export default About;