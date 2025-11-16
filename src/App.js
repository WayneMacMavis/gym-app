import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DayRoutine from "./pages/DayRoutine";
import HistoryPage from "./pages/HistoryPage";
import ProgressGraphs from "./pages/ProgressGraphs";
import WorkoutLibraryPage from "./pages/WorkoutLibraryPage"; // ✅ page-level import
import { ProgramProvider } from "./context/ProgramContext";
import HamburgerMenu from "./components/Navigation/HamburgerMenu"; // ✅ component import

function App() {
  return (
    <ProgramProvider>
      <Router>
        {/* ✅ Always visible navigation */}
        <HamburgerMenu />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/week/:weekId/day/:dayId" element={<DayRoutine />} />

          {/* Redirect old single-week routes to Week 1 */}
          <Route
            path="/day/:dayId"
            element={<Navigate to="/week/1/day/:dayId" replace />}
          />

          <Route path="/history" element={<HistoryPage />} />
          <Route path="/progress" element={<ProgressGraphs />} />

          {/* ✅ New route for the Workout Library */}
          <Route path="/library" element={<WorkoutLibraryPage />} />
        </Routes>
      </Router>
    </ProgramProvider>
  );
}

export default App;
