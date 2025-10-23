// src/components/AddWorkoutForm.jsx
// Form for adding a workout with autocomplete suggestions.
// Suggestions come from searchWorkouts(), which returns objects { name, category }.

import React, { useState, useEffect } from "react";
import { capitalizeWords } from "../utils/format";
import { searchWorkouts } from "../utils/searchWorkouts";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import "./AddWorkoutForm.scss";

const AddWorkoutForm = ({ onAddWorkout }) => {
  const {
    sets,
    reps,
    weights,
    handleSetChange,
    handleRepChange,
    handleWeightChange,
  } = useSetsRepsWeights(3, [12, 10, 8], [0, 0, 0], "");

  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [repInputs, setRepInputs] = useState(reps.map(String));
  const [weightInputs, setWeightInputs] = useState(weights.map(String));

  // Keep buffers in sync when sets or arrays change
  useEffect(() => {
    setRepInputs(reps.map(String));
    setWeightInputs(weights.map(String));
  }, [reps, weights]);

  const handleNameChange = async (e) => {
    const val = e.target.value;
    setName(val);

    if (val.trim().length > 0) {
      try {
        const results = await searchWorkouts(val);
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
    setName(workoutName);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWorkout({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: capitalizeWords(name),
      sets,
      reps,
      weights,
    });
    setName("");
    setSuggestions([]);
    handleSetChange(3);
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <div className="input-with-suggestions">
        <label>
          Workout name
          <input
            type="text"
            placeholder="Workout name"
            value={name}
            onChange={handleNameChange}
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

      <div className="form-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="back-btn">Back</button>
      </div>
    </form>
  );
};

export default AddWorkoutForm;
