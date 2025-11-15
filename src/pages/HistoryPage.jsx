import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProgram } from "../context/ProgramContext";
import HistoryFilters from "../components/HistoryFilters";
import HistoryEntry from "../components/HistoryEntry";
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

  const [openEntryId, setOpenEntryId] = useState(null);
  const [closingEntryId, setClosingEntryId] = useState(null);

  const toggleEntry = (id) => {
    if (openEntryId === id) {
      setClosingEntryId(id);
      setTimeout(() => {
        setOpenEntryId(null);
        setClosingEntryId(null);
      }, 300);
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
      .filter((entry) =>
        filterWeek === "all" ? true : entry.weekIndex + 1 === Number(filterWeek)
      )
      .filter((entry) => {
        if (filterDay === "all") return true;
        const entryDay = normalizeDayNumber(entry.dayNumber);
        const selectedDay = normalizeDayNumber(filterDay);
        if (selectedDay === null || entryDay === null) return false;
        return entryDay === selectedDay;
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
  aria-expanded={filtersOpen}
>
  <span className="label">Filters</span>
  <span className="chevron-wrapper">
    <svg
      className="chevron"
      data-state={filtersOpen ? "up" : "down"}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M8 10l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
</button>



      {(filtersOpen || closingFilters) && (
        <HistoryFilters
          numWeeks={numWeeks}
          filterWeek={filterWeek}
          setFilterWeek={setFilterWeek}
          filterDay={filterDay}
          setFilterDay={setFilterDay}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          availableDays={availableDays}
          clearFilters={clearFilters}
          filtersOpen={filtersOpen}
          closingFilters={closingFilters}
        />
      )}

      {filteredHistory.length === 0 && (
        <div className="empty-state">
          <p>No history yet.</p>
          <p className="hint">Your workouts will appear here once logged 💪</p>
        </div>
      )}

      {filteredHistory.map((entry) => (
        <HistoryEntry
          key={entry.id}
          entry={entry}
          isOpen={openEntryId === entry.id}
          isClosing={closingEntryId === entry.id}
          toggleEntry={toggleEntry}
          recallDayFromHistory={recallDayFromHistory}
          deleteHistoryEntry={deleteHistoryEntry}
          navigate={navigate}
        />
      ))}
    </div>
  );
}
