import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.scss";

const days = ["Day 1", "Day 2", "Day 3"];

// Estimate workout time: 1s per rep, 30s rest between sets, 60s rest between workouts
const estimateDayTime = (workouts) => {
  let totalSeconds = 0;
  workouts.forEach((w, wi) => {
    const sets = w.sets || 0;
    const reps = w.reps || [];
    for (let i = 0; i < sets; i++) {
      const repsForSet = parseInt(reps[i], 10) || 0;
      totalSeconds += repsForSet;
      if (i < sets - 1) totalSeconds += 30;
    }
    if (wi < workouts.length - 1) totalSeconds += 60;
  });
  return Math.round(totalSeconds / 60);
};

const getClockColor = (minutes) => {
  if (minutes <= 20) return "#2a7a4b";
  if (minutes <= 40) return "#e67e22";
  return "#c0392b";
};

const Home = ({ programs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Defensive: ensure programs is an array
  const weeks = Array.isArray(programs) ? programs : [];
  const weekData = weeks[selectedWeek] || { "1": [], "2": [], "3": [] };

  // Detect current route
  const weekDayMatch = location.pathname.match(/\/week\/(\d+)\/day\/(\d+)/);
  const currentWeek = weekDayMatch ? parseInt(weekDayMatch[1], 10) : null;
  const currentDay = weekDayMatch ? parseInt(weekDayMatch[2], 10) : null;

  return (
    <div className="program-overview">
      <h2>My Program</h2>

      {/* Week selector */}
      <div className="week-selector">
        {weeks.map((_, i) => (
          <button
            key={i}
            className={`week-btn ${selectedWeek === i ? "active" : ""}`}
            onClick={() => setSelectedWeek(i)}
          >
            Week {i + 1}
          </button>
        ))}
      </div>

      {/* Day cards */}
      <div className="day-list">
        {days.map((day, i) => {
          const dayNumber = i + 1;
          const workouts = weekData[String(dayNumber)] || [];
          const isActive =
            currentWeek === selectedWeek + 1 && currentDay === dayNumber;

          const minutes =
            workouts.length > 0 ? estimateDayTime(workouts) : null;

          return (
            <div
              key={dayNumber}
              className={`day-card ${isActive ? "active" : ""}`}
              onClick={() =>
                navigate(`/week/${selectedWeek + 1}/day/${dayNumber}`)
              }
            >
              <h3>{day}</h3>
              <p className="workout-count">
                {workouts.length} workout{workouts.length !== 1 ? "s" : ""}
              </p>
              {minutes && (
                <p className="workout-time">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={getClockColor(minutes)}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="clock-icon"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  ~{minutes} min
                </p>
              )}
              {isActive && <span className="tag">Current</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
