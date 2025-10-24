// src/components/AddWorkoutForm.jsx
// Form for adding a workout with autocomplete suggestions.
// Suggestions come from searchWorkouts(), which returns objects { name, category }.

import React, { useState, useEffect } from "react";
import { capitalizeWords } from "../utils/format";
import { searchWorkouts } from "../utils/searchWorkouts";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import SetRowInput from "./SetRowInput";
import { formatWorkout } from "../utils/workouts";
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
  const [submitted, setSubmitted] = useState(false); // ✅ new flag

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

    if (submitted) {
      console.warn("Duplicate submission blocked");
      return;
    }

    setSubmitted(true); // ✅ block further submits

    const rawWorkout = {
      name: capitalizeWords(name),
      sets,
      reps,
      weights,
    };

    const formatted = formatWorkout(rawWorkout);
    onAddWorkout(formatted);

    // ✅ Reset form state
    setName("");
    setSuggestions([]);
    handleSetChange(3);

    // Optional: reset flag after short delay
    setTimeout(() => setSubmitted(false), 1000);
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
        <SetRowInput
          key={i}
          index={i}
          repValue={repInputs[i]}
          weightValue={weightInputs[i]}
          onRepChange={(idx, val, normalize = false) => {
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
        />
      ))}

      <div className="form-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="back-btn">Back</button>
      </div>
    </form>
  );
};

export default AddWorkoutForm;
