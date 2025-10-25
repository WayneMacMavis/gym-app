// src/components/NumberAdjuster.jsx
// A numeric stepper with up/down arrows. Supports optional suffix (kg, reps, etc).
// Digits + suffix are wrapped in .value-group so they center vertically with arrows.

import React, { useState } from "react";
import { useProgram } from "../context/ProgramContext";
import "./NumberAdjuster.scss";

const NumberAdjuster = ({
  value,
  min = 0,
  onChange,
  suffix,
  size = "md",
  maxDigits = 2,   // controls reserved width for digits
  step = 1,        // ✅ default step (can override per use)
}) => {
  const [shake, setShake] = useState(false);
  const { locked } = useProgram();

  const increment = () => {
    if (locked) return;
    onChange(parseFloat((value + step).toFixed(2)));
  };

  const decrement = () => {
    if (locked) return;
    if (value > min) {
      onChange(parseFloat((value - step).toFixed(2)));
    } else {
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
          style={{ minWidth: `${maxDigits + 0.5}ch` }} // ✅ reserve width
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
          disabled={locked}
        >
          ▲
        </button>
        <button
          type="button"
          className={`arrow down ${size} ${shake ? "shake" : ""}`}
          onClick={decrement}
          aria-label="Decrease"
          disabled={locked}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default NumberAdjuster;
