import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-AU", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "Australia/Sydney",
    }).format(new Date());
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <aside className="sidebar" aria-label="Main Navigation">
      <div className="sidebar-header">
        <div className="brand">
          <img
            src="/images/boston-institute-logo.avif"
            alt="Boston Institute"
            className="brand-logo"
          />
        </div>

        <button
          type="button"
          className="hamburger-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <header className="top-bar top-bar-sidebar">
        <div>
          <p className="support-text">Welcome back</p>
          <h1>Hello, Priya Sharma</h1>
          <p className="date-text">{todayLabel}</p>
        </div>
      </header>

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item is-active" : "nav-item")} end>
          Dashboard
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => (isActive ? "nav-item is-active" : "nav-item")}>
          Attendance
        </NavLink>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <div className="mobile-nav-sheet">
            <div className="mobile-nav-sheet-header">
              <p className="mobile-nav-title">Menu</p>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                ×
              </button>
            </div>
            <nav className="mobile-nav-menu">
              <NavLink to="/" className={({ isActive }) => (isActive ? "mobile-nav-item is-active" : "mobile-nav-item")} end>
                Dashboard
              </NavLink>
              <NavLink to="/attendance" className={({ isActive }) => (isActive ? "mobile-nav-item is-active" : "mobile-nav-item")}>
                Attendance
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
