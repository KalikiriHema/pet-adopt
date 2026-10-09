import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TrackApplicationModal from "./TrackApplicationModal";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  const handleHashNav = (hashId) => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${hashId}`);
    }
  };

  const handleHomeClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === "/" && !location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/" && !location.hash) return true;
    if (path !== "/" && location.pathname === path) return true;
    return false;
  };

  return (
    <>
      <header className="site-header">
        <nav className="site-nav">
          {/* Brand Logo */}
          <Link to="/" onClick={handleHomeClick} className="logo">
            <img src="/logo.jpg" alt="Pet Adoption Logo" width="44" height="44" />
            <span className="logo-text">Pet <span>Adoption</span></span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Navigation Links */}
          <div className={`nav-menu-wrapper ${mobileMenuOpen ? "open" : ""}`}>
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className={isActive("/") ? "active-link" : ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/more-dogs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isActive("/more-dogs") ? "active-link" : ""}
                >
                  Dogs
                </Link>
              </li>
              <li>
                <Link
                  to="/more-cats"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isActive("/more-cats") ? "active-link" : ""}
                >
                  Cats
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isActive("/donate") ? "active-link" : ""}
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  to="/volunteer"
                  onClick={() => setMobileMenuOpen(false)}
                  className={isActive("/volunteer") ? "active-link" : ""}
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleHashNav("contact");
                  }}
                >
                  Contact
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTrackModalOpen(true);
                  }}
                  style={{
                    background: "rgba(255, 99, 71, 0.12)",
                    border: "1.5px solid rgba(255, 99, 71, 0.4)",
                    color: "#ea580c",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 99, 71, 0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 99, 71, 0.12)")}
                >
                  <span>📋</span>
                  <span>Track Status</span>
                </button>
              </li>
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: "#ea580c",
                    color: "#ffffff",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(234, 88, 12, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#c2410c")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#ea580c")}
                >
                  <span>🛡️</span>
                  <span>Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Track Application Modal */}
      <TrackApplicationModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />
    </>
  );
}

