// src/hooks/useSetsRepsWeights.js
import { useState, useEffect } from "react";
import { getRule } from "../rules/progressionRules";

/**
 * Adjust reps array when sets change.
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

/**
 * Adjust weights array when sets change.
 * - Preserves existing values where possible.
 * - Fills new slots with 0.
 * - Trims if sets decrease.
 */
export const adjustWeightsForSets = (prevWeights = [], newSets) => {
  return Array.from({ length: newSets }, (_, i) => {
    const v = prevWeights[i];
    return v !== undefined && v !== null ? Number(v) : 0;
  });
};

export default function useSetsRepsWeights(
  initialSets = 3,
  initialReps = [12, 10, 8],
  initialWeights = [0, 0, 0],
  exerciseName = ""
) {
  const [sets, setSets] = useState(initialSets);
  const [reps, setReps] = useState(initialReps);
  const [weights, setWeights] = useState(initialWeights);

  // Whenever sets or exercise name changes, adjust reps + weights
  useEffect(() => {
    setReps((prev) => adjustRepsForSets(exerciseName, prev, sets));
    setWeights((prev) => adjustWeightsForSets(prev, sets));
  }, [sets, exerciseName]);

  const handleSetChange = (newCount) => setSets(newCount);

  const handleRepChange = (index, newVal) => {
    setReps((prev) => {
      const updated = [...prev];
      updated[index] = Number(newVal);
      return updated;
    });
  };

  const handleWeightChange = (index, newVal) => {
    setWeights((prev) => {
      const updated = [...prev];
      updated[index] = Number(newVal);
      return updated;
    });
  };

  return { sets, reps, weights, handleSetChange, handleRepChange, handleWeightChange };
}
