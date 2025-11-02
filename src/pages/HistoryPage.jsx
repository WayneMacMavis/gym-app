// src/pages/HistoryPage.jsx

import React from "react";
import { useProgram } from "../context/ProgramContext";
import HoldToDeleteButton from "../components/Button/HoldToDeleteButton"; // ✅ import reusable button
import "./HistoryPage.scss";

export default function HistoryPage() {
  const { history, recallDayFromHistory, deleteHistoryEntry } = useProgram();

  return (
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

                  <HoldToDeleteButton
                    onConfirm={() => deleteHistoryEntry(entry.id)}
                    confirmMessage="Workout deleted ✅"
                    cancelMessage="Delete cancelled ⚠️"
                  >
                    🗑 Hold to Delete
                  </HoldToDeleteButton>
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
  );
}
