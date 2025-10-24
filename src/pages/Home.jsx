import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProgram } from "../context/ProgramContext";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { programs, numWeeks, numDays, updateStructure } = useProgram();

  const [selectedWeek, setSelectedWeek] = useState(0);
  const [weeksInput, setWeeksInput] = useState(String(numWeeks));
  const [daysInput, setDaysInput] = useState(String(numDays));

  // ✅ initialize lock state from localStorage
  const [locked, setLocked] = useState(() => {
    const saved = localStorage.getItem("programLocked");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    setWeeksInput(String(numWeeks));
    setDaysInput(String(numDays));
  }, [numWeeks, numDays]);

  // ✅ persist lock state whenever it changes
  useEffect(() => {
    localStorage.setItem("programLocked", JSON.stringify(locked));
  }, [locked]);

  const handleWeeksChange = (e) => {
    if (locked) return;
    const val = e.target.value.replace(/^0+/, "");
    setWeeksInput(val);

    const parsed = Number(val);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed !== numWeeks) {
      updateStructure(parsed, numDays);
      setSelectedWeek(0);
      navigate("/");
    }
  };

  const handleDaysChange = (e) => {
    if (locked) return;
    const val = e.target.value.replace(/^0+/, "");
    setDaysInput(val);

    const parsed = Number(val);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed !== numDays) {
      updateStructure(numWeeks, parsed);
      setSelectedWeek(0);
      navigate("/");
    }
  };

  const weekDayMatch = location.pathname.match(/\/week\/(\d+)\/day\/(\d+)/);
  const currentWeek = weekDayMatch ? parseInt(weekDayMatch[1], 10) : null;
  const currentDay = weekDayMatch ? parseInt(weekDayMatch[2], 10) : null;

  const weekData = programs[selectedWeek] || [];

  return (
    <div className="program-overview">
      <h2>My Program</h2>

      <div className="program-setup">
        <label>
          Weeks:
          <input
            type="number"
            min="1"
            value={weeksInput}
            disabled={locked}
            onFocus={(e) => e.target.select()}
            onChange={handleWeeksChange}
          />
        </label>
        <label>
          Days per week:
          <input
            type="number"
            min="1"
            value={daysInput}
            disabled={locked}
            onFocus={(e) => e.target.select()}
            onChange={handleDaysChange}
          />
        </label>
        <button
          className={`lock-toggle ${locked ? "locked" : ""}`}
          onClick={() => setLocked(!locked)}
        >
          {locked ? "🔒 Locked" : "🔓 Unlocked"}
        </button>
      </div>

      <div className="week-selector">
        {programs.map((_, i) => (
          <button
            key={i}
            className={`week-btn ${selectedWeek === i ? "active" : ""}`}
            onClick={() => setSelectedWeek(i)}
          >
            Week {i + 1}
          </button>
        ))}
      </div>

      <div className="day-list">
        {Object.keys(weekData)
          .map((dayKey) => parseInt(dayKey, 10))
          .sort((a, b) => a - b)
          .map((dayNumber) => {
            const workouts = weekData[String(dayNumber)] || [];
            const isActive =
              currentWeek === selectedWeek + 1 && currentDay === dayNumber;

            return (
              <div
                key={dayNumber}
                className={`day-card ${isActive ? "active" : ""}`}
                onClick={() =>
                  navigate(`/week/${selectedWeek + 1}/day/${dayNumber}`)
                }
              >
                <h3>Day {dayNumber}</h3>
                <p className="workout-count">
                  {workouts.length > 0
                    ? `${workouts.length} workout${
                        workouts.length !== 1 ? "s" : ""
                      }`
                    : "No workouts yet"}
                </p>
                {isActive && <span className="tag">Current</span>}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
