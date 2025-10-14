import React, { useState } from "react";
import NumberAdjuster from "./NumberAdjuster";
import useSetsAndReps from "../hooks/useSetsAndReps";

const AddWorkoutForm = ({ onAddWorkout }) => {
  const [name, setName] = useState("");
  const { sets, reps, handleSetChange, handleRepChange } = useSetsAndReps(3, [12, 10, 8], name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWorkout({ name, sets, reps });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workout name"
      />

      <div className="sets-inline">
        <label>Sets:</label>
        <NumberAdjuster value={sets} min={1} onChange={handleSetChange} />
      </div>

      {reps.map((rep, i) => (
        <div key={i} className="rep-input">
          <label>Set {i + 1}:</label>
          <NumberAdjuster
            value={rep}
            min={1}
            showUnit="reps"
            onChange={(val) => handleRepChange(i, val)}
          />
        </div>
      ))}

      <button type="submit" className="save-btn">Add</button>
    </form>
  );
};

export default AddWorkoutForm;
