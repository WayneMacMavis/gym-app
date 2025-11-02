import React from "react";
import NumberAdjuster from "./NumberAdjuster";
import "./SetRow.scss";

const SetRow = ({
  index,
  rep,
  weight,
  workout,
  updateWorkout,
  hasWeeks,
  dayIdParam,
  weekIdParam,
  disabled = false,
  completed = false,
}) => {
  const handleRepChange = (newRep) => {
    if (disabled) return;
    const updated = {
      ...workout,
      reps: workout.reps.map((r, i) => (i === index ? newRep : r)),
    };
    if (hasWeeks) {
      updateWorkout(dayIdParam, updated, weekIdParam);
    } else {
      updateWorkout(dayIdParam, updated);
    }
  };

  const handleWeightChange = (newWeight) => {
    if (disabled) return;
    const updated = {
      ...workout,
      weights: workout.weights.map((w, i) => (i === index ? newWeight : w)),
    };
    if (hasWeeks) {
      updateWorkout(dayIdParam, updated, weekIdParam);
    } else {
      updateWorkout(dayIdParam, updated);
    }
  };

  return (
    <div className={`set-row ${completed ? "completed" : ""}`}>
      <div className="row-number">{index + 1}</div>

      {/* ✅ Reps column (left, under Sets) */}
      <div className="set-info">
        <NumberAdjuster
          value={rep}
          min={1}
          step={1}
          suffix="reps"
          maxDigits={3}
          size="md"
          onChange={handleRepChange}
          disabled={disabled}
        />
      </div>

      {/* ✅ Weight column (right, under Weights) */}
      <div className="weight-info">
        <NumberAdjuster
          value={weight}
          min={0}
          step={0.5}
          suffix="kg"
          maxDigits={5}
          size="md"
          onChange={handleWeightChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SetRow;
