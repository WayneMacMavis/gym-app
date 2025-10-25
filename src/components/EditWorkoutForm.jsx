// src/components/EditWorkoutForm.jsx

import React, { useEffect, useState } from "react";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import { searchWorkouts } from "../utils/searchWorkouts";
import SetRowInput from "./SetRowInput";
import { useProgram } from "../context/ProgramContext"; // ✅ lock state
import "./EditWorkoutForm.scss";

const EditWorkoutForm = ({
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  workoutId,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const { locked } = useProgram(); // ✅ consume lock state

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

  const [repInputs, setRepInputs] = useState(reps.map(String));
  const [weightInputs, setWeightInputs] = useState(weights.map(String));

  useEffect(() => {
    setEditData((prev) => ({
      ...prev,
      sets,
      reps,
      weights,
    }));
  }, [sets, reps, weights, setEditData]);

  useEffect(() => {
    setRepInputs(reps.map(String));
    setWeightInputs(weights.map(String));
  }, [reps, weights]);

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
    <form
      onSubmit={(e) => {
        if (locked) {
          e.preventDefault();
          console.warn("Program is locked. Cannot save edits.");
          return;
        }
        saveEdit(e, workoutId);
      }}
      className={`edit-form ${locked ? "locked" : ""}`} // ✅ add locked class
    >
      <div className="input-with-suggestions">
        <label>
          Workout name
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Workout name"
            disabled={locked}
          />
        </label>
        {suggestions.length > 0 && !locked && (
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
          disabled={locked}
        />
      </label>

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
            if (locked) return;
            setRepInputs((prev) => {
              const next = [...prev];
              next[idx] = val;
              return next;
            });
            const num = Number(val);
            if (normalize) {
              handleRepChange(idx, Number.isNaN(num) ? 0 : num);
            } else if (!Number.isNaN(num)) {
              handleRepChange(idx, num);
            }
          }}
          onWeightChange={(idx, val, normalize = false) => {
            if (locked) return;
            setWeightInputs((prev) => {
              const next = [...prev];
              next[idx] = val;
              return next;
            });
            const num = Number(val);
            if (normalize) {
              handleWeightChange(idx, Number.isNaN(num) ? 0 : num);
            } else if (!Number.isNaN(num)) {
              handleWeightChange(idx, num);
            }
          }}
          disabled={locked} // ✅ pass lock state down
        />
      ))}

      <div className="edit-actions">
        <button type="submit" className="save-btn" disabled={locked}>
          Save
        </button>
        <button type="button" className="back-btn" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditWorkoutForm;
