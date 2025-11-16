// src/pages/WorkoutLibraryPage.jsx
import React, { useState } from "react";
import WorkoutAccordion from "../components/WorkoutAccordion";
import { useDayEstimates } from "../hooks/useDayEstimates";
import { workouts } from "../data/workouts";
import { groupWorkouts } from "../utils/groupWorkouts";
import "./WorkoutLibraryPage.scss";

const WorkoutLibraryPage = ({ locked, onAddClick }) => {
  const { estimateWorkoutSeconds, getColor } = useDayEstimates(0, "1");
  const [openCategories, setOpenCategories] = useState([]);

  const grouped = groupWorkouts(workouts);

  // ✅ Button label logic
  const allOpen = openCategories.length === grouped.length;
  const buttonLabel = allOpen ? "Collapse All" : "Expand All";

  const handleToggleAll = () => {
    if (allOpen) {
      setOpenCategories([]); // collapse everything
    } else {
      setOpenCategories(grouped.map((g) => g.category)); // expand everything
    }
  };

  return (
    <div className="workout-library-page">
      <h1>Workout Library</h1>

      <button className="collapse-toggle" onClick={handleToggleAll}>
        {buttonLabel}
      </button>

      <WorkoutAccordion
        groups={grouped}
        onAddClick={onAddClick}
        locked={locked}
        getColor={getColor}
        estimateWorkoutSeconds={estimateWorkoutSeconds}
        openCategories={openCategories}
        setOpenCategories={setOpenCategories}
      />
    </div>
  );
};

export default WorkoutLibraryPage;
