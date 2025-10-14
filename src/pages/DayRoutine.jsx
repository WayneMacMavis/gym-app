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
import { adjustRepsForSets } from "../hooks/useSetsAndReps";

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

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", sets: 0, reps: [] });

  const addingRef = useRef(false);

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

  const { estimateWorkoutSeconds, estimateDayMinutes, getColor } = useDayEstimates();
  const totalMinutes = workouts.length ? estimateDayMinutes(workouts) : null;

  const handleAddWorkout = (workout) => {
    if (addingRef.current) return;
    addingRef.current = true;

    const formatted = {
      ...workout,
      id: uid(),
      name: capitalizeWords(workout.name),
    };

    if (hasWeeks) {
      addWorkout(dayIdParam, formatted, weekIdParam);
    } else {
      addWorkout(dayIdParam, formatted);
    }

    setShowForm(false);
    setTimeout(() => {
      addingRef.current = false;
    }, 0);
  };

  const startEditing = (w) => {
    setEditingId(w.id);
    setEditData({ name: w.name, sets: Number(w.sets || 0), reps: [...(w.reps || [])] });
  };

  const saveEdit = (e, id) => {
    e.preventDefault();
    if (typeof updateWorkout !== "function") {
      setEditingId(null);
      return;
    }
    const formattedName = capitalizeWords(editData.name);
    const updatedWorkout = {
      ...editData,
      name: formattedName,
      id,
      reps: editData.reps.map((r) => Number(r)),
      sets: Number(editData.sets),
    };

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
                        value={Number(w.sets)}
                        min={1}
                        onChange={(val) => {
                          const nextSets = Number(val);
                          const nextReps = adjustRepsForSets(w.name, w.reps, nextSets);
                          const updated = { ...w, sets: nextSets, reps: nextReps };
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
                            value={Number(r)}
                            min={1}
                            showUnit="reps"
                            onChange={(val) => {
                              const updatedReps = [...(w.reps || [])];
                              updatedReps[i] = Number(val);
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
          onAddWorkout={handleAddWorkout}
        />
      )}

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Overview
      </button>
    </div>
  );
};

export default DayRoutine;
