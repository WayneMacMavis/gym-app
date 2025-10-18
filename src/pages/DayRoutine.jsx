// DayRoutine.jsx
// Container for a single day's routine. Handles routing params, state, CRUD plumbing,
// and estimate logic. Renders a list of WorkoutCard components and controls for adding
// workouts and navigating back. Editing state is managed via useWorkoutEditor.
// Now includes a global collapse/expand toggle for all WorkoutCards.

import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DayRoutine.scss";
import AddWorkoutForm from "../components/AddWorkoutForm";
import WorkoutCard from "../components/WorkoutCard";
import { useHoldToDelete } from "../hooks/useHoldToDelete";
import { useDayEstimates } from "../hooks/useDayEstimates";
import { useWorkoutEditor } from "../hooks/useWorkoutEditor";
import { formatWorkout } from "../utils/workouts";
import Button from "../components/Button/Button";

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
  const [collapsed, setCollapsed] = useState(false); // 👈 new state
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

  // Estimates
  const { estimateWorkoutSeconds, estimateDayMinutes, getColor } = useDayEstimates();
  const totalMinutes = workouts.length ? estimateDayMinutes(workouts) : null;

  // Editing state machine
  const {
    editingId,
    editData,
    setEditData,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useWorkoutEditor(updateWorkout, dayIdParam, weekIdParam, hasWeeks);

  const handleAddWorkout = (workout) => {
    if (addingRef.current) return;
    addingRef.current = true;

    const formatted = formatWorkout(workout);

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

      {/* 👇 Collapse/Expand toggle */}
      {workouts.length > 0 && (
        <Button
          variant="secondary"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? "Expand All" : "Collapse All"}
        </Button>
      )}

      <div className="workout-list">
        {workouts.map((w) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            editingId={editingId}
            editData={editData}
            setEditData={setEditData}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            startEditing={startEditing}
            updateWorkout={updateWorkout}
            hasWeeks={hasWeeks}
            dayIdParam={dayIdParam}
            weekIdParam={weekIdParam}
            holdingId={holdingId}
            progress={progress}
            handleHoldStart={handleHoldStart}
            handleHoldEnd={handleHoldEnd}
            getColor={getColor}
            estimateWorkoutSeconds={estimateWorkoutSeconds}
            collapsed={collapsed} // 👈 pass down
          />
        ))}
      </div>

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
