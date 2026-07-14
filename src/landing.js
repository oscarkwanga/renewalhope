import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './premium.css';

const slides = [
  {
    title: 'Where Faith Comes Alive',
    subtitle: 'A warm, welcoming church family in the heart of Ukunda, grounded in prayer, worship, and service.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=80'
  },
  {
    title: 'Community Rooted in Grace',
    subtitle: 'Gathering people around authentic worship, practical teaching, and compassionate care.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80'
  },
  {
    title: 'Hope for Every Season',
    subtitle: 'Spirit-led messages that speak to everyday life and deepen your walk with God.',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1800&q=80'
  }
];

const LandingPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((value) => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="page-shell">
      <header className="navbar">
        <div className="container navbar-inner">
          <Link className="brand" to="/">
            <div className="brand-mark">✝</div>
            <div>DCI Kona Ya Musa</div>
          </Link>
          <nav className="nav-links">
            <Link to="/" className="active">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/ministries">Ministries</Link>
            <Link to="/events">Events</Link>
            <Link to="/sermons">Sermons</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="hero-carousel">
        {slides.map((slide, index) => (
          <div key={slide.title} className={`hero-slide ${index === activeSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.image})` }} />
        ))}
        <div className="container hero-content">
          <div className="hero-kicker">Deliverance Church International</div>
          <h1 className="hero-title">{slides[activeSlide].title}</h1>
          <p className="hero-subtitle">{slides[activeSlide].subtitle}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/new-here">Plan your visit</Link>
            <Link className="btn btn-secondary" to="/sermons">Watch latest sermon</Link>
          </div>
          <p className="hero-credits">Sunday worship • Prayer ministry • Community outreach</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Welcome home</div>
          <h2 className="section-title">A church where people belong, grow, and serve.</h2>
          <p className="section-copy">Whether you are visiting for the first time or returning to deepen your walk with God, our prayer is that you find encouragement, truth, and community here.</p>
          <div className="card-grid card-grid-3">
            <article className="card reveal">
              <div className="card-media"><img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80" alt="First time visitor" /></div>
              <div className="card-body">
                <div className="card-meta">First time</div>
                <h3 className="card-title">New here?</h3>
                <p className="card-copy">We will help you settle in with clear directions, warm fellowship, and a path to connect with the church family.</p>
                <Link className="btn btn-ghost" to="/new-here">Plan your visit</Link>
              </div>
            </article>
            <article className="card reveal">
              <div className="card-media"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Get involved" /></div>
              <div className="card-body">
                <div className="card-meta">Community</div>
                <h3 className="card-title">Get involved</h3>
                <p className="card-copy">Find a ministry, join a small group, or serve through outreach and discipleship opportunities that fit your season.</p>
                <Link className="btn btn-ghost" to="/get-involved">Join a ministry</Link>
              </div>
            </article>
            <article className="card reveal">
              <div className="card-media"><img src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80" alt="Prayer" /></div>
              <div className="card-body">
                <div className="card-meta">Prayer</div>
                <h3 className="card-title">Need prayer?</h3>
                <p className="card-copy">Share your request with our ministry team and receive support through thoughtful prayer and encouragement.</p>
                <Link className="btn btn-ghost" to="/prayer-request">Send request</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--surface)' }}>
        <div className="container split-grid">
          <div className="reveal">
            <div className="eyebrow">About us</div>
            <h2 className="section-title">Faithful teaching, meaningful relationships, and purposeful service.</h2>
            <p className="section-copy">We are a growing church family committed to helping people encounter God, grow in truth, and live out their calling with confidence and compassion.</p>
            <Link className="btn btn-primary" to="/about">Learn more about our story</Link>
          </div>
          <div className="card reveal">
            <div className="card-media"><img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80" alt="Church community" /></div>
            <div className="card-body">
              <div className="pill">Sunday 7:00 AM • 10:30 AM</div>
              <h3 className="card-title" style={{ marginTop: '0.8rem' }}>A place for worship, discipleship, and care</h3>
              <p className="card-copy">Join us for uplifting worship, scripture-rich teaching, and generous community that supports every stage of life.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Latest messages</div>
          <h2 className="section-title">Sermons that strengthen, guide, and encourage.</h2>
          <div className="card-grid card-grid-3">
            <article className="card reveal">
              <div className="card-body">
                <div className="card-meta">Prayer series</div>
                <h3 className="card-title">The Power of Consistent Prayer</h3>
                <p className="card-copy">A practical journey into praying with faith, consistency, and expectancy in every season.</p>
                <Link className="btn btn-ghost" to="/sermon-details">Watch sermon</Link>
              </div>
            </article>
            <article className="card reveal">
              <div className="card-body">
                <div className="card-meta">Purpose series</div>
                <h3 className="card-title">Discovering Your God-Given Purpose</h3>
                <p className="card-copy">A refreshing message on identity and calling for those seeking direction in life.</p>
                <Link className="btn btn-ghost" to="/sermon-details">Watch sermon</Link>
              </div>
            </article>
            <article className="card reveal">
              <div className="card-body">
                <div className="card-meta">Resource</div>
                <h3 className="card-title">Explore our full library</h3>
                <p className="card-copy">Browse all sermon teachings and connect with deeper biblical insight for everyday life.</p>
                <Link className="btn btn-primary" to="/sermons">View all sermons</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h4>DCI Kona Ya Musa</h4>
            <p>Faithful teaching, prayerful care, and a welcoming community for every season.</p>
          </div>
          <div>
            <h4>Visit</h4>
            <p>Ratinga, Ukunda</p>
            <p>+254 798 104 979</p>
          </div>
          <div>
            <h4>Connect</h4>
            <p><Link to="/about">About</Link></p>
            <p><Link to="/events">Events</Link></p>
            <p><Link to="/admin">Admin</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
