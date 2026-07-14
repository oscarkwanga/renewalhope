import React, { useState, useEffect } from "react";
import "./home.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  Navigate
} from "react-router-dom";

import About from './about';
import { Events } from './events';
import { Ministries } from './ministries';
import { Sermons } from './sermons';
import { Blog } from './blog';
import { NewHere } from './newhere';
import { GetInvolved } from './getinvolved';
import { PrayerRequest } from './prayerrequest';
import { SermonDetails } from './sermondetails';
import { MinistryDetails } from './ministrydetails';
import { StoryDetails } from './storydetails';
import { PublicNavbar } from './components/PublicNavbar';
import { PublicFooter } from './components/PublicFooter';
import { Menu, X } from 'lucide-react';

const heroSlides = [
  {
    title: "A welcoming church for every season of life",
    description: "Join us for inspiring worship, practical teaching, and a community that cares.",
    ctaPrimary: "Plan Your Visit",
    ctaSecondary: "Explore Ministries",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Cultivating faith with clarity and purpose",
    description: "Experience gospel-centered teaching, prayer support, and life-changing community.",
    ctaPrimary: "Watch Sermons",
    ctaSecondary: "See Events",
    image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Serving our neighborhood with compassion",
    description: "From local outreach to youth leadership, discover how you can make an impact.",
    ctaPrimary: "Get Involved",
    ctaSecondary: "Contact Us",
    image: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=80"
  }
];

