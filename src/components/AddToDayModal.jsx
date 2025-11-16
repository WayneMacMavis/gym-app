// src/components/AddToDayModal.jsx
import React, { useState } from "react";
import "./AddToDayModal.scss";

const AddToDayModal = ({ workout, onConfirm = () => {}, onClose }) => {
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState(1);

  const handleConfirm = () => {
    if (workout) {
      onConfirm(week, day);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-sheet">
        <header className="modal-header">
          <h2 className="modal-title">Add {workout?.name || "workout"} to routine</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="modal-body">
          <label className="field">
            <span className="label">Select week</span>
            <select value={week} onChange={(e) => setWeek(Number(e.target.value))}>
              {[1, 2, 3, 4].map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">Select day</span>
            <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>Day {d}</option>
              ))}
            </select>
          </label>

          <p className="propagation-note">
            • Adding to Day {day} will update all Day {day}s across weeks. <br />
            • Adding to Day {day} in Week {week} updates Day {day}s from Week {week} onward.
          </p>
        </div>

        <footer className="modal-actions">
          <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default AddToDayModal;
