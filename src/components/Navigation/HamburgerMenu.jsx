import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./HamburgerMenu.scss";

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="hamburger-container">
      {/* Burger Icon */}
      <button
        className={`burger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Slide-out Nav */}
      <nav className={`side-nav ${open ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/week/1/day/1"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              Routine
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              History
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Overlay */}
      {open && <div className="overlay" onClick={closeMenu} />}
    </div>
  );
};

export default HamburgerMenu;
