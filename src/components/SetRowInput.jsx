// src/components/SetRowInput.jsx

import React from "react";
import "./SetRowInput.scss";

const SetRowInput = ({
  index,
  repValue,
  weightValue,
  onRepChange,
  onWeightChange,
  disabled = false, // ✅ new prop
}) => {
  return (
    <div className={`set-row ${disabled ? "locked" : ""}`}>
      <div className="unit-input">
        <input
          type="number"
          value={repValue}
          min={0}
          disabled={disabled} // ✅ disable when locked
          onChange={(e) => onRepChange(index, e.target.value)}
          onBlur={(e) => onRepChange(index, e.target.value, true)}
        />
        <span className="unit">reps</span>
      </div>
      <div className="unit-input">
        <input
          type="number"
          value={weightValue}
          min={0}
          disabled={disabled} // ✅ disable when locked
          onChange={(e) => onWeightChange(index, e.target.value)}
          onBlur={(e) => onWeightChange(index, e.target.value, true)}
        />
        <span className="unit">kg</span>
      </div>
    </div>
  );
};

export default SetRowInput;
