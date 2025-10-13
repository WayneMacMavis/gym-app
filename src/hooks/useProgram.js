import { useState, useEffect } from "react";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function getNextWorkout(current) {
  const {
    weight = 0,
    sets = 3,
    reps = [],
    minReps = 6,
    maxReps = 12
  } = current;

  const allAtMax = reps.length > 0 && reps.every((r) => Number(r) >= maxReps);

  if (allAtMax) {
    return {
      ...current,
      id: uid(),
      weight: weight + 2.5,
      reps: Array(sets).fill(minReps),
    };
  }

  const idx = reps.findIndex((r) => Number(r) < maxReps);
  if (idx !== -1) {
    const newReps = reps.map((r, i) => (i === idx ? Number(r) + 1 : Number(r)));
    return { ...current, id: uid(), reps: newReps };
  }

  return {
    ...current,
    id: uid(),
    sets: sets + 1,
    reps: [...reps.map(Number), minReps],
  };
}

export function useProgram() {
  const [program, setProgram] = useState(() => {
    const saved = localStorage.getItem("program");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === "object") {
        const weeks = [];
        weeks.push(parsed);
        for (let w = 1; w < 8; w++) {
          weeks.push({ "1": [], "2": [], "3": [] });
        }
        return weeks;
      }
    }
    return Array.from({ length: 8 }, () => ({ "1": [], "2": [], "3": [] }));
  });

  useEffect(() => {
    localStorage.setItem("program", JSON.stringify(program));
  }, [program]);

  const addWorkout = (dayId, workout, weekId) => {
    setProgram((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const wk = typeof weekId === "number" ? weekId : 0;
      if (!updated[wk]) updated[wk] = { "1": [], "2": [], "3": [] };
      if (!updated[wk][dayId]) updated[wk][dayId] = [];

      const item = workout.id ? workout : { ...workout, id: uid() };

      // Dedupe guard: if same id already exists, do nothing
      const exists = updated[wk][dayId].some((w) => w.id === item.id);
      if (exists) return prev;

      updated[wk][dayId] = [...updated[wk][dayId], item];
      return updated;
    });
  };

  const deleteWorkout = (dayId, workoutId, weekId) => {
    setProgram((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const wk = typeof weekId === "number" ? weekId : 0;
      if (!updated[wk] || !updated[wk][dayId]) return prev;
      updated[wk][dayId] = updated[wk][dayId].filter((w) => w.id !== workoutId);
      return updated;
    });
  };

  const updateWorkout = (dayId, updatedWorkout, weekId) => {
    setProgram((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const wk = typeof weekId === "number" ? weekId : 0;
      if (!updated[wk]) updated[wk] = { "1": [], "2": [], "3": [] };
      if (!updated[wk][dayId]) updated[wk][dayId] = [];
      updated[wk][dayId] = updated[wk][dayId].map((w) =>
        w.id === updatedWorkout.id ? updatedWorkout : w
      );
      return updated;
    });

    setProgram((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const wk = typeof weekId === "number" ? weekId : 0;
      const nextWk = wk + 1;

      if (updated[nextWk]) {
        if (!updated[nextWk][dayId]) updated[nextWk][dayId] = [];
        const nextWeekDay = updated[nextWk][dayId];
        const progressed = getNextWorkout(updatedWorkout);

        const exists = nextWeekDay.some((w) => w.id === progressed.id || w.name === progressed.name);
        if (!exists) {
          updated[nextWk][dayId] = [...nextWeekDay, progressed];
        }
      }
      return updated;
    });
  };

  return { program, addWorkout, deleteWorkout, updateWorkout };
}
