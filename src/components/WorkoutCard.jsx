// src/components/WorkoutCard.jsx
import React, { useState, useEffect } from "react";
import EditWorkoutForm from "./EditWorkoutForm";
import NumberAdjuster from "./NumberAdjuster";
import SetRow from "./SetRow";
import Button from "./Button/Button";
import HoldToDeleteButton from "./Button/HoldToDeleteButton";
import { capitalizeWords } from "../utils/format";
import { adjustRepsForSets } from "../hooks/useSetsRepsWeights";
import { workouts as workoutMetaList } from "../data/workouts";
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
  hasWeeks,
  dayIdParam,
  weekIdParam,
  getColor,
  estimateWorkoutSeconds,
  collapsed,
}) => {
  const [preview, setPreview] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Detect "library mode": dataset workouts don’t have instance fields like id/sets/reps/weights
  const isLibrary = !("id" in (workout || {})) && !("sets" in (workout || {}));

  // ✅ forward helpers directly
  const {
    locked,
    updateWorkoutForward,
    deleteWorkoutForward,
    updateProgressForward,
  } = useProgram();

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

  const safeWorkout = workout || { name: "", sets: 0, reps: [], weights: [] };
  const repsArr = Array.isArray(safeWorkout.reps) ? safeWorkout.reps : [];
  const weightsArr =
    Array.isArray(safeWorkout.weights) && safeWorkout.weights.length
      ? safeWorkout.weights
      : Array(repsArr.length).fill(0);

  // If estimateWorkoutSeconds is not passed or the workout lacks instance fields, still guard
  const seconds = Number.isFinite(estimateWorkoutSeconds?.(safeWorkout))
    ? estimateWorkoutSeconds(safeWorkout)
    : 0;
  const workoutMinutes = Math.max(0, Math.round(seconds / 60));

  const workoutMeta = workoutMetaList.find((w) => w.name === safeWorkout.name);

  const togglePreview = () => setPreview((prev) => !prev);

  // Only allow editing mode if NOT library and if editingId is set and matches
  const isEditing = !isLibrary && editingId != null && editingId === safeWorkout.id;

  return (
    <div
      className={`workout-card ${collapsed ? "collapsed" : ""} ${
        safeWorkout.completed ? "done" : ""
      }`}
    >
      {isEditing ? (
        // Render EditWorkoutForm only when edit props exist and we’re in routine context
        <EditWorkoutForm
          editData={editData}
          setEditData={setEditData}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          workoutId={safeWorkout.id}
        />
      ) : preview ? (
        // PREVIEW CARD
        <div className="preview-mode">
          <h3 className="workout-title">{capitalizeWords(safeWorkout.name)}</h3>
          {collapsed ? (
            <p className="description">
              {workoutMeta?.description || "No description available."}
            </p>
          ) : (
            <>
              <WorkoutMedia
                workoutMeta={workoutMeta}
                workoutName={safeWorkout.name}
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
              {capitalizeWords(safeWorkout.name)}
              {!collapsed && workoutMeta?.imageUrl && (
                <img
                  src={workoutMeta.imageUrl}
                  alt={`${safeWorkout.name} target muscles`}
                  className="muscle-icon"
                />
              )}
            </h3>

            {/* Collapsed summary: show only if instance fields exist */}
            {collapsed && !isLibrary && (
              <div className="collapsed-summary">
                <p>
                  <strong>Sets:</strong> {safeWorkout.sets} –{" "}
                  {repsArr.map((r) => `${r} reps`).join(", ")}
                </p>
                <p>
                  <strong>Weights:</strong>{" "}
                  {weightsArr.map((w) => `${w}kg`).join(", ")}
                </p>
              </div>
            )}

            <div className="collapsible-content">
              {/* Sets/weights controls only in routine context, not library */}
              {!isLibrary && (
                <>
                  <div className="sets-weights-header">
                    <div className="header-spacer" />
                    <div className="weights-col-label">Weights</div>
                    <div className="sets-control">
                      <label>Sets:</label>
                      <NumberAdjuster
                        value={Number(safeWorkout.sets ?? 0)}
                        min={1}
                        disabled={locked}
                        onChange={(nextSets) => {
                          const nextReps = adjustRepsForSets(
                            safeWorkout.name,
                            repsArr,
                            nextSets
                          );
                          const nextWeights = adjustRepsForSets(
                            safeWorkout.name,
                            weightsArr,
                            nextSets
                          );
                          const updated = {
                            ...safeWorkout,
                            sets: nextSets,
                            reps: nextReps,
                            weights: nextWeights,
                          };
                          // ✅ Correct call: (weekIndex, dayNumber, updatedWorkout)
                          updateWorkoutForward(weekIdParam, dayIdParam, updated);
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
                        workout={safeWorkout}
                        updateWorkout={(dayNumber, updatedWorkout, weekIndex) =>
                          updateWorkoutForward(weekIndex, dayNumber, updatedWorkout)
                        }
                        updateProgress={(workoutId, setNumber) =>
                          updateProgressForward(weekIdParam, dayIdParam, workoutId, setNumber)
                        }
                        hasWeeks={hasWeeks}
                        dayIdParam={dayIdParam}
                        weekIdParam={weekIdParam}
                        disabled={locked}
                        completed={i < (safeWorkout.completedSets || 0)}
                      />
                    ))}
                  </div>
                </>
              )}

              <p
                className="workout-time"
                style={{ color: getColor?.(workoutMinutes) || "inherit" }}
              >
                {workoutMinutes > 0 ? `~${workoutMinutes} min` : "—"}
              </p>
            </div>
          </div>

          <div className="delete-wrapper">
            <div className="top-actions">
              {/* Hold-to-delete only in routine context with an id */}
              {!isLibrary && (
                <HoldToDeleteButton
                  onConfirm={() =>
                    deleteWorkoutForward(weekIdParam, dayIdParam, safeWorkout.id)
                  }
                  disabled={locked}
                  confirmMessage="Workout deleted ✅"
                  cancelMessage="Delete cancelled ⚠️"
                >
                  🗑 Hold to Delete
                </HoldToDeleteButton>
              )}

              {/* Edit button only if startEditing exists and not library */}
              {!isLibrary && (
                <Button
                  variant="primary"
                  onClick={() => startEditing?.(safeWorkout)}
                  disabled={locked}
                >
                  Edit
                </Button>
              )}
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
