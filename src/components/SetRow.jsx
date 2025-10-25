// src/components/SetRow.jsx
// Renders a single row for reps + weight with NumberAdjusters, aligned to SCSS grid.

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
}) => {
  const handleRepChange = (newRep) => {
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
    <div className="set-row">
      <div className="row-number">{index + 1}</div>

      <div className="set-info">
        <NumberAdjuster
          value={rep}
          min={1}
          step={1}
          suffix="reps"
          maxDigits={3}
          size="md"
          onChange={handleRepChange}
        />
      </div>

      <div className="weight-info">
        <NumberAdjuster
          value={weight}
          min={0}
          step={2.5}
          suffix="kg"
          maxDigits={5}
          size="md"
          onChange={handleWeightChange}
        />
      </div>
    </div>
  );
};

export default SetRow;
