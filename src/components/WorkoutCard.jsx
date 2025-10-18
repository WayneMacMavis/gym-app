// WorkoutCard.jsx
// Displays a single workout card with name, sets control, set rows, estimated time,
// and actions (edit, hold-to-delete). Switches to EditWorkoutForm if in editing mode.
// Supports collapsed mode for global expand/collapse toggle with smooth animation.
// Header and rows share the same grid columns for perfect alignment.

import React from "react";
import EditWorkoutForm from "./EditWorkoutForm";
import NumberAdjuster from "./NumberAdjuster";
import DeleteButton from "./DeleteButton";
import SetRow from "./SetRow";
import Button from "./Button/Button";
import { capitalizeWords } from "../utils/format";
import { adjustRepsForSets } from "../hooks/useSetsAndReps";
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
  holdingId,
  progress,
  handleHoldStart,
  handleHoldEnd,
  getColor,
  estimateWorkoutSeconds,
  collapsed,
}) => {
  const repsArr = workout.reps || [];
  const weightsArr = workout.weights || [];
  const workoutMinutes = Math.round(estimateWorkoutSeconds(workout) / 60);

  return (
    <div className={`workout-card ${collapsed ? "collapsed" : ""}`}>
      {editingId === workout.id ? (
        <EditWorkoutForm
          editData={editData}
          setEditData={setEditData}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          workoutId={workout.id}
        />
      ) : (
        <>
          <div>
            <h3>{capitalizeWords(workout.name)}</h3>

            {/* Collapsed summary (shown when collapsed) */}
            <p className="collapsed-summary">
              Weights: {weightsArr.length ? weightsArr.join(", ") + "kg" : "—"} – Sets:{" "}
              {workout.sets}: {repsArr.join(", ")} reps
            </p>

            {/* Always mounted; animates via CSS */}
            <div className="collapsible-content">
              {/* Header: number | weights | sets control */}
              <div className="sets-weights-header">
                <div className="header-spacer" />
                <div className="weights-col-label">Weights</div>
                <div className="sets-control">
                  <label>Sets:</label>
                  <NumberAdjuster
                    value={Number(workout.sets)}
                    min={1}
                    onChange={(nextSets) => {
                      const nextReps = adjustRepsForSets(workout.name, repsArr, nextSets);
                      const nextWeights = adjustRepsForSets(workout.name, weightsArr, nextSets);
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

              {/* Rows: number | weights | reps */}
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
                  />
                ))}
              </div>

              <p className="workout-time" style={{ color: getColor(workoutMinutes) }}>
                ~{workoutMinutes} min
              </p>
            </div>
          </div>

          {/* Delete/Edit column stays stable on the right */}
          <div className="delete-wrapper">
            <DeleteButton
              workoutId={workout.id}
              holdingId={holdingId}
              progress={progress}
              handleHoldStart={handleHoldStart}
              handleHoldEnd={handleHoldEnd}
            />
            <Button variant="primary" onClick={() => startEditing(workout)}>
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutCard;
