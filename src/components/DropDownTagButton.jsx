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

const DropDownTagButton = ({
  label = "Start Workout",
  weekIndex = 0,
  dayNumber = 1,
  onClick,
}) => {
  const { programs, updateProgress, setLocked } = useProgram();
  const { totalSeconds } = useDayEstimates(weekIndex, dayNumber);

  const workouts = useMemo(() => {
    return programs?.[weekIndex]?.[dayNumber] || [];
  }, [programs, weekIndex, dayNumber]);

  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState("work");
  const phaseElapsedRef = useRef(0);

  const [pos, setPos] = useState({ x: 20, y: 80 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const groupRef = useRef(null);
  const btnRef = useRef(null);
  const intervalRef = useRef(null);

  useLayoutEffect(() => {
    if (!btnRef.current || !groupRef.current) return;
    const btnH = btnRef.current.offsetHeight;
    groupRef.current.style.setProperty("--btn-h", `${btnH}px`);
  }, [label]);

  const handleButtonClick = () => {
    if (!running) {
      setElapsed(0);
      setPhase("work");
      setCurrentWorkoutIndex(0);
      setCurrentSet(1);
      phaseElapsedRef.current = 0;
      setRunning(true);
      setLocked(true); // ✅ lock program editing
      onClick?.();
    } else {
      setRunning(false);
      clearInterval(intervalRef.current);
      setLocked(false); // ✅ unlock when stopped
    }
  };

  const handleArrowClick = () => setOpen((p) => !p);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalSeconds) {
          clearInterval(intervalRef.current);
          setLocked(false); // unlock at end
          return totalSeconds;
        }
        return prev + 1;
      });

      const nextPhaseElapsed = phaseElapsedRef.current + 1;
      let limit = phase === "work" ? 60 : phase === "rest" ? 60 : 120;

      if (nextPhaseElapsed >= limit) {
        if (phase === "work") {
          const currentWorkout = workouts[currentWorkoutIndex];
          if (currentSet < (currentWorkout?.sets || 1)) {
            updateProgress(weekIndex, dayNumber, currentWorkoutIndex, currentSet);
            setCurrentSet((s) => s + 1);
            setPhase("rest");
          } else {
            updateProgress(weekIndex, dayNumber, currentWorkoutIndex, currentSet);
            if (currentWorkoutIndex < workouts.length - 1) {
              setCurrentWorkoutIndex((i) => i + 1);
              setCurrentSet(1);
              setPhase("betweenWorkouts");
            } else {
              setRunning(false);
              clearInterval(intervalRef.current);
              setLocked(false); // unlock when finished
            }
          }
        } else if (phase === "rest") {
          setPhase("work");
        } else if (phase === "betweenWorkouts") {
          setPhase("work");
        }
        phaseElapsedRef.current = 0;
      } else {
        phaseElapsedRef.current = nextPhaseElapsed;
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [
    running,
    totalSeconds,
    phase,
    currentSet,
    currentWorkoutIndex,
    workouts,
    updateProgress,
    weekIndex,
    dayNumber,
    setLocked,
  ]);

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
                    {" "}
                    — {statusLabel}
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
