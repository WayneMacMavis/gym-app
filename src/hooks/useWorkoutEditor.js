// useWorkoutEditor.js
// Custom hook to manage workout editing state.
// Provides editingId, editData, and handlers for starting, saving, and canceling edits.

import { useState } from "react";
import { formatWorkout } from "../utils/workouts";

export const useWorkoutEditor = (updateWorkout, dayIdParam, weekIdParam, hasWeeks) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", sets: 0, reps: [], weights: [] });

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
    const updatedWorkout = formatWorkout(editData, id);

    if (hasWeeks) {
      updateWorkout(dayIdParam, updatedWorkout, weekIdParam);
    } else {
      updateWorkout(dayIdParam, updatedWorkout);
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return { editingId, editData, setEditData, startEditing, saveEdit, cancelEdit };
};
