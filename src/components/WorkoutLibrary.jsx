import React, { useState } from "react";
import "./WorkoutLibrary.scss";

const WorkoutLibrary = ({ workouts, setWorkouts }) => {
  const [newWorkout, setNewWorkout] = useState({ name: "", muscle: "" });

  const handleChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const addWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.name || !newWorkout.muscle) return;

    setWorkouts([
      ...workouts,
      { id: Date.now().toString(), name: newWorkout.name, muscle: newWorkout.muscle }, // ✅ string ID
    ]);
    setNewWorkout({ name: "", muscle: "" });
  };

  const removeWorkout = (id) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  return (
    <div className="workout-library">
      <h2>Workout Library</h2>

      <ul className="workout-list">
        {workouts.map((w) => (
          <li key={w.id} className="workout-card">
            <span>
              {w.name} <em>({w.muscle})</em>
            </span>
            <button onClick={() => removeWorkout(w.id)}>✕</button>
          </li>
        ))}
      </ul>

      <form className="add-workout-form" onSubmit={addWorkout}>
        <input
          type="text"
          name="name"
          placeholder="Workout name"
          value={newWorkout.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="muscle"
          placeholder="Muscle group"
          value={newWorkout.muscle}
          onChange={handleChange}
        />
        <button type="submit">Add Workout</button>
      </form>
    </div>
  );
};

export default WorkoutLibrary;
