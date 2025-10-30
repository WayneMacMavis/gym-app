import React, { createContext, useContext, useState, useEffect } from "react";
import { loadProgram, saveProgram } from "../utils/storage";

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [numWeeks, setNumWeeks] = useState(1);
  const [numDays, setNumDays] = useState(3);

  const [programs, setPrograms] = useState(() => {
    const initial = loadProgram();

    // ✅ Normalize on load (preserve progress if present)
    const normalized = (initial || []).map((week) => {
      const newWeek = {};
      Object.keys(week || {}).forEach((dayKey) => {
        newWeek[dayKey] = (week[dayKey] || []).map((wo) => ({
          ...wo,
          completedSets: wo.completedSets ?? 0,
          completed: wo.completed ?? false,
        }));
      });
      return newWeek;
    });

    const firstWeek = normalized[0] || {};
    setNumWeeks(normalized.length || 1);
    setNumDays(Object.keys(firstWeek).length || 3);
    return normalized;
  });

  // ✅ Persist locked state
  const [locked, setLocked] = useState(() => {
    try {
      const saved = localStorage.getItem("programLocked");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (Array.isArray(programs) && programs.length > 0) {
      saveProgram(programs);
    }
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("programLocked", JSON.stringify(locked));
  }, [locked]);

  const updateStructure = (weeks, days, prevProgramsOverride) => {
    if (locked) return;
    setNumWeeks(weeks);
    setNumDays(days);

    setPrograms((prev) => {
      const base = prevProgramsOverride || prev;
      const newPrograms = [];

      for (let w = 0; w < weeks; w++) {
        const prevWeek = base[w] || {};
        const newWeek = {};

        for (let d = 1; d <= days; d++) {
          const workouts = prevWeek[d] || [];
          newWeek[d] = workouts.map((wo) => ({
            ...wo,
            completedSets: wo.completedSets ?? 0,
            completed: wo.completed ?? false,
          }));
        }

        newPrograms.push(newWeek);
      }

      saveProgram(newPrograms);
      return newPrograms;
    });
  };

  const addWorkout = (dayNumber, workout, weekIndex = 0) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const week = updated[weekIndex] || {};
      const dayKey = String(dayNumber);

      if (!Array.isArray(week[dayKey])) {
        week[dayKey] = [];
      }

      const alreadyExists = week[dayKey].some((w) => w.id === workout.id);
      if (alreadyExists) {
        console.warn("Workout already exists:", workout.id);
        return prev;
      }

      const normalizedWorkout = {
        ...workout,
        completedSets: 0,
        completed: false,
      };

      week[dayKey] = [...week[dayKey], normalizedWorkout];
      updated[weekIndex] = week;
      saveProgram(updated);
      return updated;
    });
  };

  const deleteWorkout = (dayNumber, workoutId, weekIndex = 0) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const week = updated[weekIndex] || {};
      const dayKey = String(dayNumber);

      if (Array.isArray(week[dayKey])) {
        week[dayKey] = week[dayKey].filter((w) => w.id !== workoutId);
        updated[weekIndex] = week;
        saveProgram(updated);
      }

      return updated;
    });
  };

  const updateWorkout = (dayNumber, updatedWorkout, weekIndex = 0) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const week = updated[weekIndex] || {};
      const dayKey = String(dayNumber);

      if (Array.isArray(week[dayKey])) {
        week[dayKey] = week[dayKey].map((w) =>
          w.id === updatedWorkout.id
            ? {
                ...updatedWorkout,
                completedSets: updatedWorkout.completedSets ?? 0,
                completed: updatedWorkout.completed ?? false,
              }
            : w
        );
        updated[weekIndex] = week;
        saveProgram(updated);
      }

      return updated;
    });
  };

  const updateProgress = (weekIndex, dayNumber, workoutIndex, setNumber) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const week = updated[weekIndex] || {};
      const dayKey = String(dayNumber);
      const workouts = week[dayKey] || [];
      const workout = workouts[workoutIndex];

      if (workout) {
        const completed = workout.completedSets || 0;
        workout.completedSets = Math.max(completed, setNumber);

        if (workout.completedSets >= workout.sets) {
          workout.completed = true;
        }

        workouts[workoutIndex] = workout;
        week[dayKey] = workouts;
        updated[weekIndex] = week;
        saveProgram(updated);
      }

      return updated;
    });
  };

  return (
    <ProgramContext.Provider
      value={{
        programs,
        setPrograms,
        numWeeks,
        numDays,
        updateStructure,
        addWorkout,
        deleteWorkout,
        updateWorkout,
        updateProgress,
        locked,
        setLocked,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);
