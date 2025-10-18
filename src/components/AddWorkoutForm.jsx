// AddWorkoutForm.jsx
// Form for adding a workout with autocomplete suggestions.
// Suggestions come from searchWorkouts(), which returns objects { name, category }.

import React, { useState } from "react";
import { capitalizeWords } from "../utils/format";
import useSetsAndReps from "../hooks/useSetsAndReps";
import { searchWorkouts } from "../utils/searchWorkouts";
import "./AddWorkoutForm.scss";

const AddWorkoutForm = ({ onAddWorkout }) => {
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
    setSuggestions([]);
    handleSetChange(3);
    [12, 10, 8].forEach((val, idx) => handleRepChange(idx, val));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSuggestions(searchWorkouts(val));
  };

  const handleSuggestionClick = (workoutName) => {
    setName(workoutName);
    setSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="input-with-suggestions">
        <input
          type="text"
          placeholder="Workout name"
          value={name}
          onChange={handleNameChange}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s.name)}>
                <strong>{s.name}</strong>
                <span className="category">{s.category}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

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
