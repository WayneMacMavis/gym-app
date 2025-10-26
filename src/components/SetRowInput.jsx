import React from "react";
import "./SetRowInput.scss";

const SetRowInput = ({
  index,
  repValue,
  weightValue,
  onRepChange,
  onWeightChange,
  disabled = false,
}) => {
  return (
    <div className={`set-row ${disabled ? "locked" : ""}`}>
      <div className="unit-input">
        <input
          type="text"
          inputMode="numeric"
          value={repValue}
          disabled={disabled}
          onChange={(e) => onRepChange(index, e.target.value)}
          onBlur={(e) => onRepChange(index, e.target.value, true)}
          aria-label="Reps"
        />
        <span className="unit">reps</span>
      </div>
      <div className="unit-input">
        <input
          type="text"
          inputMode="decimal"   // ✅ allows typing "2.5" or "2,5"
          value={weightValue}
          disabled={disabled}
          onChange={(e) => onWeightChange(index, e.target.value)}
          onBlur={(e) => onWeightChange(index, e.target.value, true)}
          aria-label="Weight (kg)"
        />
        <span className="unit">kg</span>
      </div>
    </div>
  );
};

export default SetRowInput;
