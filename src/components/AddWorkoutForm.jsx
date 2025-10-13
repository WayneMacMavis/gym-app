// src/components/AddWorkoutForm.jsx
import React from "react";
import { getRule } from "../rules/progressionRules";

const generateReps = (name, sets) => {
  const { minReps, maxReps } = getRule(name);
  const decrement = 2;
  const reps = [];
  let current = maxReps;
  for (let i = 0; i < sets; i++) {
    reps.push(current.toString());
    current = Math.max(minReps, current - decrement);
  }
  return reps;
};

const AddWorkoutForm = ({ newWorkout, setNewWorkout, handleAddWorkout }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "sets") {
      const num = parseInt(value, 10) || 0;
      setNewWorkout({
        ...newWorkout,
        sets: num,
        reps: generateReps(newWorkout.name, num),
      });
    } else if (name === "name") {
      // let user type freely (spaces etc.)
      setNewWorkout({
        ...newWorkout,
        name: value,
        reps: generateReps(value, newWorkout.sets),
      });
    } else {
      setNewWorkout({ ...newWorkout, [name]: value });
    }
  };

  const handleRepChange = (idx, value) => {
    const updated = [...newWorkout.reps];
    updated[idx] = value;
    setNewWorkout({ ...newWorkout, reps: updated });
  };

  return (
    <form onSubmit={handleAddWorkout} className="add-form">
      <input
        type="text"
        name="name"
        placeholder="Workout name"
        value={newWorkout.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="sets"
        placeholder="Number of sets"
        value={newWorkout.sets}
        onChange={handleChange}
      />
      {newWorkout.reps.map((rep, i) => (
        <input
          key={i}
          type="number"
          placeholder={`Reps for set ${i + 1}`}
          value={rep}
          onChange={(e) => handleRepChange(i, e.target.value)}
        />
      ))}
      <button type="submit" className="save-btn">Save</button>
    </form>
  );
};

export default AddWorkoutForm;
