import React, { useEffect, useState } from "react";
import useSetsRepsWeights from "../hooks/useSetsRepsWeights";
import { searchWorkouts } from "../utils/searchWorkouts";
import SetRowInput from "./SetRowInput";
import { useProgram } from "../context/ProgramContext";
import "./EditWorkoutForm.scss";

const EditWorkoutForm = ({
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  workoutId,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const { locked } = useProgram();

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

  // ✅ helpers
  const normalizeDecimal = (val) => {
    if (typeof val !== "string") return val;
    return val.replace(",", "."); // treat comma as dot
  };
  const roundToHalf = (val) => Math.round(val * 2) / 2;

  // ✅ new submit handler that normalizes all inputs before saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked) return;

    // normalize reps
    repInputs.forEach((val, idx) => {
      const num = Number(val);
      const clean = Number.isNaN(num) ? 0 : Math.max(0, Math.round(num));
      handleRepChange(idx, clean);
      setRepInputs((prev) => {
        const next = [...prev];
        next[idx] = String(clean);
        return next;
      });
    });

    // normalize weights
    weightInputs.forEach((val, idx) => {
      const cleaned = normalizeDecimal(val);
      const num = Number(cleaned);
      const snapped = Number.isNaN(num) ? 0 : Math.max(0, roundToHalf(num));
      handleWeightChange(idx, snapped);
      setWeightInputs((prev) => {
        const next = [...prev];
        next[idx] = String(snapped);
        return next;
      });
    });

    saveEdit(e, workoutId);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`edit-form ${locked ? "locked" : ""}`}
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

      <div className="edit-actions">
        <button type="submit" className="save-btn" disabled={locked}>
          Save
        </button>
        <button type="button" className="cancel-btn" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditWorkoutForm;
