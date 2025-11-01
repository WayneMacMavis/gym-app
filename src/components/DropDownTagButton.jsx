// src/components/DropDownTagButton.jsx
// - Mobile button layout: time centered on line 1, status on line 2
// - Phase logic cycles workouts without tick/progress logic
// - Completion flash + optional confetti
// - Floating timer unchanged

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useProgram } from "../context/ProgramContext";
import { useDayEstimates } from "../hooks/useDayEstimates";
import "./DropDownTagButton.scss";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Wake Lock helpers
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        console.log("Wake lock released");
      });
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}
function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

const DropDownTagButton = ({
  label = "Start Workout",
  weekIndex = 0,
  dayNumber = 1,
  totalMinutes, // optional, used in floating badge
  onClick,
}) => {
  // Pull in history save action from context
  const { programs, locked, setLocked, saveDayToHistory } = useProgram();
  const { totalSeconds } = useDayEstimates(weekIndex, dayNumber);

  const workouts = useMemo(
    () => programs?.[weekIndex]?.[dayNumber] || [],
    [programs, weekIndex, dayNumber]
  );

  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(locked);
  const [elapsed, setElapsed] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(null);

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState("work");

  const [pos, setPos] = useState({ x: 20, y: 80 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const groupRef = useRef(null);
  const btnRef = useRef(null);

  const [completed, setCompleted] = useState(false);

  // ✅ Guard to prevent multiple stop/save calls
  const stoppingRef = useRef(false);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem("workoutStart");
    if (saved) {
      setStartTimestamp(Number(saved));
      setLocked(true);
    }
  }, [setLocked]);

  // Sync running with locked
  useEffect(() => {
    setRunning(locked);
  }, [locked]);

  // Keep arrow slide aligned to button height
  useLayoutEffect(() => {
    if (!btnRef.current || !groupRef.current) return;
    const btnH = Math.ceil(btnRef.current.getBoundingClientRect().height);
    groupRef.current.style.setProperty("--btn-h", `${btnH}px`);
  }, [label, running, elapsed, phase, currentWorkoutIndex, currentSet, completed]);

  // Stop workflow (guarded)
  const stopWorkout = useCallback(() => {
    if (stoppingRef.current) {
      console.log("stopWorkout skipped: already stopping");
      return;
    }
    stoppingRef.current = true;

    setLocked(false);
    localStorage.removeItem("workoutStart");
    releaseWakeLock();
    setElapsed(0);
    setCurrentWorkoutIndex(0);
    setCurrentSet(1);
    setPhase("work");

    // Save this day’s workouts into history
    saveDayToHistory(weekIndex, dayNumber);

    setCompleted(true);
    const t = setTimeout(() => {
      setCompleted(false);
      stoppingRef.current = false;
    }, 2000);
    return () => {
      clearTimeout(t);
      stoppingRef.current = false;
    };
  }, [setLocked, saveDayToHistory, weekIndex, dayNumber]);

  // Button click
  const handleButtonClick = () => {
    if (!locked) {
      const now = Date.now();
      setStartTimestamp(now);
      localStorage.setItem("workoutStart", now.toString());

      setElapsed(0);
      setCurrentWorkoutIndex(0);
      setCurrentSet(1);
      setPhase("work");

      setLocked(true);
      requestWakeLock();
      onClick?.();
    } else {
      stopWorkout();
    }
  };

  const handleArrowClick = () => setOpen((p) => !p);

  // Visibility wake lock
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && locked) {
        requestWakeLock();
      } else {
        releaseWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [locked]);

  // Timer + phase state machine (no tick/progress updates)
  useEffect(() => {
    if (!running || !startTimestamp) return;

    const id = setInterval(tick, 1000);

    function tick() {
      const now = Date.now();
      const seconds = Math.floor((now - startTimestamp) / 1000);

      if (Number.isFinite(totalSeconds) && seconds >= totalSeconds) {
        setElapsed(totalSeconds);
        clearInterval(id);
        stopWorkout();
        return;
      }

      setElapsed(seconds);

      // Simple simulation that advances through phases without updating external progress
      let remaining = seconds;
      let wIndex = 0;
      let setNum = 1;
      let currentPhase = "work";

      while (remaining > 0 && wIndex < workouts.length) {
        const currentWorkout = workouts[wIndex];
        const setLimit = currentWorkout?.sets || 1;

        if (currentPhase === "work") {
          if (remaining >= 60) {
            remaining -= 60;
            if (setNum < setLimit) {
              setNum++;
              currentPhase = "rest";
            } else {
              if (wIndex < workouts.length - 1) {
                setNum = 1;
                currentPhase = "betweenWorkouts";
              } else {
                break;
              }
            }
          } else break;
        } else if (currentPhase === "rest") {
          if (remaining >= 60) {
            remaining -= 60;
            currentPhase = "work";
          } else break;
        } else if (currentPhase === "betweenWorkouts") {
          if (remaining >= 120) {
            remaining -= 120;
            wIndex++;
            currentPhase = "work";
          } else break;
        }
      }

      setCurrentWorkoutIndex(wIndex);
      setCurrentSet(setNum);
      setPhase(currentPhase);
    }

    // initial tick to sync
    tick();
    return () => clearInterval(id);
  }, [running, startTimestamp, totalSeconds, workouts, stopWorkout]);

  // Dragging for floating timer
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const newX = clientX - dragOffset.current.x;
      const newY = clientY - dragOffset.current.y;
      const badgeWidth = 80;
      const badgeHeight = 40;
      setPos({
        x: clamp(newX, 0, window.innerWidth - badgeWidth),
        y: clamp(newY, 0, window.innerHeight - badgeHeight),
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  const currentWorkout = workouts[currentWorkoutIndex];
  let statusLabel = "";
  if (phase === "work" && currentWorkout) {
    statusLabel = `${currentWorkout.name} – Set ${currentSet}`;
  } else if (phase === "rest") {
    statusLabel = `Rest (next: Set ${currentSet})`;
  } else if (phase === "betweenWorkouts") {
    const nextWorkout = workouts[currentWorkoutIndex + 1];
    statusLabel = `Rest (next: ${nextWorkout?.name || "Done"})`;
  }

  return (
    <>
      <div className={`dropdown-tag-button ${open ? "open" : ""}`}>
        <div ref={groupRef} className="button-group">
          <button
            ref={btnRef}
            className={`drop-button ${phase} ${completed ? "completed" : ""}`}
            onClick={handleButtonClick}
          >
            {completed && (
              <>
                Workout Complete!
                <div className="confetti">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} style={{ "--i": i }} />
                  ))}
                </div>
              </>
            )}

            {!running && !completed && label}

            {running && (
              <div className="button-content">
                <div className="time-line">
                  {minutes}:{seconds}
                </div>
                {statusLabel && (
                  <div className={`status-line ${phase}`}>{statusLabel}</div>
                )}
              </div>
            )}
          </button>

          <div className="arrow" onClick={handleArrowClick} aria-label="toggle">
            ▼
          </div>

          {/* If you render dropdown content, keep it here */}
          {/* <div className="dropdown-content"> ... </div> */}
        </div>
      </div>

      {running && (
        <div
          className={`floating-timer draggable ${phase}`}
          style={{ left: pos.x, top: pos.y }}
          onMouseDown={(e) => {
            setDragging(true);
            dragOffset.current = {
              x: e.clientX - pos.x,
              y: e.clientY - pos.y,
            };
          }}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              setDragging(true);
              dragOffset.current = {
                x: e.touches[0].clientX - pos.x,
                y: e.touches[0].clientY - pos.y,
              };
            }
          }}
        >
          <div className="floating-time">
            {minutes}:{seconds}
            {typeof totalMinutes === "number" && totalMinutes > 0 && (
              <span className="total-estimate"> / {totalMinutes}m</span>
            )}
          </div>
          {statusLabel && (
            <div className={`floating-phase ${phase}`}>{statusLabel}</div>
          )}
        </div>
      )}
    </>
  );
};

export default DropDownTagButton;
