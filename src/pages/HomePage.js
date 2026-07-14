import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Faith-led spaces for lasting impact',
    description: 'A refined digital home for worship, service, stories, and modern community care.',
    cta: 'Explore ministries',
    to: '/ministries',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Purposeful gatherings that welcome every season',
    description: 'Elegant digital programming that keeps every member connected and inspired.',
    cta: 'View sermons',
    to: '/sermons',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Stories shaped by grace, service, and belonging',
    description: 'From sermons to leadership updates, everything is presented with clarity and care.',
    cta: 'Read stories',
    to: '/news',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  },
];

const quickLinks = [
  {
    title: 'About our mission',
    text: 'Learn how Grace & Light serves people with clarity, warmth, and purposeful care.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    to: '/about',
  },
  {
    title: 'Ministries in action',
    text: 'See the programs that build community, encourage growth, and support every season.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
    to: '/ministries',
  },
  {
    title: 'Sunday messages',
    text: 'Discover sermons that bring calm reflection, practical insight, and spiritual encouragement.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
    to: '/sermons',
  },
  {
    title: 'Community updates',
    text: 'Stay connected with announcements, stories, and meaningful moments from the church family.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80',
    to: '/news',
  },
];

const values = [
  {
    title: 'Thoughtful gatherings',
    text: 'Every event is curated to feel welcoming, calm, and beautifully organized.',
  },
  {
    title: 'Personal support',
    text: 'Prayer care, guidance, and encouragement are shaped around real needs.',
  },
  {
    title: 'Clear communication',
    text: 'Sermons, stories, and updates are presented with elegance and ease.',
  },
];


const services = [
  {
    title: "Sunday First Service",
    time: "8:00 AM",
    location: "Main Sanctuary",
  },
  {
    title: "Sunday Second Service",
    time: "10:30 AM",
    location: "Main Sanctuary",
  },
  {
    title: "Midweek Fellowship",
    time: "Wednesday • 5:30 PM",
    location: "Church Auditorium",
  },
  {
    title: "Friday Kesha",
    time: "Last Friday • 9:00 PM",
    location: "Main Sanctuary",
  },
];


const ministries = [
  {
    title: "Youth",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    link: "/ministries",
  },
  {
    title: "Men",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    link: "/ministries",
  },
  {
    title: "Women",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    link: "/ministries",
  },
  {
    title: "Prayer",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80",
    link: "/ministries",
  },
  {
    title: "Children",
    image:
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    link: "/ministries",
  },
  {
    title: "Worship",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    link: "/ministries",
  },
];


