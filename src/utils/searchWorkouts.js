// searchWorkouts.js
import { workouts } from "../data/workouts";

export const searchWorkouts = (query) => {
  if (!query) return [];
  const lower = query.toLowerCase();
  return workouts.filter((w) => w.name.toLowerCase().includes(lower));
};
