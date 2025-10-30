import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useProgram } from "../context/ProgramContext";
import { useDayEstimates } from "../hooks/useDayEstimates";
import "./DropDownTagButton.scss";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// --- Wake Lock helpers ---
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        console.log("Wake lock released");
      });
      console.log("Wake lock active");
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
  onClick,
}) => {
  const { programs, updateProgress, locked, setLocked } = useProgram();
  const { totalSeconds } = useDayEstimates(weekIndex, dayNumber);

  const workouts = useMemo(() => {
    return programs?.[weekIndex]?.[dayNumber] || [];
  }, [programs, weekIndex, dayNumber]);

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

  // Restore startTimestamp on mount
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

  // Update CSS var for button height whenever content changes
  useLayoutEffect(() => {
    if (!btnRef.current || !groupRef.current) return;
    const btnH = Math.ceil(btnRef.current.getBoundingClientRect().height);
    groupRef.current.style.setProperty("--btn-h", `${btnH}px`);
  }, [label, running, elapsed, phase, currentWorkoutIndex, currentSet]);

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
      setLocked(false);
      localStorage.removeItem("workoutStart");
      releaseWakeLock();
    }
  };

  const handleArrowClick = () => setOpen((p) => !p);

  // Re-request wake lock if tab regains focus
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

  // Timer effect: elapsed and phase catch-up
  useEffect(() => {
    if (!running || !startTimestamp) return;

    const tick = () => {
      const now = Date.now();
      const seconds = Math.floor((now - startTimestamp) / 1000);

      if (seconds >= totalSeconds) {
        setElapsed(totalSeconds);
        setLocked(false);
        localStorage.removeItem("workoutStart");
        releaseWakeLock();
        return;
      }

      setElapsed(seconds);

      // Phase catch-up logic
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
            updateProgress(weekIndex, dayNumber, wIndex, setNum);
            if (setNum < setLimit) {
              setNum++;
              currentPhase = "rest";
            } else {
              if (wIndex < workouts.length - 1) {
                wIndex++;
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
            currentPhase = "work";
          } else break;
        }
      }

      setCurrentWorkoutIndex(wIndex);
      setCurrentSet(setNum);
      setPhase(currentPhase);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [
    running,
    startTimestamp,
    totalSeconds,
    workouts,
    updateProgress,
    weekIndex,
    dayNumber,
    setLocked,
  ]);

  // Dragging logic
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
            className={`drop-button ${phase}`}
            onClick={handleButtonClick}
          >
            {!running && label}
            {running && (
              <>
                ({minutes}:{seconds})
                {statusLabel && (
                  <span className={`phase-inline ${phase}`}>
                    {" "}— {statusLabel}
                  </span>
                )}
              </>
            )}
          </button>
          <div className="arrow" onClick={handleArrowClick} aria-label="toggle">
            ▼
          </div>
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
