// DeleteButton.jsx
// Reusable button component with "hold-to-delete" behavior.
// Shows a progress ring while holding, and triggers deletion when complete.

import React from "react";
import Button from "./Button/Button";
import "./DeleteButton.scss";

const DeleteButton = ({
  workoutId,
  holdingId,
  progress,
  handleHoldStart,
  handleHoldEnd,
}) => (
  <Button
    variant="danger"
    className="delete-btn"
    onMouseDown={() => {
      handleHoldStart(workoutId);
      if (navigator.vibrate) navigator.vibrate(50);
    }}
    onMouseUp={handleHoldEnd}
    onMouseLeave={handleHoldEnd}
    onTouchStart={() => {
      handleHoldStart(workoutId);
      if (navigator.vibrate) navigator.vibrate(50);
    }}
    onTouchEnd={handleHoldEnd}
    aria-label="Hold to delete"
    title="Hold to delete"
  >
    <span className="delete-icon">✕</span>
    {holdingId === workoutId && (
      <svg className="progress-ring" width="36" height="36">
        <circle
          className="progress-ring__circle"
          stroke="green"
          strokeWidth="3"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
          style={{
            strokeDasharray: 2 * Math.PI * 16,
            strokeDashoffset:
              2 * Math.PI * 16 - (progress / 100) * (2 * Math.PI * 16),
          }}
        />
      </svg>
    )}
  </Button>
);

export default DeleteButton;
