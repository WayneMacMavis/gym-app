// src/hooks/useDayEstimates.js

// Estimate total seconds for a single workout
const estimateWorkoutSeconds = (workout) => {
  let total = 0;
  const sets = workout.sets || 0;
  const reps = workout.reps || [];
  for (let i = 0; i < sets; i++) {
    const r = parseInt(reps[i], 10) || 0;
    total += r;
    if (i < sets - 1) total += 30; // rest between sets
  }
  return total;
};

// Estimate total minutes for a day of workouts
const estimateDayMinutes = (workouts) => {
  let total = 0;
  workouts.forEach((w, wi) => {
    total += estimateWorkoutSeconds(w);
    if (wi < workouts.length - 1) total += 60; // rest between workouts
  });
  return Math.round(total / 60);
};

// Color coding based on duration
const getColor = (minutes) => {
  if (minutes <= 20) return "#2a7a4b";   // green
  if (minutes <= 40) return "#e67e22";   // orange
  return "#c0392b";                      // red
};

export const useDayEstimates = () => {
  return { estimateWorkoutSeconds, estimateDayMinutes, getColor };
};
