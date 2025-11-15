// src/components/HistoryEntry.jsx
import React from "react";
import HoldToDeleteButton from "./Button/HoldToDeleteButton";
import { getRelativeTime } from "../utils/dateHelpers";
import "./HistoryEntry.scss";

function HistoryEntry({
  entry,
  isOpen,
  isClosing,
  toggleEntry,
  recallDayFromHistory,
  deleteHistoryEntry,
  navigate,
}) {
  return (
    <article className="history-entry">
      <header
        className="history-header"
        onClick={() => toggleEntry(entry.id)}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleEntry(entry.id)}
      >
        <div className={`header-row ${isOpen ? "open" : isClosing ? "close" : ""}`}>
          <strong className="history-date">{entry.date}</strong>
          <span className="exercise-pill">
            {(entry.workouts || []).length} exercises
          </span>
          <span className="relative-time">{getRelativeTime(entry.date)}</span>
        </div>
      </header>

      {(isOpen || isClosing) && (
        <div className={`history-body ${isOpen ? "open" : "close"}`}>
          <div className="history-location">
            <span className="badge week">Week {entry.weekIndex + 1}</span>
            <span className="badge day">Day {entry.dayNumber}</span>
          </div>

          <div className="history-actions">
            <button
              className="recall-btn"
              onClick={(e) => {
                e.stopPropagation();
                recallDayFromHistory(entry, entry.weekIndex, entry.dayNumber);
              }}
            >
              ↩ Recall
            </button>

            <button
              className="jump-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/week/${entry.weekIndex + 1}/day/${entry.dayNumber}`);
              }}
            >
              🔗 Jump
            </button>

            <HoldToDeleteButton
              onConfirm={() => deleteHistoryEntry(entry.id)}
              confirmMessage="Workout deleted ✅"
              cancelMessage="Delete cancelled ⚠️"
            >
              🗑 Hold to Delete
            </HoldToDeleteButton>
          </div>

          <ul className="exercise-list">
            {(entry.workouts || []).map((w, i) => (
              <li key={w.id || i}>
                <strong>{w.name}</strong>
                <div className="tags">
                  <span className="tag sets">Sets: {w.sets}</span>
                  {w.reps?.length > 0 && (
                    <span className="tag reps">Reps: {w.reps.join(", ")}</span>
                  )}
                  {w.weights?.length > 0 && (
                    <span className="tag weights">
                      Weights: {w.weights.join(", ")}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

// Memoize to avoid unnecessary re-renders
export default React.memo(HistoryEntry);
