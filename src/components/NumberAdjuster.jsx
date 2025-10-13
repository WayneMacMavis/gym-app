// src/components/NumberAdjuster.jsx
import React from "react";
import "./NumberAdjuster.scss";

const NumberAdjuster = ({ value, onChange, min = 0, max = 999 }) => {
  const handleIncrease = () => {
    const newVal = Math.min(max, (parseInt(value, 10) || 0) + 1);
    onChange(newVal);
  };

  const handleDecrease = () => {
    const newVal = Math.max(min, (parseInt(value, 10) || 0) - 1);
    onChange(newVal);
  };

  return (
    <div className="number-adjuster">
      <span className="display-value">{value}</span>
      <div className="arrows">
        <span className="arrow up" onClick={handleIncrease}>▲</span>
        <span className="arrow down" onClick={handleDecrease}>▼</span>
      </div>
    </div>
  );
};

export default NumberAdjuster;
