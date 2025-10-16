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
import Button from "../components/Button/Button";

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
  const [editData, setEditData] = useState({ name: "", sets: 0, reps: [], weights: [] });

  const addingRef = useRef(false);

  // Hold-to-delete with progress
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
      reps: Array.isArray(workout.reps) ? workout.reps : [],
      weights: Array.isArray(workout.weights) ? workout.weights : [],
      sets: Number(workout.sets || 0),
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
    setEditData({
      name: w.name,
      sets: Number(w.sets || 0),
      reps: [...(w.reps || [])],
      weights: [...(w.weights || [])],
    });
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
      weights: editData.weights.map((wt) => Number(wt)),
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
          const repsArr = w.reps || [];
          const weightsArr = w.weights || [];

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

                    {/* Header: spacer | Weights label | Sets control */}
                    <div className="sets-weights-header">
                      <div className="header-spacer" />
                      <div className="weights-col-label">Weights</div>
                      <div className="sets-control">
                        <label>Sets:</label>
                        <NumberAdjuster
                          value={Number(w.sets)}
                          min={1}
                          onChange={(nextSets) => {
                            const nextReps = adjustRepsForSets(w.name, repsArr, nextSets);
                            const nextWeights = adjustRepsForSets(w.name, weightsArr, nextSets);
                            const updated = {
                              ...w,
                              sets: nextSets,
                              reps: nextReps,
                              weights: nextWeights,
                            };
                            if (hasWeeks) {
                              updateWorkout(dayIdParam, updated, weekIdParam);
                            } else {
                              updateWorkout(dayIdParam, updated);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Rows: number | weights | reps */}
                    <ul className="set-list">
                      {repsArr.map((r, i) => (
                        <li key={i} className="set-row">
                          <span className="row-number">{i + 1}</span>

                          <div className="weight-info">
                            <NumberAdjuster
                              value={Number(weightsArr[i] ?? 0)}
                              min={0}
                              showUnit="kg"
                              onChange={(val) => {
                                const updatedWeights = [...weightsArr];
                                updatedWeights[i] = Number(val);
                                const updated = { ...w, weights: updatedWeights };
                                if (hasWeeks) {
                                  updateWorkout(dayIdParam, updated, weekIdParam);
                                } else {
                                  updateWorkout(dayIdParam, updated);
                                }
                              }}
                            />
                          </div>

                          <div className="set-info">
                            <NumberAdjuster
                              value={Number(r)}
                              min={1}
                              showUnit="reps"
                              onChange={(val) => {
                                const updatedReps = [...repsArr];
                                updatedReps[i] = Number(val);
                                const updated = { ...w, reps: updatedReps };
                                if (hasWeeks) {
                                  updateWorkout(dayIdParam, updated, weekIdParam);
                                } else {
                                  updateWorkout(dayIdParam, updated);
                                }
                              }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>

                    <p className="workout-time" style={{ color: getColor(workoutMinutes) }}>
                      ~{workoutMinutes} min
                    </p>
                  </div>

                  <div className="delete-wrapper">
                    <Button
                      variant="danger"
                      className="delete-btn"
                      onMouseDown={() => {
                        handleHoldStart(w.id);
                        if (navigator.vibrate) navigator.vibrate(50);
                      }}
                      onMouseUp={handleHoldEnd}
                      onMouseLeave={handleHoldEnd}
                      onTouchStart={() => {
                        handleHoldStart(w.id);
                        if (navigator.vibrate) navigator.vibrate(50);
                      }}
                      onTouchEnd={handleHoldEnd}
                      aria-label="Hold to delete"
                      title="Hold to delete"
                    >
                      <span className="delete-icon">✕</span>
                      {holdingId === w.id && (
                        <svg className="progress-ring" width="36" height="36">
                          <circle
                            className="progress-ring__circle"
                            stroke="green"
                            strokeWidth="3"
                            fill="transparent"
                            r="16"
                            cx="18"
                            cy="18"
                            style={{
                              strokeDasharray: 2 * Math.PI * 16,
                              strokeDashoffset:
                                2 * Math.PI * 16 - (progress / 100) * (2 * Math.PI * 16),
                            }}
                          />
                        </svg>
                      )}
                    </Button>

                    <Button variant="primary" onClick={() => startEditing(w)}>
                      Edit
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Stacked, centered actions (no wrapper) */}
      <Button variant="primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "➕ Add Workout"}
      </Button>

      {showForm && <AddWorkoutForm onAddWorkout={handleAddWorkout} />}

      <Button variant="secondary" onClick={() => navigate("/")}>
        ← Back to Overview
      </Button>
    </div>
  );
};

export default DayRoutine;
