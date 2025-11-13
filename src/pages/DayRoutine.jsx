// src/pages/DayRoutine.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DayRoutine.scss";
import AddWorkoutForm from "../components/AddWorkoutForm";
import WorkoutCard from "../components/WorkoutCard";
import { useHoldToDelete } from "../hooks/useHoldToDelete";
import { useDayEstimates } from "../hooks/useDayEstimates";
import { useWorkoutEditor } from "../hooks/useWorkoutEditor";
import { formatWorkout } from "../utils/workouts";
import Button from "../components/Button/Button";
import { useProgram } from "../context/ProgramContext";
import DropDownTagButton from "../components/DropDownTagButton";

const DayRoutine = () => {
  const {
    programs,
    addWorkoutForward,
    deleteWorkoutForward,
    updateWorkoutForward,
    updateProgressForward,
    locked,
  } = useProgram();

  const params = useParams();
  const navigate = useNavigate();

  const weekIdParam = params.weekId ? parseInt(params.weekId, 10) - 1 : 0;
  const dayIdParam = params.dayId ? String(parseInt(params.dayId, 10)) : "1";

  const hasWeeks = Array.isArray(programs) && programs.length > 0;
  const workouts = hasWeeks ? (programs[weekIdParam]?.[dayIdParam] || []) : [];

  const [showForm, setShowForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // IMPORTANT: always call the forward delete; don't gate with hasWeeks
  const { holdingId, progress, handleHoldStart, handleHoldEnd } = useHoldToDelete(
    (id) => {
      deleteWorkoutForward(weekIdParam, dayIdParam, id);
    },
    2000
  );

  const { estimateWorkoutSeconds, getColor, totalMinutes } = useDayEstimates(
    weekIdParam,
    dayIdParam
  );

  const {
    editingId,
    editData,
    setEditData,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useWorkoutEditor(updateWorkoutForward, dayIdParam, weekIdParam, hasWeeks);

  const handleAddWorkout = (() => {
    let lastId = null;
    return (workout) => {
      const formatted = formatWorkout(workout);
      if (formatted.id === lastId) {
        console.warn("Duplicate add prevented:", formatted.id);
        return;
      }
      lastId = formatted.id;
      addWorkoutForward(weekIdParam, dayIdParam, formatted);
      setShowForm(false);
    };
  })();

  return (
    <div className="day-routine">
      <DropDownTagButton
        label={locked ? "Stop Workout" : "Start Workout"}
        weekIndex={weekIdParam}
        dayNumber={dayIdParam}
        totalMinutes={totalMinutes}
      />

      <h2>{`Week ${weekIdParam + 1}, Day ${dayIdParam}`}</h2>

      {totalMinutes > 0 && (
        <p className="day-total-time" style={{ color: getColor(totalMinutes) }}>
          Estimated total: ~{totalMinutes} min
        </p>
      )}

      {workouts.length > 0 && (
        <Button variant="secondary" onClick={() => setCollapsed((prev) => !prev)}>
          {collapsed ? "Expand All" : "Collapse All"}
        </Button>
      )}

      <div className="workout-list">
        {workouts.map((w) => {
          const repsArr = w.reps || [];
          const weightsArr =
            w.weights && w.weights.length ? w.weights : Array(repsArr.length).fill(0);
          const totalWeight = weightsArr.reduce((sum, wt) => sum + (wt || 0), 0);
          const totalReps = repsArr.reduce((sum, r) => sum + (r || 0), 0);

          return (
            <div key={w.id} className="workout-wrapper">
              <WorkoutCard
                workout={w}
                editingId={editingId}
                editData={editData}
                setEditData={setEditData}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
                startEditing={startEditing}
                updateWorkout={updateWorkoutForward}
                // PASS BOTH: hold-to-delete uses the hook, card buttons can use this
                deleteWorkout={(workoutId) =>
                  deleteWorkoutForward(weekIdParam, dayIdParam, workoutId)
                }
                // forward progress adjuster
                updateProgress={(workoutId, setNumber) =>
                  updateProgressForward(weekIdParam, dayIdParam, workoutId, setNumber)
                }
                hasWeeks={hasWeeks}
                dayIdParam={dayIdParam}
                weekIdParam={weekIdParam}
                holdingId={holdingId}
                progress={progress}
                handleHoldStart={handleHoldStart}
                handleHoldEnd={handleHoldEnd}
                getColor={getColor}
                estimateWorkoutSeconds={estimateWorkoutSeconds}
                collapsed={collapsed}
              />

              <div className="workout-summary-inline">
                <span>Total Reps: {totalReps}</span>
                <span>Total Weight: {totalWeight} kg</span>
              </div>
            </div>
          );
        })}
      </div>

      {!showForm && (
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Add Workout
        </Button>
      )}

      {showForm && (
        <AddWorkoutForm
          onAddWorkout={handleAddWorkout}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Button variant="secondary" onClick={() => navigate("/")}>
        ← Back to Overview
      </Button>
    </div>
  );
};

export default DayRoutine;
