import React, { useState } from "react";
import { useProgramCycle } from "../hooks/useProgramCycle";
import "./RoutinePlanner.scss";

const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const RoutinePlanner = ({ workouts }) => {
  const { startDate, needsRefresh, resetCycle } = useProgramCycle();

  // 🔑 Keep your routine state here
  const [routine, setRoutine] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  const addToDay = (day, workout) => {
    setRoutine({
      ...routine,
      [day]: [...routine[day], workout],
    });
  };

  const removeFromDay = (day, index) => {
    const updated = [...routine[day]];
    updated.splice(index, 1);
    setRoutine({ ...routine, [day]: updated });
  };

  return (
    <div className="routine-planner">
      <h2>Weekly Routine Planner</h2>

      {needsRefresh && (
        <div className="refresh-banner">
          <p>🚀 It’s been 8 weeks! Time to refresh your program.</p>
          <button onClick={resetCycle}>Start New Cycle</button>
        </div>
      )}

      <p className="cycle-info">
        Current cycle started: {startDate.toDateString()}
      </p>

      <div className="planner-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-column">
            <h3>{day}</h3>
            <ul>
              {routine[day].map((w, i) => (
                <li key={i} className="routine-item">
                  {w.name} <em>({w.muscle})</em>
                  <button onClick={() => removeFromDay(day, i)}>✕</button>
                </li>
              ))}
            </ul>

            <select
  onChange={(e) => {
    const workout = workouts.find((w) => w.id === e.target.value); // ✅ string compare
    if (workout) addToDay(day, workout);
    e.target.value = "";
  }}
  defaultValue=""
>
  <option value="" disabled>
    Add workout…
  </option>
  {workouts.map((w) => (
    <option key={w.id} value={w.id}>
      {w.name} ({w.muscle})
    </option>
  ))}
</select>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutinePlanner;