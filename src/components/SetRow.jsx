// SetRow.jsx
// Represents a single row in a workout (set number, weight, reps).
// Uses NumberAdjuster for inline editing of weights and reps.

import React from "react";
import NumberAdjuster from "./NumberAdjuster";
import "./SetRow.scss"; 

const SetRow = ({ index, rep, weight, workout, updateWorkout, hasWeeks, dayIdParam, weekIdParam }) => {
  const repsArr = workout.reps || [];
  const weightsArr = workout.weights || [];

  return (
    <li className="set-row">
      <span className="row-number">{index + 1}</span>

      <div className="weight-info">
        <NumberAdjuster
          value={Number(weight ?? 0)}
          min={0}
          showUnit="kg"
          onChange={(val) => {
            const updatedWeights = [...weightsArr];
            updatedWeights[index] = Number(val);
            const updated = { ...workout, weights: updatedWeights };
            if (hasWeeks) {
              updateWorkout(dayIdParam, updated, weekIdParam);
            } else {
              updateWorkout(dayIdParam, updated);
            }
          }}
        />
      </div>

      <div className="set-info">
        <NumberAdjuster
          value={Number(rep)}
          min={1}
          showUnit="reps"
          onChange={(val) => {
            const updatedReps = [...repsArr];
            updatedReps[index] = Number(val);
            const updated = { ...workout, reps: updatedReps };
            if (hasWeeks) {
              updateWorkout(dayIdParam, updated, weekIdParam);
            } else {
              updateWorkout(dayIdParam, updated);
            }
          }}
        />
      </div>
    </li>
  );
};

export default SetRow;
