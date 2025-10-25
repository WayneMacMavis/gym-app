// src/components/NumberAdjuster.jsx
// A numeric stepper with up/down arrows. Supports optional suffix (kg, reps, etc).
// Digits + suffix are wrapped in .value-group so they center vertically with arrows.

import React, { useState } from "react";
import { useProgram } from "../context/ProgramContext"; // ✅ bring in lock state
import "./NumberAdjuster.scss";

const NumberAdjuster = ({
  value,
  min = 0,
  onChange,
  suffix,          // unit text shown after the number, before arrows
  size = "md",
  maxDigits = 2,   // controls reserved width for digits
}) => {
  const [shake, setShake] = useState(false);
  const { locked } = useProgram(); // ✅ consume lock state

  const increment = () => {
    if (locked) return; // ✅ block when locked
    onChange(value + 1);
  };

  const decrement = () => {
    if (locked) return; // ✅ block when locked
    if (value > min) {
      onChange(value - 1);
    } else {
      // Trigger shake + vibration
      setShake(true);
      if (navigator.vibrate) navigator.vibrate(100);
      setTimeout(() => setShake(false), 300);
    }
  };

  return (
    <div className={`number-adjuster ${locked ? "locked" : ""}`}>
      <div className="value-group">
        <span
          className="digits"
          style={{ minWidth: `${maxDigits + 0.5}ch` }}
        >
          {value}
        </span>
        {suffix && <span className="unit">{suffix}</span>}
      </div>
      <div className="arrows">
        <button
          type="button"
          className={`arrow up ${size}`}
          onClick={increment}
          aria-label="Increase"
          disabled={locked} // ✅ disable button
        >
          ▲
        </button>
        <button
          type="button"
          className={`arrow down ${size} ${shake ? "shake" : ""}`}
          onClick={decrement}
          aria-label="Decrease"
          disabled={locked} // ✅ disable button
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default NumberAdjuster;
