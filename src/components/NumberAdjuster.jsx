// src/components/NumberAdjuster.jsx
import React, { useState } from "react";
import "./NumberAdjuster.scss";

const NumberAdjuster = ({ value, min = 0, max, step = 1, showUnit, onChange }) => {
  const [shakeTarget, setShakeTarget] = useState(null); // "up" or "down"

  const triggerShake = (target) => {
    setShakeTarget(target);
    // Trigger haptic vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(100); // vibrate for 100ms
    }
    setTimeout(() => setShakeTarget(null), 400); // match SCSS animation duration
  };

  const handleIncrement = () => {
    const next = max !== undefined ? Math.min(value + step, max) : value + step;
    if (max !== undefined && value >= max) {
      triggerShake("up");
      return;
    }
    onChange(next);
  };

  const handleDecrement = () => {
    if (value <= min) {
      triggerShake("down");
      return;
    }
    onChange(value - step);
  };

  return (
    <div className="number-adjuster cluster">
      <span className="display-value">{value}</span>
      {showUnit && <span className="unit-label">{showUnit}</span>}
      <div className="arrow-cluster">
        <span
          className={`arrow up ${shakeTarget === "up" ? "shake" : ""}`}
          onClick={handleIncrement}
        >
          ▲
        </span>
        <span
          className={`arrow down ${shakeTarget === "down" ? "shake" : ""}`}
          onClick={handleDecrement}
        >
          ▼
        </span>
      </div>
    </div>
  );
};

export default NumberAdjuster;
