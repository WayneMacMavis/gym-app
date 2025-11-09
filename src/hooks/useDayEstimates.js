// src/hooks/useDayEstimates.js
import { useMemo } from "react";
import { useProgram } from "../context/ProgramContext";

// Estimate total seconds for a single workout
const estimateWorkoutSeconds = (workout) => {
  const sets = workout.sets || 0;
  if (sets === 0) return 0;

  let total = sets * 60; // each set = 60s
  if (sets > 1) {
    total += (sets - 1) * 60; // rest between sets
  }
  return total;
};

// Estimate total seconds for a day of workouts
const estimateDaySeconds = (workouts) => {
  let total = 0;
  workouts.forEach((w, wi) => {
    total += estimateWorkoutSeconds(w);
    if (wi < workouts.length - 1) {
      total += 120; // 2 minutes between workouts
    }
  });
  return total;
};

// Estimate total minutes for a day of workouts
const estimateDayMinutes = (workouts) => {
  return Math.round(estimateDaySeconds(workouts) / 60);
};

// Color coding based on duration
const getColor = (minutes) => {
  if (minutes <= 20) return "#2a7a4b";   // green
  if (minutes <= 40) return "#e67e22";   // orange
  return "#c0392b";                      // red
};

// Hook: compute totals for a given week/day
export const useDayEstimates = (weekIndex, dayNumber) => {
  const { programs } = useProgram();

  // ✅ Memoize workouts so dependency arrays are stable
  const workouts = useMemo(
    () => programs?.[weekIndex]?.[dayNumber] || [],
    [programs, weekIndex, dayNumber]
  );

  const totalSeconds = useMemo(() => estimateDaySeconds(workouts), [workouts]);
  const totalMinutes = useMemo(() => estimateDayMinutes(workouts), [workouts]);

  return {
    totalSeconds,
    totalMinutes,
    getColor,
    estimateWorkoutSeconds,
    estimateDayMinutes, // keep old API alive for DayRoutine
  };
};

// ✅ Export helper for use in MonthlyFooter aggregation
export { estimateDayMinutes };
