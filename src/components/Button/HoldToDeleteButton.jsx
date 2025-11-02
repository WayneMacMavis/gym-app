// src/components/HoldToDeleteButton.jsx
import React, { useRef, useState } from "react";
import "./HoldToDeleteButton.scss";

/**
 * HoldToDeleteButton
 *
 * Props:
 * - onConfirm: function to call after hold completes
 * - disabled: boolean to disable the button
 * - confirmMessage: string for success toast
 * - cancelMessage: string for cancel toast
 * - children: button label (e.g. "🗑 Hold to Delete")
 */
export default function HoldToDeleteButton({
  onConfirm,
  disabled = false,
  confirmMessage = "Deleted ✅",
  cancelMessage = "Delete cancelled ⚠️",
  children,
}) {
  const timers = useRef({});
  const [active, setActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState(null);

  const showToast = (msg, type) => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => {
      setToast(null);
      setToastType(null);
    }, 2500);
  };

  const handlePress = () => {
    if (disabled) return;
    setActive(true);
    timers.current.timeout = setTimeout(() => {
      showToast(confirmMessage, "success");
      setActive(false);
      timers.current.timeout = null;

      // Delay actual confirm so toast paints before unmount
      setTimeout(() => {
        if (onConfirm) onConfirm();
      }, 300);
    }, 2000);
  };

  const handleRelease = () => {
    if (timers.current.timeout) {
      clearTimeout(timers.current.timeout);
      timers.current.timeout = null;
      if (active) {
        showToast(cancelMessage, "cancel");
      }
    }
    setActive(false);
  };

  return (
    <>
      <button
        className={`delete-btn ${active ? "progress" : ""}`}
        disabled={disabled}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
      >
        {children || "🗑 Hold to Delete"}
        {active && <span className="progress-bar"></span>}
      </button>

      {toast && <div className={`toast ${toastType}`}>{toast}</div>}
    </>
  );
}
