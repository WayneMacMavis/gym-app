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

  // ✅ Deduplicate history by semantic key, not just entry.id
  useEffect(() => {
    if (!Array.isArray(history)) return;

    const seen = new Set();
    const deduped = history.filter((entry) => {
      const key = `${entry.date}-${entry.weekIndex}-${entry.dayNumber}-${(entry.workouts || [])
        .map((w) => w.id)
        .join(",")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (deduped.length !== history.length) {
      setHistory(deduped);
      localStorage.setItem("workoutHistory", JSON.stringify(deduped));
    }
  }, [history]);

  useEffect(() => {
    if (Array.isArray(programs) && programs.length > 0) {
      saveProgram(programs);
    }
  }, [programs]);

  useEffect(() => {
    localStorage.setItem("programLocked", JSON.stringify(locked));
  }, [locked]);

  // ✅ Save a day’s workouts into history (append unless truly identical session)
  const saveDayToHistory = (weekIndex, dayNumber) => {
    const week = programs[weekIndex] || {};
    const dayKey = getDayKey(dayNumber);
    const workouts = week[dayKey] || [];

    const date = new Date().toISOString().split("T")[0];
    const ids = workouts.map((w) => w.id).join(",");

    const entry = {
      id: Date.now(), // unique per save
      date,
      weekIndex,
      dayNumber,
      workouts: workouts.map((w) => ({ ...w })),
    };

    setHistory((prev) => {
      const last = prev[prev.length - 1];
      const lastIds = last ? (last.workouts || []).map((w) => w.id).join(",") : null;

      let updated;
      // 🔧 Only merge if it's the same date, same week/day, AND same workouts
      if (
        last &&
        last.date === date &&
        last.weekIndex === weekIndex &&
        last.dayNumber === dayNumber &&
        lastIds === ids
      ) {
        updated = [...prev.slice(0, -1), entry];
      } else {
        updated = [...prev, entry];
      }

      localStorage.setItem("workoutHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteHistoryEntry = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((entry) => entry.id !== id);
      localStorage.setItem("workoutHistory", JSON.stringify(updated));
      return updated;
    });
  };

  // 🔧 Forward‑aware recall
  const recallDayFromHistory = (entry, startWeekIndex = 0, dayNumber = 1) => {
    setPrograms((prev) => {
      const updated = prev.map((week, wIndex) => {
        if (wIndex < startWeekIndex) return week; // skip earlier weeks

        const dayKey = getDayKey(dayNumber);

        return {
          ...week,
          [dayKey]: (entry.workouts || []).map((wo) => ({
            ...wo,
            completedSets: wo.completedSets ?? 0,
            completed: wo.completed ?? false,
          })),
        };
      });

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

  // 🔧 Forward‑propagation helpers
  const addWorkoutForward = (startWeekIndex, dayNumber, workout) => {
    setPrograms((prev) => {
      const updated = prev.map((week, wIndex) => {
        if (wIndex < startWeekIndex) return week;

        const dayKey = getDayKey(dayNumber);
        const workouts = week[dayKey] || [];

        if (workouts.some((w) => w.id === workout.id)) return week;

        const normalizedWorkout = {
          ...workout,
          completedSets: 0,
          completed: false,
        };

        return {
          ...week,
          [dayKey]: [...workouts, normalizedWorkout],
        };
      });

      saveProgram(updated);
      return updated;
    });
  };

  const updateWorkoutForward = (startWeekIndex, dayNumber, updatedWorkout) => {
    setPrograms((prev) => {
      const updated = prev.map((week, wIndex) => {
        if (wIndex < startWeekIndex) return week;

        const dayKey = getDayKey(dayNumber);
        const workouts = week[dayKey] || [];

        return {
          ...week,
          [dayKey]: workouts.map((w) =>
            w.id === updatedWorkout.id
              ? {
                  ...updatedWorkout,
                  completedSets: updatedWorkout.completedSets ?? 0,
                  completed: updatedWorkout.completed ?? false,
                }
              : w
          ),
        };
      });

      saveProgram(updated);
      return updated;
    });
  };

  const deleteWorkoutForward = (startWeekIndex, dayNumber, workoutId) => {
    setPrograms((prev) => {
      const updated = prev.map((week, wIndex) => {
        if (wIndex < startWeekIndex) return week;

        const dayKey = getDayKey(dayNumber);
        const workouts = week[dayKey] || [];

        return {
          ...week,
          [dayKey]: workouts.filter((w) => w.id !== workoutId),
        };
      });

      saveProgram(updated);
      return updated;
    });
  };

  const updateProgressForward = (startWeekIndex, dayNumber, workoutId, setNumber) => {
    setPrograms((prev) => {
      const updated = prev.map((week, wIndex) => {
        if (wIndex < startWeekIndex) return week;

        const dayKey = getDayKey(dayNumber);
        const workouts = week[dayKey] || [];

        const newWorkouts = workouts.map((w) => {
          if (w.id !== workoutId) return w;

          const completed = w.completedSets || 0;
          const updatedSets = Math.max(completed, setNumber);

          return {
            ...w,
            completedSets: updatedSets,
            completed: updatedSets >= w.sets,
          };
        });

        return { ...week, [dayKey]: newWorkouts };
      });

      saveProgram(updated);
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

        // Forward helpers
        addWorkoutForward,
        updateWorkoutForward,
        deleteWorkoutForward,
        updateProgressForward,

        // ✅ Forward‑aware recall
        recallDayFromHistory,

        locked,
        setLocked,
        history,
        saveDayToHistory,
        deleteHistoryEntry,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => useContext(ProgramContext);
