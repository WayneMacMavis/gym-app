// src/components/EditWorkoutForm.jsx
// Form for editing an existing workout with autocomplete suggestions.
// Mirrors AddWorkoutForm for consistency.

import React, { useEffect, useState } from "react";
import useSetsAndReps from "../hooks/useSetsAndReps";
import { searchWorkouts } from "../utils/searchWorkouts";
import "./EditWorkoutForm.scss";

const EditWorkoutForm = ({
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  workoutId,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  // Hook manages sets/reps based on current editData
  const { sets, reps, handleSetChange, handleRepChange } = useSetsAndReps(
    editData.sets || 3,
    editData.reps && editData.reps.length ? editData.reps : [12, 10, 8],
    editData.name
  );

  // Keep parent editData in sync with hook state
  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      sets,
      reps,
    }));
  }, [sets, reps, setEditData]);

  const handleNameChange = (value) => {
    setEditData((prev) => ({
      ...prev,
      name: value,
    }));
    setSuggestions(searchWorkouts(value));
  };

  const handleSuggestionClick = (workoutName) => {
    setEditData((prev) => ({
      ...prev,
      name: workoutName,
    }));
    setSuggestions([]);
  };

  return (
    <form onSubmit={(e) => saveEdit(e, workoutId)} className="edit-form">
      <div className="input-with-suggestions">
        <input
          type="text"
          value={editData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Workout name"
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
        value={sets}
        min={1}
        onChange={(e) => handleSetChange(Number(e.target.value))}
        placeholder="Number of sets"
      />

      {reps.map((rep, i) => (
        <input
          key={i}
          type="number"
          value={rep}
          min={1}
          onChange={(e) => handleRepChange(i, Number(e.target.value))}
          placeholder={`Reps for set ${i + 1}`}
        />
      ))}

      <div className="edit-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="back-btn" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditWorkoutForm;
