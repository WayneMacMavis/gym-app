// src/components/NumberAdjuster.jsx
// Forces half-step increments for weights when suffix === "kg". Sets/reps default to 1.
// Moves exactly one grid step up/down from the current value, independent of prior rounding.

import React, { useState, useMemo } from "react";
import { useProgram } from "../context/ProgramContext";
import "./NumberAdjuster.scss";

const NumberAdjuster = ({
  value,
  min = 0,
  onChange,
  suffix,
  size = "md",
  maxDigits = 2,
  step, // optional override
}) => {
  const [shake, setShake] = useState(false);
  const { locked } = useProgram();

  // Infer step: explicit prop wins, else 0.5 for kg, else 1
  const computedStep = useMemo(() => {
    if (typeof step === "number" && !Number.isNaN(step)) return step;
    return suffix === "kg" ? 0.5 : 1;
  }, [step, suffix]);

  // Coerce value to number safely
  const numericValue = useMemo(() => {
    const v = typeof value === "string" ? value.replace(",", ".") : value;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }, [value]);

  // Move exactly one grid step, independent of prior rounding artifacts
  const stepUp = (current, s) => {
    const k = Math.floor(current / s) + 1;
    return k * s;
  };
  const stepDown = (current, s) => {
    const k = Math.ceil(current / s) - 1;
    return k * s;
  };

  const increment = () => {
    if (locked) return;
    const next = stepUp(numericValue, computedStep);
    onChange(Number(next.toFixed(2)));
  };

  const decrement = () => {
    if (locked) return;
    const next = stepDown(numericValue, computedStep);
    if (next >= min) {
      onChange(Number(next.toFixed(2)));
    } else {
      setShake(true);
      if (navigator.vibrate) navigator.vibrate(100);
      setTimeout(() => setShake(false), 300);
    }
  };

  return (
    <div className={`number-adjuster ${locked ? "locked" : ""}`}>
      <div className="value-group">
        <span
          className="digits"
          style={{
            minWidth: `${maxDigits}ch`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {numericValue}
        </span>
        {suffix && <span className="unit">{suffix}</span>}
      </div>
      <div className="arrows">
        <button
          type="button"
          className={`arrow up ${size}`}
          onClick={increment}
          aria-label="Increase"
          disabled={locked}
        >
          ▲
        </button>
        <button
          type="button"
          className={`arrow down ${size} ${shake ? "shake" : ""}`}
          onClick={decrement}
          aria-label="Decrease"
          disabled={locked}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default NumberAdjuster;
