// src/components/Button/Button.jsx
import React from "react";
import "./Button.scss";

/**
 * Generic Button component.
 * - Supports variants: primary, secondary, success, danger
 * - Accepts extra className for contextual overrides
 * - If `showProgress` is true, renders an SVG ring sized from --danger-btn-size
 *   and expects a `progress` prop (0–1) to animate the ring.
 */
const Button = ({
  children,
  variant = "primary",
  className = "",
  showProgress = false,
  progress = 0,
  ...props
}) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}

      {showProgress && (
        <svg className="progress-ring">
          <circle
            className="progress-ring__circle"
            style={{ "--progress": progress }}
          />
        </svg>
      )}
    </button>
  );
};

export default Button;
