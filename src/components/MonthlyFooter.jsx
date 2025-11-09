import React, { useState, useMemo } from "react";
import "./MonthlyFooter.scss";

export default function MonthlyFooter({ monthlyTotals }) {
  const sorted = useMemo(() => {
    return (monthlyTotals || [])
      .slice()
      .sort((a, b) => new Date(a.sortKey) - new Date(b.sortKey));
  }, [monthlyTotals]);

  const grandTotals = useMemo(() => {
    return (sorted || []).reduce(
      (acc, m) => {
        acc.sets += m.sets || 0;
        acc.reps += m.reps || 0;
        acc.weight += m.weight || 0;
        acc.duration += m.duration || 0;
        return acc;
      },
      { sets: 0, reps: 0, weight: 0, duration: 0 }
    );
  }, [sorted]);

  const [currentIndex, setCurrentIndex] = useState(
    sorted.length > 0 ? sorted.length - 1 : 0
  );
  const [showLifetime, setShowLifetime] = useState(false);

  if (sorted.length === 0) return null;

  const latestIndex = sorted.length - 1;
  const current = sorted[currentIndex];

  const goPrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const goNext = () => currentIndex < latestIndex && setCurrentIndex(currentIndex + 1);

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <footer className="overview-footer">
      <button
        className="toggle-view-btn"
        onClick={() => setShowLifetime((prev) => !prev)}
      >
        {showLifetime ? "Show Monthly View" : "Show Lifetime Totals"}
      </button>

      {!showLifetime ? (
        <div className="month-row">
          <button
            className="footer-arrow left"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous month"
          >
            ◀
          </button>

          <div key={current.sortKey} className="footer-summary fade-slide">
            <MonthSelect
              months={sorted.map((m) => m.month)}
              valueIndex={currentIndex}
              onChangeIndex={setCurrentIndex}
            />
            <p>Total Sets: {current.sets}</p>
            <p>Total Reps: {current.reps}</p>
            <p>Total Weight: {current.weight} kg</p>
            <p>Total Time: {formatDuration(current.duration || 0)}</p>
          </div>

          <button
            className="footer-arrow right"
            onClick={goNext}
            disabled={currentIndex === latestIndex}
            aria-label="Next month"
          >
            ▶
          </button>
        </div>
      ) : (
        <div className="footer-grand-totals fade-slide">
          <h4>All Months Combined</h4>
          <p>Total Sets: {grandTotals.sets}</p>
          <p>Total Reps: {grandTotals.reps}</p>
          <p>Total Weight: {grandTotals.weight} kg</p>
          <p>Total Time: {formatDuration(grandTotals.duration || 0)}</p>
        </div>
      )}
    </footer>
  );
}

function MonthSelect({ months, valueIndex, onChangeIndex }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`month-select ${open ? "open" : ""}`}>
      <button
        type="button"
        className="month-select__button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="month-listbox"
      >
        {months[valueIndex]}
        <span className="chevron" aria-hidden="true">▼</span>
      </button>

      {open && (
        <ul
          id="month-listbox"
          role="listbox"
          tabIndex={0}
          className="month-select__menu"
          aria-activedescendant={`month-opt-${valueIndex}`}
        >
          {months.map((m, idx) => (
            <li
              key={m}
              id={`month-opt-${idx}`}
              role="option"
              aria-selected={idx === valueIndex}
              className={`month-select__option ${idx === valueIndex ? "selected" : ""}`}
              onClick={() => {
                onChangeIndex(idx);
                setOpen(false);
              }}
            >
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
