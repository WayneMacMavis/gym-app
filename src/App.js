import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DayRoutine from "./pages/DayRoutine";
import { ProgramProvider } from "./context/ProgramContext"; // ✅ new context provider

function App() {
  return (
    <ProgramProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/week/:weekId/day/:dayId"
            element={<DayRoutine />}
          />

          {/* Redirect old single-week routes to Week 1 */}
          <Route
            path="/day/:dayId"
            element={<Navigate to="/week/1/day/:dayId" replace />}
          />
        </Routes>
      </Router>
    </ProgramProvider>
  );
}

export default App;
