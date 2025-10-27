/**
 * DropDownTagButton
 * - Arrow sits flush at the top of the viewport.
 * - Clicking the arrow slides down the whole unit (button + arrow).
 * - Slide distance is calculated from the button height so it closes cleanly.
 */
import React, { useLayoutEffect, useRef, useState } from "react";
import "./DropDownTagButton.scss";

const DropDownTagButton = ({ label = "Click Me", onClick }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const arrowRef = useRef(null);
  const groupRef = useRef(null);

  useLayoutEffect(() => {
    const btn = btnRef.current;
    const arrow = arrowRef.current;
    if (!btn || !arrow) return;

    const btnH = btn.offsetHeight;
    const arrowH = arrow.offsetHeight;

    // store heights as CSS variables
    groupRef.current?.style.setProperty("--btn-h", `${btnH}px`);
    groupRef.current?.style.setProperty("--arrow-h", `${arrowH}px`);
  }, [label]);

  return (
    <div className={`dropdown-tag-button ${open ? "open" : ""}`}>
      <div ref={groupRef} className="button-group">
        <button ref={btnRef} className="drop-button" onClick={onClick}>
          {label}
        </button>
        <div ref={arrowRef} className="arrow" onClick={() => setOpen(p => !p)}>
          ▼
        </div>
      </div>
    </div>
  );
};

export default DropDownTagButton;
