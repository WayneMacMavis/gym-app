// src/components/HamburgerMenu.js

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useProgram } from "../../context/ProgramContext";
import { FiHome, FiList, FiClock, FiTrendingUp, FiBookOpen } from "react-icons/fi"; // ✅ added FiBookOpen for Library
import "./HamburgerMenu.scss";

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const [routineOpen, setRoutineOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(null);
  const navigate = useNavigate();
  const { programs, numDays } = useProgram();

  useEffect(() => {
    if (!open) {
      setRoutineOpen(false);
      setWeekOpen(null);
    }
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setRoutineOpen(false);
    setWeekOpen(null);
  };

  const handleDayClick = (week, day) => {
    navigate(`/week/${week}/day/${day}`);
    closeMenu();
  };

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
              <FiHome className="nav-icon" /> Overview
            </NavLink>
          </li>

          {/* Routine dropdown */}
          <li>
            <button
              className="dropdown-toggle"
              onClick={() => setRoutineOpen(!routineOpen)}
            >
              <FiList className="nav-icon" /> Routine {routineOpen ? "▲" : "▼"}
            </button>

            <ul className={`dropdown-list ${routineOpen ? "open" : ""}`}>
              {programs.map((week, w) => {
                const weekNum = w + 1;
                const isOpen = weekOpen === weekNum;
                return (
                  <li key={weekNum}>
                    <button
                      className="week-toggle"
                      onClick={() =>
                        setWeekOpen(isOpen ? null : weekNum)
                      }
                    >
                      Week {weekNum} {isOpen ? "▲" : "▼"}
                    </button>

                    <ul className={`dropdown-sublist ${isOpen ? "open" : ""}`}>
                      {Array.from({ length: numDays }, (_, d) => {
                        const dayNum = d + 1;
                        return (
                          <li key={`w${weekNum}d${dayNum}`}>
                            <button
                              className="day-link"
                              onClick={() => handleDayClick(weekNum, dayNum)}
                            >
                              Day {dayNum}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </li>

          <li>
            <NavLink
              to="/history"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              <FiClock className="nav-icon" /> History
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/progress"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              <FiTrendingUp className="nav-icon" /> Progress
            </NavLink>
          </li>

          {/* ✅ New Workout Library link */}
          <li>
            <NavLink
              to="/library"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              <FiBookOpen className="nav-icon" /> Workout Library
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
