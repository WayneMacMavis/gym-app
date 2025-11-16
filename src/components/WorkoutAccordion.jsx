// src/components/WorkoutAccordion.jsx
import React from "react";
import WorkoutCard from "./WorkoutCard";
import Button from "./Button/Button";
import "./WorkoutAccordion.scss";

const WorkoutAccordion = ({
  groups = [],
  onAddClick,
  locked,
  getColor,
  estimateWorkoutSeconds,
  openCategories,
  setOpenCategories,
}) => {
  const toggleCategory = (category) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="workout-accordion">
      {groups.map(({ category, items }) => (
        <div
          key={category}
          className={`accordion-section ${
            openCategories.includes(category) ? "open" : ""
          }`}
        >
          <div className="accordion-header" onClick={() => toggleCategory(category)}>
            <h2>{category}</h2>
          </div>

          <div className="accordion-content animate">
            {openCategories.includes(category) &&
              items.map((w, i) => {
                // ✅ Safe estimate logic
                const seconds = estimateWorkoutSeconds(w);
                const safeEstimate =
                  Number.isFinite(seconds) && seconds > 0 ? seconds : null;

                return (
                  <div
                    key={w.name}
                    className="accordion-card fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <WorkoutCard
                      workout={w}
                      getColor={getColor}
                      estimateWorkoutSeconds={() => safeEstimate}
                      collapsed={false}
                    />
                    {!locked && (
                      <Button variant="secondary" onClick={() => onAddClick(w)}>
                        ➕ Add to Day
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutAccordion;
