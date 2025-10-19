// SetRow.jsx
// A single set row: index | weight adjuster | reps adjuster
// Shows set index number in column 1.

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
  const handleChange = (field, value) => {
    const updated = {
      ...workout,
      [field]: workout[field].map((v, i) => (i === index ? value : v)),
    };
    if (hasWeeks) {
      updateWorkout(dayIdParam, updated, weekIdParam);
    } else {
      updateWorkout(dayIdParam, updated);
    }
  };

  return (
    <div className="set-row">
      {/* Column 1: Set number */}
      <div className="row-number">{index + 1}</div>

      {/* Column 2: Weight adjuster */}
      <div className="weight-info">
        <NumberAdjuster
          value={Number(weight) || 0}
          min={0}
          onChange={(val) => handleChange("weights", val)}
          suffix="kg"
        />
      </div>

      {/* Column 3: Reps adjuster */}
      <div className="set-info">
        <NumberAdjuster
          value={Number(rep) || 0}
          min={0}
          onChange={(val) => handleChange("reps", val)}
          suffix="reps"
        />
      </div>
    </div>
  );
};

export default SetRow;
