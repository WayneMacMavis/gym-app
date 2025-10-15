// src/components/AddWorkoutForm.jsx
import React, { useState } from "react";
import { capitalizeWords } from "../utils/format";
import useSetsAndReps from "../hooks/useSetsAndReps";
import "./AddWorkoutForm.scss";

const AddWorkoutForm = ({ onAddWorkout }) => {
  const [name, setName] = useState("");
  const { sets, reps, handleSetChange, handleRepChange } = useSetsAndReps(3, [12, 10, 8]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const workout = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: capitalizeWords(name),
      sets,
      reps,
    };
    onAddWorkout(workout);

    // reset
    setName("");
    handleSetChange(3);
    [12, 10, 8].forEach((val, idx) => handleRepChange(idx, val));
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        placeholder="Workout name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Number of sets"
        value={sets}
        min={1}
        onChange={(e) => handleSetChange(Number(e.target.value))}
      />

      {reps.map((rep, i) => (
        <input
          key={i}
          type="number"
          placeholder={`Reps for set ${i + 1}`}
          value={rep}
          min={1}
          onChange={(e) => handleRepChange(i, Number(e.target.value))}
        />
      ))}

      <button type="submit" className="save-btn">Save</button>
    </form>
  );
};

export default AddWorkoutForm;
