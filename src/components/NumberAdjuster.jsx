// src/components/NumberAdjuster.jsx
import React, { useState } from "react";
import "./NumberAdjuster.scss";

const NumberAdjuster = ({ value, min = 0, onChange, showUnit, size = "md" }) => {
  const [shake, setShake] = useState(false);

  const increment = () => onChange(value + 1);
  const decrement = () => {
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
    <div className="number-adjuster">
      <span className="value">
        {value}
        {showUnit && <span className="unit"> {showUnit}</span>}
      </span>
      <div className="arrows">
        <button
          type="button"
          className={`arrow up ${size}`}
          onClick={increment}
          aria-label="Increase"
        >
          ▲
        </button>
        <button
          type="button"
          className={`arrow down ${size} ${shake ? "shake" : ""}`}
          onClick={decrement}
          aria-label="Decrease"
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default NumberAdjuster;
