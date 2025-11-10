// src/hooks/useWorkoutEditor.js
// Custom hook to manage workout editing state.
// Provides editingId, editData, and handlers for starting, saving, and canceling edits.

import { useState } from "react";
import { formatWorkout } from "../utils/workouts";

export const useWorkoutEditor = (updateWorkoutForward, dayIdParam, weekIdParam, hasWeeks) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", sets: 0, reps: [], weights: [] });

  const startEditing = (workout) => {
    setEditingId(workout.id);
    setEditData({
      id: workout.id,
      name: workout.name,
      sets: Number(workout.sets || 0),
      reps: [...(workout.reps || [])],
      weights: [...(workout.weights || [])],
    });
  };

  const saveEdit = (updatedWorkout) => {
    const formatted = formatWorkout(updatedWorkout, updatedWorkout.id);

    if (hasWeeks) {
      updateWorkoutForward(weekIdParam, dayIdParam, formatted);
    } else {
      updateWorkoutForward(dayIdParam, formatted);
    }

    setEditingId(null);
    setEditData({ name: "", sets: 0, reps: [], weights: [] });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", sets: 0, reps: [], weights: [] });
  };

  return { editingId, editData, setEditData, startEditing, saveEdit, cancelEdit };
};