function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const currentSlide = slides[activeSlide];

  return (
    <div className="page-shell">
      <section className="hero-banner" style={{ backgroundImage: `url(${currentSlide.image})` }}>
        <div className="hero-overlay" />
        <div className="hero-content container reveal">
          <p className="eyebrow">2026 ministry experience</p>
          <h1>{currentSlide.title}</h1>
          <p>{currentSlide.description}</p>
          <div className="hero-actions">
            <Link className="button button--primary" to={currentSlide.to}>{currentSlide.cta}</Link>
            <Link className="button button--secondary" to="/contact">Plan a visit</Link>
          </div>
          <div className="hero-dots" aria-label="Homepage hero slider">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                className={`hero-dot ${index === activeSlide ? 'is-active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>


<section className="experience2026 reveal">

    <div className="experience2026-top">

        <span>
            EXPERIENCE WRC
        </span>

        <h2>

            More than attending church.

            <br />

            Experience God's Presence.

        </h2>

        <p>

            Welcome to WRC Deliverance Church Kona ya Musa —
            a Christ-centred family where worship is passionate,
            God's Word transforms lives, and every person is
            encouraged to grow, serve and belong.

        </p>

    </div>

    <div className="experience2026-gallery">

        <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80"
            alt="Church Worship"
        />

        <div className="experience-card card-one">

            <small>OUR HEART</small>

            <h3>Faith</h3>

            <p>

                Building lives upon the truth of God's Word.

            </p>

        </div>

        <div className="experience-card card-two">

            <small>OUR WORSHIP</small>

            <h3>Praise</h3>

            <p>

                Joyful worship that brings people closer to Christ.

            </p>

        </div>

        <div className="experience-card card-three">

            <small>OUR FAMILY</small>

            <h3>Community</h3>

            <p>

                Genuine friendships where everyone belongs.

            </p>

        </div>

    </div>

</section>




      <section className="section container reveal">
        <div className="section-heading">
          <p className="eyebrow">A modern ministry home</p>
          <h2>Elegant experiences for worship, stories, and connection.</h2>
          <p className="section-copy">The homepage now opens with rich imagery, thoughtful copy, and a premium layout that feels built for 2026.</p>
        </div>

        <div className="card-grid">
          {quickLinks.map((item) => (
            <Link className="feature-link-card" key={item.title} to={item.to}>
              <img src={item.image} alt={item.title} className="card-image" />
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>







      <section className="discover-section reveal">

    <div className="discover-title">

        <span>DISCOVER YOUR PLACE</span>

        <h2>

            Everyone Belongs.
            <br />
            Every Gift Matters.

        </h2>

        <p>

            Whether you're joining us for the first time
            or looking for a place to serve,
            there is a ministry waiting for you.

        </p>

    </div>

    <div className="discover-layout">

        <div className="discover-center">

            <img
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80"
                alt="Church Family"
            />

        </div>

        {ministries.map((item) => (

            <Link
                key={item.title}
                to={item.link}
                className="ministry-circle"
            >

                <img
                    src={item.image}
                    alt={item.title}
                />

                <h4>{item.title}</h4>

            </Link>

        ))}

    </div>

</section>





      <section className="section section--surface">
        <div className="container reveal">
          <div className="section-heading">
            <p className="eyebrow">Why people feel at home</p>
            <h2>Warm, polished, and intentionally designed for every visit.</h2>
          </div>
          <div className="feature-grid">
            {values.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>




<section className="stories-section reveal">

    <div className="stories-heading">

        <span>CHURCH LIFE</span>

        <h2>

            Every Week,
            <br />
            God Is Writing New Stories.

        </h2>

        <p>

            Every worship service, prayer meeting, outreach,
            youth gathering and fellowship becomes another
            chapter of God's faithfulness.

        </p>

    </div>

    <div className="stories-gallery">

        <img
            className="story-one"
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
            alt=""
        />

        <img
            className="story-two"
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80"
            alt=""
        />

        <img
            className="story-three"
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
            alt=""
        />

        <img
            className="story-four"
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80"
            alt=""
        />

        <img
            className="story-five"
            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80"
            alt=""
        />

    </div>

</section>




      <section className="section container reveal">
        <div className="split-panel">
          <div className="split-media">
            <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80" alt="Community gathering" />
          </div>
          <div className="split-copy">
            <p className="eyebrow">Fresh updates</p>
            <h2>Weekly rhythm, pastoral guidance, and meaningful moments.</h2>
            <p className="section-copy">From Sunday gatherings to prayer care and community stories, every part of the experience has a clear path and a calm visual rhythm.</p>
            <div className="stack-card">
              <div className="list-row">
                <strong>Sunday service</strong>
                <p>Join a welcoming gathering filled with music, reflection, and heartfelt teaching.</p>
              </div>
              <div className="list-row">
                <strong>Prayer support</strong>
                <p>Receive compassionate encouragement through trusted guidance and real care.</p>
              </div>
              <div className="list-row">
                <strong>Leadership stories</strong>
                <p>Discover the people guiding the mission with calm leadership and purposeful care.</p>
              </div>
            </div>
            <Link className="button button--primary" to="/news">See latest stories</Link>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container reveal">
          <div className="cta-panel">
            <div>
              <p className="eyebrow">Ready to visit?</p>
              <h2>Come experience a space that feels warm, elegant, and welcoming.</h2>
              <p className="section-copy">Whatever your season, there is a clear place to begin.</p>
            </div>
            <div className="hero-actions">
              <Link className="button button--primary" to="/sermons">Browse sermons</Link>
              <Link className="button button--secondary" to="/contact">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
