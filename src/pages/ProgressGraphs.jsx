// src/pages/ProgressGraphs.jsx
// Mobile-first progress graphs with:
// - Weekly / Session / Monthly shaping
// - Segmented control
// - Accordion per workout
// - Metric toggle (All | Sets | Reps | Weight)
// - Fixed info card (no tooltips)
// - Summary sparkline always visible
// - Staggered animations for chart and info card (sparkline not gated)

import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { useProgram } from "../context/ProgramContext";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ProgressGraphs.scss";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Inline summary chart (sparkline)
function Sparkline({ data, labels, color }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };
  return (
    <div className="sparkline">
      <Line data={chartData} options={options} />
    </div>
  );
}

function WorkoutGraphPanel({ name, data, viewMode, isMobile }) {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [metric, setMetric] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  // Labels
  const labels =
    viewMode === "weekly"
      ? data.map((w) => (isMobile ? `W${w.weekIndex + 1}` : `Week ${w.weekIndex + 1}`))
      : viewMode === "sessions"
      ? data.map((d) =>
          new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        )
      : data.map((m) => m.month);

  // Series
  const setsData = data.map((d) => d.sets ?? 0);
  const repsData = data.map((d) => d.reps ?? 0);
  const weightData = data.map((d) => d.weight ?? 0);

  // Line colors (use SCSS tokens in CSS variables if you expose them; fallback hex used here)
  const COLORS = {
    sets: "#1f77b4",
    reps: "#2ca02c",
    weight: "#e74c3c",
  };

  const datasetsAll = [
    {
      label: "Sets",
      data: setsData,
      borderColor: COLORS.sets,
      backgroundColor: COLORS.sets,
      tension: 0.25,
      pointRadius: isMobile ? 2 : 3,
      hitRadius: isMobile ? 12 : 8,
      hoverRadius: isMobile ? 6 : 5,
    },
    {
      label: "Reps",
      data: repsData,
      borderColor: COLORS.reps,
      backgroundColor: COLORS.reps,
      tension: 0.25,
      pointRadius: isMobile ? 2 : 3,
      hitRadius: isMobile ? 12 : 8,
      hoverRadius: isMobile ? 6 : 5,
    },
    {
      label: "Weight (kg)",
      data: weightData,
      borderColor: COLORS.weight,
      backgroundColor: COLORS.weight,
      tension: 0.25,
      pointRadius: isMobile ? 2 : 3,
      hitRadius: isMobile ? 12 : 8,
      hoverRadius: isMobile ? 6 : 5,
    },
  ];

  const datasetsSingle =
    metric === "sets" ? [datasetsAll[0]] :
    metric === "reps" ? [datasetsAll[1]] :
    metric === "weight" ? [datasetsAll[2]] :
    datasetsAll;

  const chartData = { labels, datasets: datasetsSingle };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: `${name} Progress`, font: { size: isMobile ? 14 : 18 } },
      legend: { display: true, position: isMobile ? "top" : "bottom" },
      tooltip: { enabled: false }, // fixed info card for mobile reliability
    },
    animation: { duration: 300, easing: "easeOutQuart" },
    onClick: (evt, elements) => {
      if (!elements.length) return;
      const idx = elements[0].index;
      setSelectedPoint(data[idx]);
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxRotation: 0, font: { size: isMobile ? 9 : 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: isMobile ? 9 : 12 } },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  // Sparkline dataset + color (summary should reflect the active metric; use weight when "all")
  const sparklineData =
    metric === "sets" ? setsData :
    metric === "reps" ? repsData :
    metric === "weight" ? weightData :
    weightData;

  const sparklineColor =
    metric === "sets" ? COLORS.sets :
    metric === "reps" ? COLORS.reps :
    metric === "weight" ? COLORS.weight :
    COLORS.weight;

  return (
    <details
      className="graph-panel"
      open={isOpen}
      onToggle={(e) => setIsOpen(e.target.open)}
    >
      <summary>
        <span className="graph-title">{name}</span>
        {/* Sparkline always visible in summary */}
        <Sparkline data={sparklineData} labels={labels} color={sparklineColor} />
        <span className="chevron" aria-hidden="true">▾</span>
      </summary>

      {/* Metric toggle */}
      <div className="metric-toggle" role="tablist" aria-label={`${name} metric selection`}>
        <button className={metric === "all" ? "active" : ""} onClick={() => setMetric("all")} type="button">All</button>
        <button className={metric === "sets" ? "active" : ""} onClick={() => setMetric("sets")} type="button">Sets</button>
        <button className={metric === "reps" ? "active" : ""} onClick={() => setMetric("reps")} type="button">Reps</button>
        <button className={metric === "weight" ? "active" : ""} onClick={() => setMetric("weight")} type="button">Weight</button>
      </div>

      {/* Chart and info card are always mounted; only opacity/transform animated */}
      <div className={`workout-graph fade-chart ${isOpen ? "visible" : ""}`}>
        <Line data={chartData} options={options} />
      </div>

      <div className={`info-card fade-info ${isOpen ? "visible" : ""}`} aria-live="polite">
        {selectedPoint ? (
          <>
            {"weekIndex" in selectedPoint && (
              <p className="info-label"><strong>Week:</strong> {selectedPoint.weekIndex + 1}</p>
            )}
            {"date" in selectedPoint && (
              <p className="info-label"><strong>Date:</strong> {new Date(selectedPoint.date).toLocaleDateString()}</p>
            )}
            {"month" in selectedPoint && (
              <p className="info-label"><strong>Month:</strong> {selectedPoint.month}</p>
            )}
            <p><strong>Sets:</strong> {selectedPoint.sets}</p>
            <p><strong>Reps:</strong> {selectedPoint.reps}</p>
            <p><strong>Weight:</strong> {selectedPoint.weight} kg</p>
            <button className="info-clear" type="button" onClick={() => setSelectedPoint(null)}>Clear</button>
          </>
        ) : (
          <p className="info-hint">Tap a point to see details here.</p>
        )}
      </div>
    </details>
  );
}

