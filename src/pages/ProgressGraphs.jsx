// src/pages/ProgressGraphs.jsx

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

export default function ProgressGraphs() {
  const { history } = useProgram();
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" | "sessions" | "monthly"
  const tabIndex = viewMode === "weekly" ? 0 : viewMode === "sessions" ? 1 : 2;

  // Weekly totals
  const weeklyData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      const { weekIndex, workouts } = entry;
      (workouts || []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = {};
        if (!grouped[w.name][weekIndex]) {
          grouped[w.name][weekIndex] = { sets: 0, reps: 0, weight: 0 };
        }
        grouped[w.name][weekIndex].sets += w.sets;
        grouped[w.name][weekIndex].reps += w.reps.reduce((sum, r) => sum + r, 0);
        grouped[w.name][weekIndex].weight += w.weights.reduce((sum, wt) => sum + wt, 0);
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

  // Raw sessions
  const sessionData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      (entry.workouts || []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = [];
        grouped[w.name].push({
          date: entry.date,
          sets: w.sets,
          reps: w.reps.reduce((sum, r) => sum + r, 0),
          weight: w.weights.reduce((sum, wt) => sum + wt, 0),
        });
      });
    });
    Object.keys(grouped).forEach((name) => {
      grouped[name].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    return grouped;
  }, [history]);

  // Monthly totals
  const monthlyData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      const monthKey = new Date(entry.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      (entry.workouts || []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = {};
        if (!grouped[w.name][monthKey]) {
          grouped[w.name][monthKey] = { sets: 0, reps: 0, weight: 0 };
        }
        grouped[w.name][monthKey].sets += w.sets;
        grouped[w.name][monthKey].reps += w.reps.reduce((sum, r) => sum + r, 0);
        grouped[w.name][monthKey].weight += w.weights.reduce((sum, wt) => sum + wt, 0);
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

        const labels =
          viewMode === "weekly"
            ? data.map((w) => `Week ${w.weekIndex + 1}`)
            : viewMode === "sessions"
            ? data.map((d) =>
                new Date(d.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              )
            : data.map((m) => m.month);

        const setsData = data.map((d) => d.sets);
        const repsData = data.map((d) => d.reps);
        const weightData = data.map((d) => d.weight);

        const chartData = {
          labels,
          datasets: [
            { label: "Sets", data: setsData, borderColor: "blue", backgroundColor: "blue", tension: 0.25, pointRadius: 3 },
            { label: "Reps", data: repsData, borderColor: "green", backgroundColor: "green", tension: 0.25, pointRadius: 3 },
            { label: "Weight (kg)", data: weightData, borderColor: "red", backgroundColor: "red", tension: 0.25, pointRadius: 3 },
          ],
        };

        const options = {
          responsive: true,
          interaction: { mode: "index", intersect: false }, // group tooltip by x index reliably
          plugins: {
            title: {
              display: true,
              text:
                viewMode === "weekly"
                  ? `${name} Progress by Program Week`
                  : viewMode === "sessions"
                  ? `${name} Progress by Session`
                  : `${name} Progress by Month`,
            },
            legend: { display: true, position: "bottom" },
            tooltip: {
              callbacks: {
                // Suppress per-dataset lines; we’ll render a custom block
                label: () => null,
                beforeBody: (tooltipItems) => {
                  if (!tooltipItems || !tooltipItems.length) return null;
                  const idx = tooltipItems[0]?.dataIndex;
                  if (idx == null) return null;
                  const point = data[idx];
                  if (!point) return null;
                  return [
                    `Sets: ${point.sets}`,
                    `Reps: ${point.reps}`,
                    `Weight: ${point.weight} kg`,
                  ];
                },
              },
            },
          },
          scales: {
            x: { ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 }, grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
          },
        };

        return (
          <div key={`${name}-${viewMode}`} className="workout-graph fade">
            <Line data={chartData} options={options} />
          </div>
        );
      })}
    </div>
  );
}
