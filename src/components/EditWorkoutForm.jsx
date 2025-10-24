// src/components/EditWorkoutForm.jsx
// Form for editing an existing workout with autocomplete suggestions.
// Mirrors AddWorkoutForm for consistency, including string-buffer inputs for smooth typing.

import React, { useEffect, useState } from "react";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import { searchWorkouts } from "../utils/searchWorkouts";
import SetRowInput from "./SetRowInput";
import "./EditWorkoutForm.scss";

const EditWorkoutForm = ({
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  workoutId,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  // Hook manages sets/reps/weights with progression adjustments
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

  // Local string buffers for smooth typing (prevent cursor jump)
  const [repInputs, setRepInputs] = useState(reps.map(String));
  const [weightInputs, setWeightInputs] = useState(weights.map(String));

  // Keep parent editData in sync with hook state (numeric arrays)
  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      sets,
      reps,
      weights,
    }));
  }, [sets, reps, weights, setEditData]);

  // Keep buffers in sync when hook arrays change
  useEffect(() => {
    setRepInputs(reps.map(String));
    setWeightInputs(weights.map(String));
  }, [reps, weights]);

  // Async search for suggestions (consistent with Add form)
  const handleNameChange = async (value) => {
    setEditData((prev) => ({
      ...prev,
      name: value,
    }));

    if (value.trim().length > 0) {
      try {
        const results = await searchWorkouts(value);
        setSuggestions(results);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
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

      {/* Header row for reps/weights */}
      <div className="set-header">
        <span>Reps</span>
        <span>Weight</span>
      </div>

      {Array.from({ length: sets }).map((_, i) => (
        <SetRowInput
          key={i}
          index={i}
          repValue={repInputs[i]}
          weightValue={weightInputs[i]}
          onRepChange={(idx, val, normalize = false) => {
            // Update local buffer
            setRepInputs((prev) => {
              const next = [...prev];
              next[idx] = val;
              return next;
            });
            // Sync numeric to hook
            const num = Number(val);
            if (normalize) {
              handleRepChange(idx, Number.isNaN(num) ? 0 : num);
            } else if (!Number.isNaN(num)) {
              handleRepChange(idx, num);
            }
          }}
          onWeightChange={(idx, val, normalize = false) => {
            // Update local buffer
            setWeightInputs((prev) => {
              const next = [...prev];
              next[idx] = val;
              return next;
            });
            // Sync numeric to hook
            const num = Number(val);
            if (normalize) {
              handleWeightChange(idx, Number.isNaN(num) ? 0 : num);
            } else if (!Number.isNaN(num)) {
              handleWeightChange(idx, num);
            }
          }}
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
