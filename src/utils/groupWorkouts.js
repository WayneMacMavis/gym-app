// src/utils/groupWorkouts.js
export const groupWorkouts = (workouts) => {
  const groups = {};
  workouts.forEach((w) => {
    const category = w.category || "Other";
    if (!groups[category]) groups[category] = [];
    groups[category].push(w);
  });
  return Object.entries(groups).map(([category, items]) => ({ category, items }));
};
