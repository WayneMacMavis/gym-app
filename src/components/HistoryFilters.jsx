import React from "react";
import "./HistoryFilters.scss";

export default function HistoryFilters({
  numWeeks,
  filterWeek,
  setFilterWeek,
  filterDay,
  setFilterDay,
  filterDate,
  setFilterDate,
  availableDays,
  clearFilters,
  filtersOpen,
  closingFilters,
}) {
  return (
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
  );
}
