import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Ministries', path: '/ministries' },
  { label: 'Events', path: '/events' },
  { label: 'Sermons', path: '/sermons' }
];

export const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="site-brand">
          <div className="site-brand__mark">✝</div>
          <div className="site-brand__name">DCI Kona Ya Musa</div>
        </div>

        <nav className="desktop-nav">
          {navItems.map((item) => (
            <Link key={item.path} className="site-nav__link" to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="menu-toggle" onClick={() => setMobileOpen((value) => !value)}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
