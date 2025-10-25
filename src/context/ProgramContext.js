// src/context/ProgramContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { loadProgram, saveProgram } from "../utils/storage";

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [numWeeks, setNumWeeks] = useState(1);
  const [numDays, setNumDays] = useState(3);

  const [programs, setPrograms] = useState(() => {
    const initial = loadProgram(); // ✅ loads full array from storage
    const firstWeek = initial[0] || {};
    setNumWeeks(initial.length || 1);
    setNumDays(Object.keys(firstWeek).length || 3);
    return initial;
  });

  // ✅ Lock state persisted in localStorage
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
      saveProgram(programs); // ✅ saves full array
    }
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("programLocked", JSON.stringify(locked));
  }, [locked]);

  // ✅ Update structure but preserve existing workouts
  const updateStructure = (weeks, days, prevProgramsOverride) => {
    if (locked) return; // prevent changes when locked
    setNumWeeks(weeks);
    setNumDays(days);

    setPrograms((prev) => {
      const base = prevProgramsOverride || prev;
      const newPrograms = [];

      for (let w = 0; w < weeks; w++) {
        const prevWeek = base[w] || {};
        const newWeek = {};

        for (let d = 1; d <= days; d++) {
          // ✅ Preserve existing workouts if available
          newWeek[d] = prevWeek[d] || [];
        }

        newPrograms.push(newWeek);
      }

      saveProgram(newPrograms);
      return newPrograms;
    });
  };

  // ✅ Workouts remain editable regardless of lock
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

      week[dayKey] = [...week[dayKey], workout];
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
          w.id === updatedWorkout.id ? updatedWorkout : w
        );
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
        locked,
        setLocked, // ✅ expose lock state
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);
