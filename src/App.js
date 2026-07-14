import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import './theme.css';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MinistriesPage from './pages/MinistriesPage';
import SermonsPage from './pages/SermonsPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/sermons', label: 'Sermons' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin' },
];

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <header className="site-header">
        <div className="container nav-bar">
          <NavLink to="/" className="brand-block">
            <div className="brand-mark">GL</div>
            <div>
              <p className="brand-name">Grace & Light</p>
              <p className="brand-tag">Modern ministry experience</p>
            </div>
          </NavLink>
          <nav className="top-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="page-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ministries" element={<MinistriesPage />} />
          <Route path="/sermons" element={<SermonsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

    <footer className="site-footer">

    <div className="footer-glow"></div>

    <div className="container">

        <div className="footer-top">

            <div className="footer-brand">

                <div className="footer-logo">

                    WRC

                </div>

                <h2>

                    WRC Deliverance Church

                </h2>

                <p>

                    Kona Ya Musa

                </p>

                <span>

                    A place to Worship.
                    A place to Belong.
                    A place to Grow.

                </span>

            </div>

            <div className="footer-column">

                <h4>Explore</h4>

                <NavLink to="/">Home</NavLink>

                <NavLink to="/about">About</NavLink>

                <NavLink to="/ministries">Ministries</NavLink>

                <NavLink to="/sermons">Sermons</NavLink>

                <NavLink to="/news">News</NavLink>

                <NavLink to="/contact">Contact</NavLink>

            </div>

            <div className="footer-column">

                <h4>Visit Us</h4>

                <p>Kona Ya Musa</p>

                <p>Mombasa, Kenya</p>

                <p>Sunday Worship</p>

                <strong>8:00 AM & 10:30 AM</strong>

            </div>

            <div className="footer-column">

                <h4>Connect</h4>

                <a href="#">Facebook</a>

                <a href="#">YouTube</a>

                <a href="#">Instagram</a>

                <a href="#">WhatsApp</a>

            </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">

            <p>

                © 2026 WRC Deliverance Church Kona Ya Musa.
                All Rights Reserved.

            </p>

            <p>

                Built with faith • Hope • Excellence

            </p>

        </div>

    </div>

</footer>
    </div>
  );
}

export default App;




