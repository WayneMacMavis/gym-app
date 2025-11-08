import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DayRoutine from "./pages/DayRoutine";
import HistoryPage from "./pages/HistoryPage";
import ProgressGraphs from "./pages/ProgressGraphs";
import { ProgramProvider } from "./context/ProgramContext";
import HamburgerMenu from "./components/Navigation/HamburgerMenu"; // ✅ import

function App() {
  return (
    <ProgramProvider>
      <Router>
        {/* ✅ Always visible */}
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
        </Routes>
      </Router>
    </ProgramProvider>
  );
}

export default App;
