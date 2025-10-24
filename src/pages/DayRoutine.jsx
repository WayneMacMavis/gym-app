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

const DayRoutine = () => {
  const { programs, addWorkout, deleteWorkout, updateWorkout } = useProgram();
  const params = useParams();
  const navigate = useNavigate();

  const weekIdParam = params.weekId ? parseInt(params.weekId, 10) - 1 : null;
  const dayIdParam = params.dayId ? String(parseInt(params.dayId, 10)) : null;

  const hasWeeks = Array.isArray(programs) && programs.length > 0;
  const workouts = hasWeeks
    ? (programs[weekIdParam]?.[dayIdParam] || [])
    : [];

  const [showForm, setShowForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  const {
    editingId,
    editData,
    setEditData,
    startEditing,
    saveEdit,
    cancelEdit,
  } = useWorkoutEditor(updateWorkout, dayIdParam, weekIdParam, hasWeeks);

  // ✅ Debounced add logic to prevent duplicates
  const handleAddWorkout = (() => {
    let lastId = null;

    return (workout) => {
      const formatted = formatWorkout(workout);

      if (formatted.id === lastId) {
        console.warn("Duplicate add prevented:", formatted.id);
        return;
      }

      lastId = formatted.id;

      if (hasWeeks) {
        addWorkout(dayIdParam, formatted, weekIdParam);
      } else {
        addWorkout(dayIdParam, formatted);
      }

      setShowForm(false);
    };
  })();

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
            collapsed={collapsed}
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
