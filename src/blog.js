import React from "react";
import "./about.css";

export const Blog = () => {
  return (
    <div className="about-page">
      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}
      <header className="values-section">
        <div className="containerr">
          <div className="navbar-content">
            <div className="logo-section">
              <div className="logo-circle">WRC</div>
              <h2> Deliverence Church International Kona Ya Musa</h2>
            </div>
            <nav className="desktop-nav">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/ministries">Ministries</a>
              <a href="/events">Events</a>
            </nav>
           
          </div>
        </div>
      </header>

      {/* ========================= */}
      {/* HERO SECTION */}
      {/* ========================= */}
      <section className="values-section">
        
        <div className="containerr">
          <div className="hero-content">
            <h1>Our Story</h1>
            <p className="hero-subtitle">
              Discover how  Deliverence Church International Kona Ya Musa has been transforming lives and communities since 1995
            </p>
            <a href="#our-journey" className="scroll-indicator">Explore Our Journey</a>
          </div>
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

      {/* ========================= */}
      {/* OUR JOURNEY SECTION */}
      {/* ========================= */}
      <section className="values-section" id="our-journey">
        <div className="containerr">
          <div className="section-header">
            <p>Our Journey</p>
            <p className="section-subtitle">From a small gathering to a thriving community</p>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>1995 - The Beginning</h3>
                <p> Deliverence Church International Kona Ya Musa was founded with a vision to create a welcoming community where people can encounter God's love and experience His grace.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2005 - Growing Community</h3>
                <p>Our church family expanded from 50 to over 500 members. We launched new ministries and outreach programs to serve our community.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2015 - Digital Impact</h3>
                <p>We embraced digital ministry, bringing our message to people worldwide through live streaming and online resources.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2024 - Present Day</h3>
                <p>Today, we continue to grow and serve with over 2,000 members actively engaged in ministry and community service.</p>
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

             
          <h3 style={{fontSize:'2rem',alignSelf:'center'}}>Rev.Gideon Muuo</h3>

            </div>
            {/* LEFT */}

            <div className="hero-content">

           

              <p className="hero-description2">
              "  Join a vibrant church community where people encounter God,
                build meaningful relationships, discover purpose, and impact
                the world through faith and service."
              </p>

              

              {/* HERO STATS 

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
*/}
            </div>

          

          </div>

        </div>

      </section>


      
      {/* ========================= */}
      {/* OUR BELIEFS SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <div className="section-header">
            <p>What We Believe</p>
            <p className="section-subtitle">Our core convictions shape everything we do</p>
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
        </div>
      </section>


      {/* ========================= */}
      {/* LEADERSHIP SECTION */}
      {/* ========================= */}
      <section className="values-section">
        <div className="containerr">
          <div className="section-header">
            <p>Our Leadership</p>
            <p className="section-subtitle">Meet the team leading our church family</p>
          </div>

          <div className="leadership-grid">
            <div className="leader-card">
              <div className="leader-image"></div>
              <h3>Pastor John Smith</h3>
              <p className="role">Senior Pastor</p>
              <p className="bio">With 25 years of ministry experience, Pastor John leads our church with passion, vision, and a heart for discipleship.</p>
            </div>

            <div className="leader-card">
              <div className="leader-image"></div>
              <h3>Pastor Sarah Johnson</h3>
              <p className="role">Associate Pastor</p>
              <p className="bio">Sarah oversees our worship and community outreach programs with dedication and spiritual insight.</p>
            </div>

            <div className="leader-card">
              <div className="leader-image"></div>
              <h3>David Williams</h3>
              <p className="role">Director of Ministries</p>
              <p className="bio">David coordinates our diverse ministry programs and ensures every member finds their place in our church.</p>
            </div>
          </div>
        </div>
      </section>

      

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
              <p>Email: info@kingdomlifechurch.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <p>Facebook • Instagram • YouTube</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024  Deliverence Church International Kona Ya Musa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Blog;