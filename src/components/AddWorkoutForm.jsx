// src/components/AddWorkoutForm.jsx
// Form for adding a workout with autocomplete suggestions.
// Suggestions come from searchWorkouts(), which returns objects { name, category }.

import React, { useState, useEffect } from "react";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import { capitalizeWords } from "../utils/format";
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

  // Local string buffers for smooth typing
  const [repInputs, setRepInputs] = useState(reps.map(String));
  const [weightInputs, setWeightInputs] = useState(weights.map(String));
  const [name, setName] = useState("");

  // Keep buffers in sync when sets change or hook adjusts arrays
  useEffect(() => {
    setRepInputs((prev) => {
      const next = [...reps.map(String)];
      // preserve user-in-progress edits if lengths match
      return next.length === prev.length ? prev : next;
    });
    setWeightInputs((prev) => {
      const next = [...weights.map(String)];
      return next.length === prev.length ? prev : next;
    });
  }, [sets, reps, weights]);

  const onSubmit = (e) => {
    e.preventDefault();
    onAddWorkout({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: capitalizeWords(name),
      sets,
      reps,
      weights,
    });
    setName("");
    handleSetChange(3);
  };

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <label>
        Workout name
        <input
          type="text"
          placeholder="Workout name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Number of sets
        <input
          type="number"
          min={1}
          value={sets}
          onChange={(e) => handleSetChange(Number(e.target.value))}
        />
      </label>

      <div className="set-header">
        <span>Reps</span>
        <span>Weight</span>
      </div>

      {Array.from({ length: sets }).map((_, i) => (
        <div key={i} className="set-row">
          {/* Reps input: string while typing, numeric in hook */}
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
              // only push numeric when valid; otherwise let user type freely
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

          {/* Weight input: same approach */}
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

      <button type="submit" className="save-btn">Save</button>
    </form>
  );
};

export default AddWorkoutForm;
