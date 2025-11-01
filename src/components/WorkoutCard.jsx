// src/components/WorkoutCard.jsx

import React, { useState, useEffect, useRef } from "react";
import EditWorkoutForm from "./EditWorkoutForm";
import NumberAdjuster from "./NumberAdjuster";
import SetRow from "./SetRow";
import Button from "./Button/Button";
import { capitalizeWords } from "../utils/format";
import { adjustRepsForSets } from "../hooks/useSetsRepsWeights";
import { workouts } from "../data/workouts";
import WorkoutMedia from "./WorkoutMedia";
import { useProgram } from "../context/ProgramContext";
import "./WorkoutCard.scss";

const WorkoutCard = ({
  workout,
  editingId,
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  startEditing,
  updateWorkout,
  hasWeeks,
  dayIdParam,
  weekIdParam,
  getColor,
  estimateWorkoutSeconds,
  collapsed,
}) => {
  const [preview, setPreview] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { locked, deleteWorkout } = useProgram();

  // Long‑press delete state
  const timers = useRef({});
  const [activeDelete, setActiveDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const repsArr = workout.reps || [];
  const weightsArr =
    workout.weights && workout.weights.length
      ? workout.weights
      : Array(repsArr.length).fill(0);

  const workoutMinutes = Math.round(estimateWorkoutSeconds(workout) / 60);
  const workoutMeta = workouts.find((w) => w.name === workout.name);

  const togglePreview = () => setPreview((prev) => !prev);

  // Toast helper
  const showToast = (message, type) => {
    setToast(message);
    setToastType(type);
    setTimeout(() => {
      setToast(null);
      setToastType(null);
    }, 2500);
  };

  // Long‑press handlers
  const handleDeletePress = (id) => {
    if (locked) return;
    setActiveDelete(id);
    timers.current[id] = setTimeout(() => {
      // ✅ Show toast first
      showToast("Workout deleted ✅", "success");
      setActiveDelete(null);
      timers.current[id] = null;

      // ✅ Delay actual deletion so toast survives
      setTimeout(() => {
        if (hasWeeks) {
          deleteWorkout(dayIdParam, id, weekIdParam);
        } else {
          deleteWorkout(dayIdParam, id);
        }
      }, 300);
    }, 2000);
  };

  const handleDeleteRelease = (id) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      timers.current[id] = null;
      if (activeDelete === id) {
        showToast("Delete cancelled ⚠️", "cancel");
      }
    }
    setActiveDelete(null);
  };

  return (
    <>
      <div
        className={`workout-card ${collapsed ? "collapsed" : ""} ${
          workout.completed ? "done" : ""
        }`}
      >
        {editingId === workout.id ? (
          <EditWorkoutForm
            editData={editData}
            setEditData={setEditData}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            workoutId={workout.id}
          />
        ) : preview ? (
          // PREVIEW CARD
          <div className="preview-mode">
            <h3 className="workout-title">{capitalizeWords(workout.name)}</h3>
            {collapsed ? (
              <p className="description">
                {workoutMeta?.description || "No description available."}
              </p>
            ) : (
              <>
                <WorkoutMedia
                  workoutMeta={workoutMeta}
                  workoutName={workout.name}
                  collapsed={collapsed}
                  isOnline={isOnline}
                />
                <p className="description">
                  {workoutMeta?.description || "No description available."}
                </p>
              </>
            )}
            <Button variant="secondary" onClick={togglePreview}>
              Back to Workout
            </Button>
          </div>
        ) : (
          // MAIN CARD
          <>
            <div>
              <h3 className="workout-title">
                {capitalizeWords(workout.name)}
                {!collapsed && workoutMeta?.imageUrl && (
                  <img
                    src={workoutMeta.imageUrl}
                    alt={`${workout.name} target muscles`}
                    className="muscle-icon"
                  />
                )}
              </h3>

              {collapsed && (
                <div className="collapsed-summary">
                  <p>
                    <strong>Sets:</strong> {workout.sets} –{" "}
                    {repsArr.map((r, i) => `${r} reps`).join(", ")}
                  </p>
                  <p>
                    <strong>Weights:</strong>{" "}
                    {weightsArr.map((w) => `${w}kg`).join(", ")}
                  </p>
                </div>
              )}

              <div className="collapsible-content">
                <div className="sets-weights-header">
                  <div className="header-spacer" />
                  <div className="weights-col-label">Weights</div>
                  <div className="sets-control">
                    <label>Sets:</label>
                    <NumberAdjuster
                      value={Number(workout.sets)}
                      min={1}
                      disabled={locked}
                      onChange={(nextSets) => {
                        const nextReps = adjustRepsForSets(
                          workout.name,
                          repsArr,
                          nextSets
                        );
                        const nextWeights = adjustRepsForSets(
                          workout.name,
                          weightsArr,
                          nextSets
                        );
                        const updated = {
                          ...workout,
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

                <div className="set-list">
                  {repsArr.map((r, i) => (
                    <SetRow
                      key={i}
                      index={i}
                      rep={r}
                      weight={weightsArr[i]}
                      workout={workout}
                      updateWorkout={updateWorkout}
                      hasWeeks={hasWeeks}
                      dayIdParam={dayIdParam}
                      weekIdParam={weekIdParam}
                      disabled={locked}
                      completed={i < (workout.completedSets || 0)}
                    />
                  ))}
                </div>

                <p
                  className="workout-time"
                  style={{ color: getColor(workoutMinutes) }}
                >
                  ~{workoutMinutes} min
                </p>
              </div>
            </div>

            <div className="delete-wrapper">
              <div className="top-actions">
                <button
                  className={`delete-btn ${
                    activeDelete === workout.id ? "progress" : ""
                  }`}
                  disabled={locked}
                  onMouseDown={() => handleDeletePress(workout.id)}
                  onMouseUp={() => handleDeleteRelease(workout.id)}
                  onMouseLeave={() => handleDeleteRelease(workout.id)}
                  onTouchStart={() => handleDeletePress(workout.id)}
                  onTouchEnd={() => handleDeleteRelease(workout.id)}
                >
                  🗑 Hold to Delete
                  {activeDelete === workout.id && (
                    <span className="progress-bar"></span>
                  )}
                </button>

                <Button
                  variant="primary"
                  onClick={() => startEditing(workout)}
                  disabled={locked}
                >
                  Edit
                </Button>
              </div>
              <div className="actions-divider" />
              <Button
                variant="secondary"
                className={`preview-btn ${preview ? "preview-active" : ""}`}
                onClick={togglePreview}
              >
                {preview ? "Back to Workout" : "Preview"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ✅ Local toast */}
      {toast && <div className={`toast ${toastType}`}>{toast}</div>}
    </>
  );
};

export default WorkoutCard;