export default function ProgressGraphs() {
  const { history } = useProgram();
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" | "sessions" | "monthly"
  const tabIndex = viewMode === "weekly" ? 0 : viewMode === "sessions" ? 1 : 2;
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 480 : false;

  // Weekly totals (group by workout + weekIndex)
  const weeklyData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      const { weekIndex, workouts } = entry;
      (workouts || []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = {};
        if (!grouped[w.name][weekIndex]) {
          grouped[w.name][weekIndex] = { sets: 0, reps: 0, weight: 0 };
        }
        grouped[w.name][weekIndex].sets += w.sets ?? 0;
        grouped[w.name][weekIndex].reps += (w.reps ?? []).reduce((sum, r) => sum + r, 0);
        grouped[w.name][weekIndex].weight += (w.weights ?? []).reduce((sum, wt) => sum + wt, 0);
      });
    });
    const result = {};
    Object.keys(grouped).forEach((name) => {
      const weeks = Object.keys(grouped[name])
        .map((week) => ({
          weekIndex: parseInt(week, 10),
          ...grouped[name][week],
        }))
        .sort((a, b) => a.weekIndex - b.weekIndex);
      result[name] = weeks;
    });
    return result;
  }, [history]);

  // Raw sessions (chronological entries per workout)
  const sessionData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      (entry.workouts ?? []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = [];
        grouped[w.name].push({
          date: entry.date,
          sets: w.sets ?? 0,
          reps: (w.reps ?? []).reduce((sum, r) => sum + r, 0),
          weight: (w.weights ?? []).reduce((sum, wt) => sum + wt, 0),
        });
      });
    });
    Object.keys(grouped).forEach((name) => {
      grouped[name].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    return grouped;
  }, [history]);

  // Monthly totals (group by workout + monthKey)
  const monthlyData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      const monthKey = new Date(entry.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      (entry.workouts ?? []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = {};
        if (!grouped[w.name][monthKey]) {
          grouped[w.name][monthKey] = { sets: 0, reps: 0, weight: 0 };
        }
        grouped[w.name][monthKey].sets += w.sets ?? 0;
        grouped[w.name][monthKey].reps += (w.reps ?? []).reduce((sum, r) => sum + r, 0);
        grouped[w.name][monthKey].weight += (w.weights ?? []).reduce((sum, wt) => sum + wt, 0);
      });
    });
    const result = {};
    Object.keys(grouped).forEach((name) => {
      const months = Object.keys(grouped[name]).map((month) => ({
        month,
        ...grouped[name][month],
      }));
      result[name] = months;
    });
    return result;
  }, [history]);

  const dataSource =
    viewMode === "weekly" ? weeklyData : viewMode === "sessions" ? sessionData : monthlyData;

  return (
    <div className="page-content">
      <h2>Workout Progress</h2>

      {/* Segmented control */}
      <div className="view-toggle" aria-label="Chart view mode">
        <div
          className="view-toggle__indicator"
          style={{ left: `${tabIndex * 33.333}%` }}
          aria-hidden="true"
        />
        <button
          className={viewMode === "weekly" ? "active" : ""}
          onClick={() => setViewMode("weekly")}
          type="button"
        >
          Weekly Totals
        </button>
        <button
          className={viewMode === "sessions" ? "active" : ""}
          onClick={() => setViewMode("sessions")}
          type="button"
        >
          Raw Sessions
        </button>
        <button
          className={viewMode === "monthly" ? "active" : ""}
          onClick={() => setViewMode("monthly")}
          type="button"
        >
          Monthly Totals
        </button>
      </div>

      {Object.keys(dataSource).length === 0 && <p>No history yet.</p>}

      {Object.entries(dataSource).map(([name, data]) => {
        if (!data.length) return null;
        return (
          <WorkoutGraphPanel
            key={`${name}-${viewMode}`}
            name={name}
            data={data}
            viewMode={viewMode}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
}
