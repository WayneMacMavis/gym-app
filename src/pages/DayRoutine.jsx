// src/components/DayRoutine.jsx
import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DayRoutine.scss";
import { capitalizeWords } from "../utils/format";
import AddWorkoutForm from "../components/AddWorkoutForm";
import EditWorkoutForm from "../components/EditWorkoutForm";
import { useHoldToDelete } from "../hooks/useHoldToDelete";
import { useDayEstimates } from "../hooks/useDayEstimates";
import NumberAdjuster from "../components/NumberAdjuster";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const DayRoutine = ({ program, programs, addWorkout, deleteWorkout, updateWorkout }) => {
  const params = useParams();
  const navigate = useNavigate();

  const weekIdParam = params.weekId ? parseInt(params.weekId, 10) - 1 : null;
  const dayIdParam = params.dayId ? String(parseInt(params.dayId, 10)) : null;

  const hasWeeks = Array.isArray(programs) && programs.length > 0;
  const workouts = hasWeeks
    ? (programs[weekIdParam]?.[dayIdParam] || [])
    : (program?.[dayIdParam] || []);

  const [newWorkout, setNewWorkout] = useState({ name: "", sets: 3, reps: ["", "", ""] });
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", sets: 0, reps: [] });

  const addingRef = useRef(false);

  // Hook for hold-to-delete (2s)
  const { holdingId, progress, handleHoldStart, handleHoldEnd } = useHoldToDelete(
    (id) => {
      if (hasWeeks) {
        deleteWorkout(dayIdParam, id, weekIdParam);
      } else {
        deleteWorkout(dayIdParam, id);
      }
    },
    2000
  );

  // Time estimation helpers
  const { estimateWorkoutSeconds, estimateDayMinutes, getColor } = useDayEstimates();

  const totalMinutes = workouts.length ? estimateDayMinutes(workouts) : null;

  // Generate default descending reps
  const generateReps = (name, sets) => {
    const { minReps, maxReps } = { minReps: 6, maxReps: 12 }; // fallback if no rule
    let current = maxReps;
    const reps = [];
    for (let i = 0; i < sets; i++) {
      reps.push(current.toString());
      current = Math.max(minReps, current - 2);
    }
    return reps;
  };

  // Fill blanks with generated reps
  const normalizeReps = (name, reps, sets) => {
    const generated = generateReps(name, sets);
    return Array.from({ length: sets }, (_, i) => {
      const v = reps?.[i];
      return String(v ?? "").trim() ? String(v) : generated[i];
    });
  };

  // Add workout
  const handleAddWorkout = (e) => {
    e.preventDefault();
    if (addingRef.current) return;
    addingRef.current = true;

    const formattedName = capitalizeWords(newWorkout.name);
    const normalizedReps = normalizeReps(formattedName, newWorkout.reps, newWorkout.sets);

    const workout = { ...newWorkout, name: formattedName, reps: normalizedReps, id: uid() };

    if (hasWeeks) {
      addWorkout(dayIdParam, workout, weekIdParam);
    } else {
      addWorkout(dayIdParam, workout);
    }

    setNewWorkout({ name: "", sets: 3, reps: ["", "", ""] });
    setShowForm(false);

    setTimeout(() => {
      addingRef.current = false;
    }, 0);
  };

  // Edit handlers
  const startEditing = (w) => {
    setEditingId(w.id);
    setEditData({ name: w.name, sets: w.sets || 0, reps: [...(w.reps || [])] });
  };

  const saveEdit = (e, id) => {
    e.preventDefault();
    if (typeof updateWorkout !== "function") {
      setEditingId(null);
      return;
    }
    const formattedName = capitalizeWords(editData.name);
    const normalizedReps = normalizeReps(formattedName, editData.reps, editData.sets);
    const updatedWorkout = { ...editData, name: formattedName, reps: normalizedReps, id };

    if (hasWeeks) {
      updateWorkout(dayIdParam, updatedWorkout, weekIdParam);
    } else {
      updateWorkout(dayIdParam, updatedWorkout);
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="day-routine">
      <h2>
        {hasWeeks
          ? `Week ${weekIdParam + 1}, Day ${dayIdParam}`
          : `Day ${dayIdParam} Routine`}
      </h2>

      {totalMinutes && (
        <p className="day-total-time" style={{ color: getColor(totalMinutes) }}>
          Estimated total: ~{totalMinutes} min
        </p>
      )}

      <div className="workout-list">
        {workouts.map((w) => {
          const workoutMinutes = Math.round(estimateWorkoutSeconds(w) / 60);
          return (
            <div key={w.id} className="workout-card">
              {editingId === w.id ? (
                <EditWorkoutForm
                  editData={editData}
                  setEditData={setEditData}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                  workoutId={w.id}
                />
              ) : (
                <>
                  <div>
                    <h3>{capitalizeWords(w.name)}</h3>

                    <div className="sets-inline">
                      <label>Sets:</label>
                      <NumberAdjuster
                        value={w.sets}
                        min={1}
                        onChange={(val) => {
                          const updated = { ...w, sets: val };
                          if (hasWeeks) {
                            updateWorkout(dayIdParam, updated, weekIdParam);
                          } else {
                            updateWorkout(dayIdParam, updated);
                          }
                        }}
                      />
                    </div>

                    <ul>
                      {(w.reps || []).map((r, i) => (
                        <li key={i}>
                          Set {i + 1}:{" "}
                          <NumberAdjuster
                            value={r}
                            min={1}
                            onChange={(val) => {
                              const updatedReps = [...w.reps];
                              updatedReps[i] = val;
                              const updated = { ...w, reps: updatedReps };
                              if (hasWeeks) {
                                updateWorkout(dayIdParam, updated, weekIdParam);
                              } else {
                                updateWorkout(dayIdParam, updated);
                              }
                            }}
                          />
                        </li>
                      ))}
                    </ul>

                    <p className="workout-time" style={{ color: getColor(workoutMinutes) }}>
                      ~{workoutMinutes} min
                    </p>
                  </div>

                  <div className="delete-wrapper">
                    <button
                      className="delete-btn"
                      onMouseDown={() => handleHoldStart(w.id)}
                      onMouseUp={handleHoldEnd}
                      onMouseLeave={handleHoldEnd}
                      onTouchStart={() => handleHoldStart(w.id)}
                      onTouchEnd={handleHoldEnd}
                      aria-label="Hold to delete"
                      title="Hold to delete"
                    >
                      ✕
                      {holdingId === w.id && (
                        <svg className="progress-ring" width="40" height="40">
                          <circle
                            className="progress-ring__circle"
                            stroke="green"
                            strokeWidth="3"
                            fill="transparent"
                            r="18"
                            cx="20"
                            cy="20"
                            style={{
                              strokeDasharray: 2 * Math.PI * 18,
                              strokeDashoffset:
                                2 * Math.PI * 18 - (progress / 100) * (2 * Math.PI * 18),
                            }}
                          />
                        </svg>
                      )}
                    </button>

                    <button className="toggle-btn" onClick={() => startEditing(w)}>
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button className="toggle-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "➕ Add Workout"}
      </button>

      {showForm && (
        <AddWorkoutForm
          newWorkout={newWorkout}
          setNewWorkout={setNewWorkout}
          handleAddWorkout={handleAddWorkout}
        />
      )}

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Overview
      </button>
    </div>
  );
};

export default DayRoutine;
