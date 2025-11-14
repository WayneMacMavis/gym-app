// src/pages/HistoryPage.jsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProgram } from "../context/ProgramContext";
import HoldToDeleteButton from "../components/Button/HoldToDeleteButton";
import "./HistoryPage.scss";

export default function HistoryPage() {
  const {
    history,
    recallDayFromHistory,
    deleteHistoryEntry,
    numWeeks,
  } = useProgram();
  const navigate = useNavigate();

  const [filterWeek, setFilterWeek] = useState("all");
  const [filterDay, setFilterDay] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [closingFilters, setClosingFilters] = useState(false);

  // Track which entry is open
  const [openEntryId, setOpenEntryId] = useState(null);
  const [closingEntryId, setClosingEntryId] = useState(null);

  const toggleEntry = (id) => {
    if (openEntryId === id) {
      // start closing animation
      setClosingEntryId(id);
      setTimeout(() => {
        setOpenEntryId(null);
        setClosingEntryId(null);
      }, 300); // match SCSS animation duration
    } else {
      setOpenEntryId(id);
    }
  };

  const normalizeDayNumber = (d) => {
    const n = Number(d);
    return Number.isFinite(n) ? n : null;
  };

  const availableDays = useMemo(() => {
    const set = new Set();
    (history || []).forEach((h) => {
      const day = normalizeDayNumber(h.dayNumber);
      if (day === null) return;
      if (filterWeek === "all" || h.weekIndex + 1 === Number(filterWeek)) {
        set.add(day);
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [history, filterWeek]);

  const filteredHistory = useMemo(() => {
    return (history || [])
      .filter((entry) => {
        if (filterWeek === "all") return true;
        return entry.weekIndex + 1 === Number(filterWeek);
      })
      .filter((entry) => {
        if (filterDay === "all") return true;
        const entryDay = normalizeDayNumber(entry.dayNumber);
        const selectedDay = normalizeDayNumber(filterDay);
        if (selectedDay === null || entryDay === null) return false;

        if (filterWeek === "all") {
          return entryDay === selectedDay;
        }
        return (
          entryDay === selectedDay &&
          entry.weekIndex + 1 === Number(filterWeek)
        );
      })
      .filter((entry) => (filterDate ? entry.date === filterDate : true))
      .slice()
      .sort((a, b) => b.id - a.id);
  }, [history, filterWeek, filterDay, filterDate]);

  const clearFilters = () => {
    setFilterWeek("all");
    setFilterDay("all");
    setFilterDate("");
  };

  const toggleFilters = () => {
    if (filtersOpen) {
      setClosingFilters(true);
      setTimeout(() => {
        setFiltersOpen(false);
        setClosingFilters(false);
      }, 300);
    } else {
      setFiltersOpen(true);
    }
  };

  return (
    <div className="history-page">
      <h2>Workout History</h2>

      <button
        type="button"
        className="toggle-filters-btn"
        onClick={toggleFilters}
      >
        {filtersOpen ? "Hide Filters ▲" : "Show Filters ▼"}
      </button>

      {(filtersOpen || closingFilters) && (
        <div
          className={`history-filter-box ${
            filtersOpen && !closingFilters ? "open" : "close"
          }`}
        >
          <div className="filter-group">
            <label htmlFor="weekFilter">Week:</label>
            <select
              id="weekFilter"
              value={filterWeek}
              onChange={(e) => {
                setFilterWeek(e.target.value);
                setFilterDay("all");
              }}
            >
              <option value="all">All</option>
              {Array.from({ length: numWeeks }, (_, i) => (
                <option key={i} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dayFilter">Day:</label>
            <select
              id="dayFilter"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
            >
              <option value="all">All</option>
              {availableDays.map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dateFilter">Date:</label>
            <input
              type="date"
              id="dateFilter"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button type="button" className="clear-btn" onClick={clearFilters}>
              ✨ Clear Filters
            </button>
          </div>
        </div>
      )}

      {filteredHistory.length === 0 && <p>No history yet.</p>}

      {filteredHistory.map((entry) => (
        <div key={entry.id} className="history-entry">
          {/* Header shows only the date */}
          <div
            className="history-header"
            onClick={() => toggleEntry(entry.id)}
            style={{ cursor: "pointer" }}
          >
            <strong className="history-date">{entry.date}</strong>
          </div>

          {/* Reveal body only when open */}
          {(openEntryId === entry.id || closingEntryId === entry.id) && (
            <div
              className={`history-body ${
                openEntryId === entry.id ? "open" : "close"
              }`}
            >
              {/* Week/Day badges now inside body */}
              <div className="history-location">
                <span className="week-badge">Week {entry.weekIndex + 1}</span>
                <span className="day-badge">Day {entry.dayNumber}</span>
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

              <small>{(entry.workouts || []).length} exercise(s)</small>
              <ul>
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
        </div>
      ))}
    </div>
  );
}
