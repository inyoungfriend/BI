import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CloseIconButton from "../../../shared/ui/atoms/CloseIconButton";

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
        <NavLink to="/" className="brand" aria-label="Go to dashboard" end>
          <img
            src="/images/boston-institute-logo.avif"
            alt="Boston Institute"
            className="brand-logo"
          />
        </NavLink>

        <button
          type="button"
          className="hamburger-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <svg className="hamburger-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 4h10" />
            <path d="M3 8h10" />
            <path d="M3 12h10" />
          </svg>
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
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-item is-active" : "nav-item")}
          end
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) => (isActive ? "nav-item is-active" : "nav-item")}
        >
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
              <CloseIconButton
                className="notice-close-button"
                onClick={() => setIsMobileMenuOpen(false)}
                ariaLabel="Close navigation menu"
              />
            </div>
            <nav className="mobile-nav-menu">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-item is-active" : "mobile-nav-item"
                }
                end
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  isActive ? "mobile-nav-item is-active" : "mobile-nav-item"
                }
              >
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
