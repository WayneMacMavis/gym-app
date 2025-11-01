// src/pages/HistoryPage.jsx

import React, { useRef, useState } from "react";
import { useProgram } from "../context/ProgramContext";
import "./HistoryPage.scss";

export default function HistoryPage() {
  const { history, recallDayFromHistory, deleteHistoryEntry } = useProgram();
  const timers = useRef({});
  const [activeDelete, setActiveDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState(null); // ✅ new

  const handleDeletePress = (id) => {
    setActiveDelete(id);
    timers.current[id] = setTimeout(() => {
      deleteHistoryEntry(id);
      showToast("Workout deleted ✅", "success");
      setActiveDelete(null);
      timers.current[id] = null;
    }, 2000);
  };

  const handleDeleteRelease = (id) => {
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      timers.current[id] = null;
      if (activeDelete === id) {
        showToast("Delete cancelled ⚠️", "cancel");
      }
    }
    setActiveDelete(null);
  };

  const showToast = (message, type) => {
    setToast(message);
    setToastType(type);
    setTimeout(() => {
      setToast(null);
      setToastType(null);
    }, 2500);
  };

  return (
    <>
      <div className="history-page">
        <h2>Workout History</h2>
        {(!history || history.length === 0) && <p>No history yet.</p>}

        {history &&
          history
            .slice()
            .sort((a, b) => b.id - a.id)
            .map((entry) => (
              <div key={entry.id} className="history-entry">
                <div className="history-header">
                  <strong className="history-date">{entry.date}</strong>
                  <div className="history-actions">
                    <button
                      className="recall-btn"
                      onClick={() => recallDayFromHistory(entry, 0, 1)}
                    >
                      ↩ Recall
                    </button>
                    <button
                      className={`delete-btn ${
                        activeDelete === entry.id ? "progress" : ""
                      }`}
                      onMouseDown={() => handleDeletePress(entry.id)}
                      onMouseUp={() => handleDeleteRelease(entry.id)}
                      onMouseLeave={() => handleDeleteRelease(entry.id)}
                      onTouchStart={() => handleDeletePress(entry.id)}
                      onTouchEnd={() => handleDeleteRelease(entry.id)}
                    >
                      🗑 Hold to Delete
                      {activeDelete === entry.id && (
                        <span className="progress-bar"></span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="history-body">
                  <small>{(entry.workouts || []).length} exercise(s)</small>
                  <ul>
                    {(entry.workouts || []).map((w, i) => (
                      <li key={w.id || i}>
                        <strong>{w.name}</strong>
                        <div className="tags">
                          <span className="tag sets">Sets: {w.sets}</span>
                          {w.reps?.length > 0 && (
                            <span className="tag reps">
                              Reps: {w.reps.join(", ")}
                            </span>
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
              </div>
            ))}
      </div>

      {/* ✅ Toast outside list */}
      {toast && <div className={`toast ${toastType}`}>{toast}</div>}
    </>
  );
}
