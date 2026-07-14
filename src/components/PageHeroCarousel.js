import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const PageHeroCarousel = ({ slides }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 8000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const slide = slides[activeSlide];

  return (
    <section className="hero-carousel">
      {slides.map((item, index) => (
        <div
          key={item.title || index}
          className={`hero-carousel__slide ${index === activeSlide ? 'hero-carousel__slide--active' : ''}`}
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ))}

      <div className="hero-carousel__overlay">
        <span className="hero-small-text">{slide.subtitleLabel || 'Welcome'}</span>
        <h1 className="hero-title">{slide.title}</h1>
        <p className="hero-inner-text">{slide.description}</p>
        {slide.primaryCta && (
          <div className="hero-actions">
            <Link className="btn btn-primary" to={slide.primaryCta.href}>{slide.primaryCta.label}</Link>
            {slide.secondaryCta && (
              <Link className="btn btn-secondary" to={slide.secondaryCta.href}>{slide.secondaryCta.label}</Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
