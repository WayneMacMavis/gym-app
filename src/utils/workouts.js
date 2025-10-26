// workouts.js
// Utility for normalizing/formatting workout objects.
// Ensures consistent structure: capitalized name, numeric sets/reps/weights, and unique ID.

import { capitalizeWords } from "./format";

export const formatWorkout = (workout, idOverride) => ({
  ...workout,
  id:
    idOverride ||
    workout.id ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}-${crypto.randomUUID?.() || ""}`,
  name: capitalizeWords(workout.name),

  // ✅ reps: always whole numbers
  reps: (workout.reps || []).map((r) => {
    const num = Number(r);
    return Number.isNaN(num) ? 0 : Math.round(num);
  }),

  // ✅ weights: always snapped to nearest 0.5
  weights: (workout.weights || []).map((w) => {
    const num = Number(w);
    return Number.isNaN(num) ? 0 : Math.round(num * 2) / 2;
  }),

  sets: Number(workout.sets || 0),
});
