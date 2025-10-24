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
  reps: (workout.reps || []).map(Number),
  weights: (workout.weights || []).map(Number),
  sets: Number(workout.sets || 0),
});
