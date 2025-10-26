import React, { useState, useEffect } from "react";
import { capitalizeWords } from "../utils/format";
import { searchWorkouts } from "../utils/searchWorkouts";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import SetRowInput from "./SetRowInput";
import { formatWorkout } from "../utils/workouts";
import { useProgram } from "../context/ProgramContext";
import "./AddWorkoutForm.scss";

const AddWorkoutForm = ({ onAddWorkout, onCancel }) => {
  const {
    sets,
    reps,
    weights,
    handleSetChange,
    handleRepChange,
    handleWeightChange,
  } = useSetsRepsWeights(3, [12, 10, 8], [0, 0, 0], "");

  const { locked } = useProgram();

  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [repInputs, setRepInputs] = useState(reps.map(String));
  const [weightInputs, setWeightInputs] = useState(weights.map(String));
  const [submitted, setSubmitted] = useState(false);

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
      } catch {
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

  // ✅ normalize helpers
  const normalizeDecimal = (val) => {
    if (typeof val !== "string") return val;
    return val.replace(",", "."); // treat comma as dot
  };
  const roundToHalf = (val) => Math.round(val * 2) / 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked || submitted) return;

    setSubmitted(true);

    const rawWorkout = {
      name: capitalizeWords(name),
      sets,
      reps,
      weights,
    };

    const formatted = formatWorkout(rawWorkout);
    onAddWorkout(formatted);

    setName("");
    setSuggestions([]);
    handleSetChange(3);

    setTimeout(() => setSubmitted(false), 1000);
  };

  return (
    <form onSubmit={handleSubmit} className={`add-form ${locked ? "locked" : ""}`}>
      <div className="input-with-suggestions">
        <label>
          Workout name
          <input
            type="text"
            placeholder="Workout name"
            value={name}
            onChange={handleNameChange}
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
            if (normalize) {
              const num = Number(val);
              const clean = Number.isNaN(num) ? 0 : Math.max(0, Math.round(num));
              handleRepChange(idx, clean);
              setRepInputs((prev) => {
                const next = [...prev];
                next[idx] = String(clean);
                return next;
              });
            }
          }}
          onWeightChange={(idx, val, normalize = false) => {
            if (locked) return;
            setWeightInputs((prev) => {
              const next = [...prev];
              next[idx] = val;
              return next;
            });
            if (normalize) {
              const cleaned = normalizeDecimal(val);
              const num = Number(cleaned);
              const snapped = Number.isNaN(num) ? 0 : Math.max(0, roundToHalf(num));
              handleWeightChange(idx, snapped);
              setWeightInputs((prev) => {
                const next = [...prev];
                next[idx] = String(snapped);
                return next;
              });
            }
          }}
          disabled={locked}
        />
      ))}

      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={locked}>
          Save
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddWorkoutForm;
