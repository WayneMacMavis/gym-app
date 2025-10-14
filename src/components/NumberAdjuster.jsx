import React, { useState } from "react";
import "./NumberAdjuster.scss";

const NumberAdjuster = ({ value, onChange, min = 0, max = 999, showUnit }) => {
  const [shake, setShake] = useState(null);

  const triggerShake = (dir) => {
    setShake(dir);
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => setShake(null), 400);
  };

  const inc = () => {
    const newVal = (parseInt(value, 10) || 0) + 1;
    if (newVal > max) {
      triggerShake("up");
    } else {
      onChange(newVal);
    }
  };

  const dec = () => {
    const newVal = (parseInt(value, 10) || 0) - 1;
    if (newVal < min) {
      triggerShake("down");
    } else {
      onChange(newVal);
    }
  };

  return (
    <div className="number-adjuster cluster">
      <span className="display-value">{value}</span>
      {showUnit && <span className="unit-label"> {showUnit}</span>}
      <div className="arrow-cluster" role="group" aria-label="Adjust number">
        <span
          className={`arrow up ${shake === "up" ? "shake" : ""}`}
          onClick={inc}
          aria-label="Increase"
        >
          ▲
        </span>
        <span
          className={`arrow down ${shake === "down" ? "shake" : ""}`}
          onClick={dec}
          aria-label="Decrease"
        >
          ▼
        </span>
      </div>
    </div>
  );
};

export default NumberAdjuster;
