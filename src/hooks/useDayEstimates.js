// src/hooks/useDayEstimates.js

// Estimate total seconds for a single workout
// Rule: each set = 60s, each rest between sets = 60s
const estimateWorkoutSeconds = (workout) => {
  const sets = workout.sets || 0;
  if (sets === 0) return 0;

  // time for sets
  let total = sets * 60;

  // rest between sets (only between, not after last)
  if (sets > 1) {
    total += (sets - 1) * 60;
  }

  return total;
};

// Estimate total minutes for a day of workouts
// Rule: add 120s rest between workouts
const estimateDayMinutes = (workouts) => {
  let total = 0;
  workouts.forEach((w, wi) => {
    total += estimateWorkoutSeconds(w);
    if (wi < workouts.length - 1) {
      total += 120; // 2 minutes between workouts
    }
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
