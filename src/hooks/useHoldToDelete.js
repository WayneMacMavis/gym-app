// src/hooks/useHoldToDelete.js
import { useState, useRef } from "react";

export const useHoldToDelete = (onDelete, holdDuration = 2000) => {
  const [holdingId, setHoldingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);

  const handleHoldStart = (id) => {
    setHoldingId(id);
    setProgress(0);
    const start = Date.now();

    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / holdDuration) * 100, 100));
    }, 50);

    holdTimer.current = setTimeout(() => {
      onDelete(id);
      setHoldingId(null);
      setProgress(0);
    }, holdDuration);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    setHoldingId(null);
    setProgress(0);
  };

  return { holdingId, progress, handleHoldStart, handleHoldEnd };
};
