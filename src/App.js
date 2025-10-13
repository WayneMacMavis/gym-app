import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DayRoutine from "./pages/DayRoutine";
import { useProgram } from "./hooks/useProgram";

function App() {
  const { program, addWorkout, deleteWorkout, updateWorkout } = useProgram();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home programs={program} />} />

        <Route
          path="/week/:weekId/day/:dayId"
          element={
            <DayRoutine
              programs={program}
              addWorkout={addWorkout}
              deleteWorkout={deleteWorkout}
              updateWorkout={updateWorkout}
            />
          }
        />

        {/* Redirect old single-week routes to Week 1 */}
        <Route
          path="/day/:dayId"
          element={<Navigate to="/week/1/day/:dayId" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
