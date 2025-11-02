// src/components/WorkoutCard.jsx

import React, { useState, useEffect } from "react";
import EditWorkoutForm from "./EditWorkoutForm";
import NumberAdjuster from "./NumberAdjuster";
import SetRow from "./SetRow";
import Button from "./Button/Button";
import HoldToDeleteButton from "./Button/HoldToDeleteButton"; // ✅ new reusable button
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

  return (
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
              <HoldToDeleteButton
                onConfirm={() =>
                  hasWeeks
                    ? deleteWorkout(dayIdParam, workout.id, weekIdParam)
                    : deleteWorkout(dayIdParam, workout.id)
                }
                disabled={locked}
                confirmMessage="Workout deleted ✅"
                cancelMessage="Delete cancelled ⚠️"
              >
                🗑 Hold to Delete
              </HoldToDeleteButton>

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
  );
};

export default WorkoutCard;
