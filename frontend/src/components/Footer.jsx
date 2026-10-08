import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pro-footer">
      {/* Wave / Divider Banner */}
      <div className="footer-top-cta">
        <div className="footer-cta-container">
          <div className="cta-text">
            <span className="cta-badge">🐾 Save A Life Today</span>
            <h3>Ready to welcome a new furry family member?</h3>
            <p>Every pet at our shelter is vaccinated, health-checked, and waiting for love.</p>
          </div>
          <div className="cta-actions">
            <Link to="/more-dogs" className="footer-cta-btn primary">Adopt a Dog</Link>
            <Link to="/more-cats" className="footer-cta-btn secondary">Adopt a Cat</Link>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Grid */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Column 1: Brand & Trust */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img src="/logo.jpg" alt="Pet Adoption Logo" className="footer-logo-img" />
              <div>
                <span className="brand-name">Pet Adoption</span>
                <span className="brand-tagline">Animal Welfare & Rescue Trust</span>
              </div>
            </div>
            <p className="brand-description">
              Dedicated to rescuing, rehabilitating, and rehoming abandoned animals. We believe every pet deserves a safe, loving forever home.
            </p>
            <div className="trust-badges">
              <span className="trust-pill">🛡️ Registered Non-Profit</span>
              <span className="trust-pill">✨ 500+ Happy Adoptions</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Adopt & Care</h4>
            <ul className="footer-link-list">
              <li><Link to="/more-dogs">🐶 Adopt a Dog</Link></li>
              <li><Link to="/more-cats">🐱 Adopt a Cat</Link></li>
              <li><Link to="/donate">💖 Make a Donation</Link></li>
              <li><Link to="/volunteer">🤝 Volunteer With Us</Link></li>
              <li><a href="#pets">🐾 Featured Pets</a></li>
            </ul>
          </div>

          {/* Column 3: Shelter Info & Hours */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Shelter Center</h4>
            <div className="shelter-info-list">
              <div className="shelter-info-item">
                <span className="info-icon">📍</span>
                <span>Sector 14, Main Road, City Center</span>
              </div>
              <div className="shelter-info-item">
                <span className="info-icon">🕒</span>
                <span>Mon – Sat: 10:00 AM – 5:00 PM<br /><small style={{ color: "#94a3b8" }}>Sundays by Appointment</small></span>
              </div>
              <div className="shelter-info-item">
                <span className="info-icon">📞</span>
                <span><strong>Helpline:</strong> +91 98765 43210</span>
              </div>
              <div className="shelter-info-item">
                <span className="info-icon">✉️</span>
                <span><strong>Email:</strong> support@petcare.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter / Stay Connected */}
          <div className="footer-nav-col newsletter-col">
            <h4 className="footer-col-title">Stay Connected</h4>
            <p className="newsletter-desc">
              Subscribe for rescue stories, adoption drives, and shelter updates.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                &rarr;
              </button>
            </form>
            {newsletterSubscribed && (
              <span className="newsletter-success">
                ✅ Thank you for joining our rescue community!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            &copy; 2026 Pet Adoption & Animal Welfare Platform. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <button type="button" onClick={scrollToTop} className="back-to-top-btn" title="Scroll to top">
              Back to Top &uarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
