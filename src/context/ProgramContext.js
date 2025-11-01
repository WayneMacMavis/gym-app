// src/context/ProgramContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import { loadProgram, saveProgram } from "../utils/storage";

const ProgramContext = createContext();

// ✅ Helper: always use string day keys
const getDayKey = (d) => String(d);

export const ProgramProvider = ({ children }) => {
  const [numWeeks, setNumWeeks] = useState(1);
  const [numDays, setNumDays] = useState(3);

  const [programs, setPrograms] = useState(() => {
    const initial = loadProgram();

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

  const [locked, setLocked] = useState(() => {
    try {
      const saved = localStorage.getItem("programLocked");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("workoutHistory")) || [];
    } catch {
      return [];
    }
  });

  // ✅ Deduplicate history whenever it changes
  useEffect(() => {
    if (!Array.isArray(history)) return;

    const seen = new Set();
    const deduped = history.filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    });

    if (deduped.length !== history.length) {
      console.log("Deduplicated history:", history.length, "→", deduped.length);
      setHistory(deduped);
      localStorage.setItem("workoutHistory", JSON.stringify(deduped));
    }
  }, [history]); // 👈 include history here

  useEffect(() => {
    if (Array.isArray(programs) && programs.length > 0) {
      saveProgram(programs);
    }
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("programLocked", JSON.stringify(locked));
  }, [locked]);

  // ✅ Save a day’s workouts into history (replace last if same day/workouts)
  const saveDayToHistory = (weekIndex, dayNumber) => {
    const week = programs[weekIndex] || {};
    const dayKey = getDayKey(dayNumber);
    const workouts = week[dayKey] || [];

    const date = new Date().toISOString().split("T")[0];
    const ids = workouts.map((w) => w.id).join(",");

    const entry = {
      id: Date.now(),
      date,
      workouts: workouts.map((w) => ({ ...w })),
    };

    setHistory((prev) => {
      const last = prev[prev.length - 1];
      const lastIds = last ? (last.workouts || []).map((w) => w.id).join(",") : null;

      let updated;
      if (last && last.date === date && lastIds === ids) {
        // replace last entry with the new snapshot
        updated = [...prev.slice(0, -1), entry];
      } else {
        updated = [...prev, entry];
      }

      localStorage.setItem("workoutHistory", JSON.stringify(updated));
      return updated;
    });

    console.log("saveDayToHistory saved", entry.id);
  };

  // ✅ Delete a history entry by id
  const deleteHistoryEntry = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      localStorage.setItem("workoutHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const recallDayFromHistory = (entry, weekIndex = 0, dayNumber = 1) => {
    setPrograms((prev) => {
      const updated = [...prev];
      const week = updated[weekIndex] || {};
      const dayKey = getDayKey(dayNumber);

      week[dayKey] = (entry.workouts || []).map((wo) => ({
        ...wo,
        completedSets: wo.completedSets ?? 0,
        completed: wo.completed ?? false,
      }));

      updated[weekIndex] = week;
      saveProgram(updated);
      return updated;
    });
  };

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
          const dayKey = getDayKey(d);
          const workouts = prevWeek[dayKey] || [];
          newWeek[dayKey] = workouts.map((wo) => ({
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
      const dayKey = getDayKey(dayNumber);

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
      const dayKey = getDayKey(dayNumber);

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
      const dayKey = getDayKey(dayNumber);

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
      const dayKey = getDayKey(dayNumber);
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
        history,
        saveDayToHistory,
        recallDayFromHistory,
        deleteHistoryEntry, // ✅ exposed for HistoryPage
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);