const Hom = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <header className="navbar">
        <div className="navbar-container">
          <div className="site-brand">
            <div className="site-brand__mark">✝</div>
            <div className="site-brand__name">DCI Kona Ya Musa</div>
          </div>

          <nav className="desktop-nav">
            <Link className="site-nav__link" to="/">Home</Link>
            <Link className="site-nav__link" to="/about">About</Link>
            <Link className="site-nav__link" to="/ministries">Ministries</Link>
            <Link className="site-nav__link" to="/events">Events</Link>
            <Link className="site-nav__link" to="/sermons">Sermons</Link>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setMobileMenu((open) => !open)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
            <Link to="/about" onClick={() => setMobileMenu(false)}>About</Link>
            <Link to="/ministries" onClick={() => setMobileMenu(false)}>Ministries</Link>
            <Link to="/events" onClick={() => setMobileMenu(false)}>Events</Link>
            <Link to="/sermons" onClick={() => setMobileMenu(false)}>Sermons</Link>
          </div>
        )}
      </header>

      <section className="hero-carousel">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`hero-carousel__slide ${activeSlide === index ? 'hero-carousel__slide--active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        <div className="hero-carousel__overlay">
          <span className="hero-small-text">DELIVERANCE CHURCH INTERNATIONAL</span>
          <h1 className="hero-title">{heroSlides[activeSlide].title}</h1>
          <p className="hero-inner-text">{heroSlides[activeSlide].description}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/new-here">{heroSlides[activeSlide].ctaPrimary}</Link>
            <Link className="btn btn-secondary" to="/ministries">{heroSlides[activeSlide].ctaSecondary}</Link>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="containerr">
          <div className="section-headerr">
            <span className="valuespann">WELCOME HOME</span>
            <h2>
              <div className="spantwo" /> There Is A Place For You Here
            </h2>
            <p className="text-lead">
              Whether you're exploring faith, looking for community, or seeking prayer, we would love to welcome you.
            </p>
          </div>

          <div className="connection-grid">
            <div className="connection-card">
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
                alt="New Here"
              />
              <div className="connection-content">
                <h4>FIRST TIME VISITOR</h4>
                <h3 className="midtext">New here?</h3>
                <p>
                  We would love to help you feel at home, meet new people, and discover your next step.
                </p>
                <Link className="btn btn-secondary" to="/new-here">
                  Plan Your Visit
                </Link>
              </div>
            </div>

            <div className="connection-card">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Get Involved"
              />
              <div className="connection-content">
                <h4>COMMUNITY</h4>
                <h3 className="midtext">Get Involved</h3>
                <p>
                  Discover a ministry or serving opportunity that matches your gifts and passion.
                </p>
                <Link className="btn btn-secondary" to="/get-involved">
                  See Opportunities
                </Link>
              </div>
            </div>

            <div className="connection-card">
              <img
                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80"
                alt="Prayer"
              />
              <div className="connection-content">
                <h4>PRAYER</h4>
                <h3 className="midtext">Need prayer?</h3>
                <p>
                  Our prayer team is ready to stand with you and believe God with you.
                </p>
                <Link className="btn btn-secondary" to="/prayer-request">
                  Submit Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* QUICK ACTIONS */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-headerr">
<div className="connection-headerr">

    <span className="valuespann">WELCOME HOME</span>

  <h2>
   <div className="spantwo"/> There Is A Place For You Here
  </h2>

  <p>
    Whether you're exploring faith,
    looking for community or seeking prayer,
    we'd love to connect with you.
  </p>

</div>


<div className="connection-grid">




  
    
  <div className="connection-card">

    <img
      src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
      alt="New Here"
    />

    <div className="connection-content">

      <h4>FIRST TIME VISITOR</h4>

      <h3 className="midtext">New here?</h3>

      <p>
        We would love to help you feel at home,
        meet new people and discover your next step.
      </p>

      <Link to="/new-here">
        Plan Your Visit →
      </Link>

    </div>

  </div>

  <div className="connection-card">

    <img
      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
      alt="Get Involved"
    />

    <div className="connection-content">

      <h4>COMMUNITY</h4>

      <h3>Get Involved</h3>

      <p>
        Find a ministry, join a group,
        and build meaningful relationships.
      </p>

      <Link to="/get-involved">
        Join A Ministry →
      </Link>

    </div>

  </div>

  <div className="connection-card">

    <img
      src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80"
      alt="Prayer"
    />

    <div className="connection-content">

      <h4>PRAYER</h4>

      <h3>Need Prayer?</h3>

      <p>
        Our prayer team is ready to stand
        with you and believe God with you.
      </p>

      <Link to="/prayer-request">
        Submit Request →
      </Link>

    </div>

  </div>



</div>
     
          

          </div>

          

        </div>

      </section>

            {/* ========================= */}
      {/* ABOUT PREVIEW */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="about-grid">

            <div className="about-image">

              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3"
                alt="Church Community"
              />

            </div>

            <div className="connection-header">

                <span className="valuespan">ABOUT OUR CHURCH</span>

  <h2>
   <div className="spantwo"/>    A Church Passionate About
                Jesus, People And Purpose
  </h2>

             

              <p>
                We exist to lead people into a growing relationship with Jesus
                Christ through authentic worship, biblical teaching, prayer,
                discipleship and community outreach.
              </p>

             

              <Link  className='btn btn-secondary' to='/about' >
                Learn More 
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* MISSION & VISION */}
      {/* ========================= 

      <section className="mission-vision-section">

        <div className="containerr">

          <div className="mission-vision-grid">

            <div className="mission-card">

              <div className="mv-icon">
                🎯
              </div>

              <h3>
                Our Mission
              </h3>

              <p>
                To know Christ and make Him known by transforming lives through
                the power of the Gospel and raising disciples who impact the
                world.
              </p>

            </div>

            <div className="vision-card">

              <div className="mv-icon">
                🌍
              </div>

              <h3>
                Our Vision
              </h3>

              <p>
                To become a thriving global church family that equips believers,
                reaches nations and demonstrates God's love in every community.
              </p>

            </div>

          </div>

        </div>

      </section>
*/}
     
            {/* ========================= */}
      {/* FEATURED SERMONS */}
      {/* ========================= */}
      <section className="values-section">

        <div className="containerr">

          <div className="section-headerr">

             <span className="valuespan">
              LATEST MESSAGES
            </span>

          

            <p>
              Watch, listen and grow through life-changing biblical teachings.
            </p>

          </div>

          <div className="sermon-grid">

           


            <div className="sermon-card">

              <div className="sermon-thumbnail">
                <img
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81"
                  alt="Sermon"
                />
              </div>

              <div className="sermon-contentt">

                <h4>
                  Prayer Series
                </h4>

                <h3>
                  The Power Of Consistent Prayer
                </h3>

                <p>
                  Learn how prayer can transform every area of your life.
                </p>

                <Link to="/sermon-details" >
                  Watch Sermon
                </Link>

              </div>

            </div>


            <div className="sermon-card">

              <div className="sermon-thumbnail">
                <img
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3"
                  alt="Sermon"
                />
              </div>

              <div className="sermon-contentt">

                <h4>
                  Purpose Series
                </h4>

                <h3>
                  Discovering Your God Given Purpose
                </h3>

                <p>
                  Uncover God's unique calling and assignment for your life.
                </p>

                <Link to="/sermon-details" >
                  Watch Sermon
                </Link>

              </div>

            </div>

             <div className="sermon-card">

            

              <div className="sermon-contentt">
<div className="sermonnext">


               

                <h1 >
                  Find all sermons
                </h1>

                  <p>
              Discover all life-changing sermons.
            </p>

                <Link className='btn btn-secondary'  to="/sermons" >
                  Click to get all sermons.
                </Link>
</div>
              </div>

            </div>

          </div>

        </div>

      </section>

     
            {/* ========================= */}
      {/* MINISTRIES SECTION */}
      {/* ========================= */}
  
      <section className="values-section">

        <div className="containerr">

          <div className="section-headerr">
  <div className="section-headerr">


    <span className="valuespan">OUR MINISTRIES</span>

  <h2>
   <div className="spantwo"/> Find a place to service in Church
  </h2>

  
            

            <p>
              Discover ministries designed to help every person grow spiritually,
              build relationships and serve God effectively.
            </p>

          </div>


<div className="connection-grid">




  
    
  <div className="ministry-card">
   <div className="ministry-image">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18"
                  alt="Children Ministry"
                />
              </div>

    <div className="connection-content">

      <span> Children's Ministry</span>

       

                <p>
                  Helping children discover Jesus through fun, engaging and
                  age-appropriate biblical teaching.
                </p>
     

    </div>
 <Link className="button" to="/ministry-details">
       Learn more →
      </Link>
  </div>

 
    
  <div className="ministry-card">
   <div className="ministry-image">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18"
                  alt="Children Ministry"
                />
              </div>

    <div className="connection-content">

      <span> Youth Ministry</span>

   

                <p>
                  Raising a generation of young believers equipped
                  to influence culture for Christ.
                </p>

     

    </div>
 <Link className="button" to="/ministry-details">
        Learn more →
      </Link>
  </div>

  
    
  <div className="ministry-card">
   <div className="ministry-image">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18"
                  alt="Children Ministry"
                />
              </div>


    <div className="connection-content">

      <span> Women's Ministry</span>

    
              

                <p >
                  Encouraging women to grow in faith, leadership and purpose
                  through biblical fellowship.
                </p>

    

    </div>
      <Link  className="button" to="/ministry-details">
        Learn more →
      </Link>

  </div>



</div>
     
          

          </div>

          

        </div>

      </section>

     

       {/* CORE VALUES */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-header">

            <span className="valuespan">
              OUR FOUNDATION
            </span>

      

            <p>
              Everything we do is built upon these biblical values.
            </p>

          </div>

          <div className="values-grid">

            <div className="value-card">

              <div className="value-icon">
                ✝️
              </div>

              <h4>
                Christ Centered
              </h4>

              <p>
                Jesus is at the center of everything we do.
              </p>

            </div>

            <div className="value-card">

              <div className="value-icon">
                📖
              </div>

             <h4>
                Christ Centered
              </h4>

              <p>
                God's Word is our final authority and guide.
              </p>

            </div>

            <div className="value-card">

              <div className="value-icon">
                ❤️
              </div>
<h4>
                Christ Centered
              </h4>

              <p>
                Every person matters because every person matters to God.
              </p>

            </div>

            <div className="value-card">

              <div className="value-icon">
                🙏
              </div>

            <h4>
                Christ Centered
              </h4>

              <p>
                We depend on God through prayer in every situation.
              </p>

            </div>

            <div className="value-card">

              <div className="value-icon">
                🤝
              </div>

           <h4>
                Christ Centered
              </h4>

              <p>
                We grow stronger together through fellowship.
              </p>

            </div>

            <div className="value-card">

              <div className="value-icon">
                🚀
              </div>

              <h4>
                Christ Centered
              </h4>

              <p>
                We honor God by giving our very best.
              </p>

            </div>

          </div>

        </div>

      </section>


            {/* ========================= */}
      {/* EVENTS SECTION */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-headerr">

              <span className="valuespan">
              UPCOMING EVENTS
            </span>

           
            <p>
              Stay updated with conferences, worship nights, discipleship
              programs and special church gatherings.
            </p>

          </div>

          <div className="sermon-grid">

            <div className="event-card">

              <div className="event-date">
                <h4>15</h4>
                <span>JUL</span>
              </div>

              <div className="event-contents">

                <h4 className="event-type">
                  Conference
                </h4>

                <h2>
                  Global Faith Conference 2026
                </h2>

                <p>
                  Three days of worship, teaching, prayer and leadership
                  empowerment.
                </p>

                <Link to="/event-details" className="linking">
                  Register Now
                </Link>

              </div>

            </div>

           <div className="event-card">

              <div className="event-date">
                <h4>15</h4>
                <span>JUL</span>
              </div>

              <div className="event-contents">

                <h4 className="event-type">
                  Conference
                </h4>

                <h2>
                  Global Faith Conference 2026
                </h2>

                <p>
                  Three days of worship, teaching, prayer and leadership
                  empowerment.
                </p>

                <Link to="/event-details" className="linking">
                  Register Now
                </Link>

              </div>

            </div>

               <div className="sermon-card">

            

              <div className="sermon-contentt">
<div className="sermonnext">


               

                <h1 >
                  Find all sermons
                </h1>

                  <p>
              Discover all life-changing sermons.
            </p>

                <Link className='btn btn-secondary'  to="/ministries" >
                  visit
                </Link>
</div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* CHURCH SCHEDULE */}
      {/* ========================= */}

      <section className="schedule-section">

        <div className="containerr">

          <div className="section-headerr">

            <h2>
              WEEKLY SCHEDULE
            </h2>

          <p>
           Join us for our meed-week services.
            </p>

                <div className="hero-image-card">

                <img
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754"
                  alt="Church Worship"
                />

              </div>

          </div>

          <div className="schedule-gridd">
 <div className="event-card">

            <div className="event-datee">

              <h4>
                Sunday Worship Service
              </h4>

              <p>
                First service 7:00 AM - 9:30 AM •  Second service 10:30 AM - 1:00 PM
              </p>

            </div>
</div>
         <div className="event-card">

            <div className="event-datee">

              <h4>
                Prayers And Fasting
              </h4>

              <p>
                Monday • 5:00 PM
              </p>

            </div>
</div>

            <div className="event-card">

            <div className="event-datee">

              <h4>
                Bible Study
              </h4>

              <p>
                Wednesday • 5:00 PM
              </p>

            </div>
</div>
            <div className="event-card">

            <div className="event-datee">

              <h4>
                Home Bible Churches
              </h4>

              <p>
                Friday • 6:00 PM
              </p>

            </div>
</div>

          </div>

        </div>

      </section>

   
            {/* ========================= */}
      {/* ONLINE GIVING SECTION */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-header">

              <span className="valuespan">
              ONLINE GIVING
            </span>

            <p>
              Support God's Work Through Generous Giving
            </p>

            <p>
              Your giving helps us reach people, support missions,
              transform communities and advance God's Kingdom.
            </p>

          </div>

          <div className="giving-grid">

        {/* ========================= */}
      {/* CTA SECTION */}
      {/* ========================= */}
      <section className="cta-section">
        <div className="containerr">
          <h2>Giving is an act of worship and obedience</h2>
          <p>Parner with us in advancing God's work.</p>
          <div className="cta-buttons">
            <Link to="/giving" className="btn btn-primary">
              Start giving
            </Link>
            <Link to="/giving-info" className="btn btn-secondary">
              Learn about giving
            </Link>
          </div>
        </div>
      </section>


          </div>

        </div>

      </section>

      
    

      {/* ========================= */}
      {/* LOCATION & SERVICE TIMES */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-header">

            <span>
              FIND US / VISIT OUR CHURCH
            </span>

        
          </div>

          <div className="location-grid">

            <div className="location-card">

              <h3>
                Main Campus
              </h3>

              <p>
                123 Kingdom Avenue
              </p>

              <p>
                Nairobi, Kenya
              </p>

            </div>

            <div className="location-card">

              <h3>
                Sunday Services
              </h3>

              <p>
                8:00 AM
              </p>

              <p>
                10:30 AM
              </p>

              <p>
                1:00 PM
              </p>

            </div>

            <div className="location-card">

              <h3>
                Contact
              </h3>

              <p>
                info@church.org
              </p>

              <p>
                +254 700 000 000
              </p>

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
             <p style={{fontSize:'9px',color:'grey'}}>KWANG'A TECH. (+254798104979)</p>
          </div>
        </div>
      </footer>
    

    </div>
  );
};













export const Homee = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Hom />} />
      <Route path="/about" element={<About />} />
      <Route path="/ministries" element={<Ministries />} />
      <Route path="/events" element={<Events />} />
      <Route path="/sermons" element={<Sermons />} />
      <Route path="/new-here" element={<NewHere />} />
      <Route path="/prayer-request" element={<PrayerRequest />} />
      <Route path="/sermon-details" element={<SermonDetails />} />
      <Route path="/ministry-details" element={<MinistryDetails />} />
      <Route path="/story-details" element={<StoryDetails />} />
      <Route path="/get-involved" element={<GetInvolved />} />
    </Routes>
  </Router>
);

export default Homee;