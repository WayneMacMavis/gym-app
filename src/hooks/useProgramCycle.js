// hooks/useProgramCycle.js
import { useState, useEffect } from "react";

const EIGHT_WEEKS_MS = 1000 * 60 * 60 * 24 * 7 * 8;

export const useProgramCycle = () => {
  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem("programStart");
    return saved ? new Date(saved) : new Date();
  });

  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    const now = new Date();
    if (now - startDate >= EIGHT_WEEKS_MS) {
      setNeedsRefresh(true);
    }
  }, [startDate]);

  const resetCycle = () => {
    const newDate = new Date();
    setStartDate(newDate);
    localStorage.setItem("programStart", newDate.toISOString());
    setNeedsRefresh(false);
  };

  return { startDate, needsRefresh, resetCycle };
};
