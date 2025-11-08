// src/pages/ProgressGraphs.jsx

import React, { useMemo } from "react";
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

  // Group history entries by workout name
  const workoutData = useMemo(() => {
    const grouped = {};
    (history || []).forEach((entry) => {
      (entry.workouts || []).forEach((w) => {
        if (!grouped[w.name]) grouped[w.name] = [];
        grouped[w.name].push({
          date: entry.date,
          sets: w.sets,
          reps: w.reps.reduce((sum, r) => sum + r, 0), // total reps
          weight: w.weights.reduce((sum, wt) => sum + wt, 0), // total weight
        });
      });
    });

    // Sort each workout’s data by date
    Object.keys(grouped).forEach((name) => {
      grouped[name].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return grouped;
  }, [history]);

  return (
    <div className="page-content">
      <h2>Workout Progress</h2>
      {Object.keys(workoutData).length === 0 && <p>No history yet.</p>}

      {Object.entries(workoutData).map(([name, data]) => {
        if (!data.length) return null;

        // Format dates into readable strings
        const labels = data.map((d) =>
          new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );

        const setsData = data.map((d) => d.sets);
        const repsData = data.map((d) => d.reps);
        const weightData = data.map((d) => d.weight);

        const chartData = {
          labels,
          datasets: [
            {
              label: "Sets",
              data: setsData,
              borderColor: "blue",
              backgroundColor: "blue",
              tension: 0.25,
              pointRadius: 2,
            },
            {
              label: "Reps (total)",
              data: repsData,
              borderColor: "green",
              backgroundColor: "green",
              tension: 0.25,
              pointRadius: 2,
            },
            {
              label: "Weight (total kg)",
              data: weightData,
              borderColor: "red",
              backgroundColor: "red",
              tension: 0.25,
              pointRadius: 2,
            },
          ],
        };

        const options = {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `${name} Progress`,
            },
            legend: {
              display: true,
              position: "bottom",
            },
          },
          scales: {
            x: {
              type: "category", // ✅ just use category scale
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
              },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(0,0,0,0.05)" },
            },
          },
        };

        return (
          <div key={name} className="workout-graph">
            <Line data={chartData} options={options} />
          </div>
        );
      })}
    </div>
  );
}
