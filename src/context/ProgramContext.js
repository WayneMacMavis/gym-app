import React, { createContext, useContext, useState, useEffect } from "react";
import { loadProgram, saveProgram } from "../utils/storage";

const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [numWeeks, setNumWeeks] = useState(1);
  const [numDays, setNumDays] = useState(3);

  const [programs, setPrograms] = useState(() => {
    const initial = loadProgram(); // ✅ loads full array
    const firstWeek = initial[0] || {};
    setNumWeeks(initial.length || 1);
    setNumDays(Object.keys(firstWeek).length || 3);
    return initial;
  });

  useEffect(() => {
    if (Array.isArray(programs) && programs.length > 0) {
      saveProgram(programs); // ✅ saves full array
    }
  }, [programs]);

  const updateStructure = (weeks, days) => {
    setNumWeeks(weeks);
    setNumDays(days);

    const newPrograms = [];

    for (let w = 0; w < weeks; w++) {
      const week = {};
      for (let d = 1; d <= days; d++) {
        week[d] = [];
      }
      newPrograms.push(week);
    }

    setPrograms(newPrograms);
    saveProgram(newPrograms); // ✅ save all weeks
  };

  const addWorkout = (dayNumber, workout) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const dayKey = String(dayNumber);

      if (!Array.isArray(updated[0][dayKey])) {
        updated[0][dayKey] = [];
      }

      const alreadyExists = updated[0][dayKey].some((w) => w.id === workout.id);
      if (alreadyExists) {
        console.warn("Workout already exists:", workout.id);
        return prev;
      }

      updated[0][dayKey] = [...updated[0][dayKey], workout];
      saveProgram(updated);
      return updated;
    });
  };

  const deleteWorkout = (dayNumber, workoutId) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const dayKey = String(dayNumber);

      if (Array.isArray(updated[0][dayKey])) {
        updated[0][dayKey] = updated[0][dayKey].filter((w) => w.id !== workoutId);
        saveProgram(updated);
      }

      return updated;
    });
  };

  const updateWorkout = (dayNumber, updatedWorkout) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const dayKey = String(dayNumber);

      if (Array.isArray(updated[0][dayKey])) {
        updated[0][dayKey] = updated[0][dayKey].map((w) =>
          w.id === updatedWorkout.id ? updatedWorkout : w
        );
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
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);
