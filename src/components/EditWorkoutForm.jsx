// src/components/EditWorkoutForm.jsx
// Form for editing an existing workout with autocomplete suggestions.
// Mirrors AddWorkoutForm for consistency.

import React, { useEffect, useState } from "react";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
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

  // Hook manages sets/reps/weights
  const {
    sets,
    reps,
    weights,
    handleSetChange,
    handleRepChange,
    handleWeightChange,
  } = useSetsRepsWeights(
    editData.sets || 3,
    editData.reps && editData.reps.length ? editData.reps : [12, 10, 8],
    editData.weights && editData.weights.length ? editData.weights : [0, 0, 0],
    editData.name
  );

  // Local string buffers for smooth typing
  const [repInputs, setRepInputs] = useState(reps.map(String));
  const [weightInputs, setWeightInputs] = useState(weights.map(String));

  // Keep parent editData in sync with hook state
  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      sets,
      reps,
      weights,
    }));
  }, [sets, reps, weights, setEditData]);

  // Keep buffers in sync when sets or arrays change
  useEffect(() => {
    setRepInputs(reps.map(String));
    setWeightInputs(weights.map(String));
  }, [reps, weights]);

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
        <label>
          Workout name
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Workout name"
          />
        </label>
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

      <label>
        Number of sets
        <input
          type="number"
          value={sets}
          min={1}
          onChange={(e) => handleSetChange(Number(e.target.value))}
        />
      </label>

      {/* ✅ Header row for reps/weights */}
      <div className="set-header">
        <span>Reps</span>
        <span>Weight</span>
      </div>

      {Array.from({ length: sets }).map((_, i) => (
        <div key={i} className="set-row">
          <input
            type="text"
            inputMode="numeric"
            placeholder={`Set ${i + 1}`}
            value={repInputs[i] ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setRepInputs((prev) => {
                const next = [...prev];
                next[i] = val;
                return next;
              });
              const num = Number(val);
              if (!Number.isNaN(num)) handleRepChange(i, num);
            }}
            onBlur={(e) => {
              const num = Number(e.target.value);
              handleRepChange(i, Number.isNaN(num) ? 0 : num);
              setRepInputs((prev) => {
                const next = [...prev];
                next[i] = Number.isNaN(num) ? "" : String(num);
                return next;
              });
            }}
          />

          <input
            type="text"
            inputMode="decimal"
            placeholder="kg"
            value={weightInputs[i] ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setWeightInputs((prev) => {
                const next = [...prev];
                next[i] = val;
                return next;
              });
              const num = Number(val);
              if (!Number.isNaN(num)) handleWeightChange(i, num);
            }}
            onBlur={(e) => {
              const num = Number(e.target.value);
              handleWeightChange(i, Number.isNaN(num) ? 0 : num);
              setWeightInputs((prev) => {
                const next = [...prev];
                next[i] = Number.isNaN(num) ? "" : String(num);
                return next;
              });
            }}
          />
        </div>
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
