// src/hooks/useSetsAndReps.js
import { useState, useEffect } from "react";
import { getRule } from "../rules/progressionRules";

/**
 * Adjust an existing reps array when sets change.
 * - Preserves existing values where possible.
 * - Fills new slots with defaults from progression rules.
 * - Trims if sets decrease.
 */
export const adjustRepsForSets = (name, prevReps = [], newSets) => {
  const { minReps, maxReps } = getRule(name) || { minReps: 6, maxReps: 12 };
  const decrement = 2;
  const defaults = [];
  let current = maxReps;

  for (let i = 0; i < newSets; i++) {
    defaults.push(current);
    current = Math.max(minReps, current - decrement);
  }

  return Array.from({ length: newSets }, (_, i) => {
    const v = prevReps[i];
    return v !== undefined && v !== null ? Number(v) : defaults[i];
  });
};

export default function useSetsAndReps(
  initialSets = 3,
  initialReps = [12, 10, 8],
  exerciseName = ""
) {
  const [sets, setSets] = useState(initialSets);
  const [reps, setReps] = useState(initialReps);

  // Whenever sets or exercise name changes, adjust reps accordingly
  useEffect(() => {
    setReps((prev) => adjustRepsForSets(exerciseName, prev, sets));
  }, [sets, exerciseName]);

  const handleSetChange = (newCount) => setSets(newCount);

  const handleRepChange = (index, newVal) => {
    setReps((prev) => {
      const updated = [...prev];
      updated[index] = Number(newVal);
      return updated;
    });
  };

  return { sets, reps, handleSetChange, handleRepChange };
}
