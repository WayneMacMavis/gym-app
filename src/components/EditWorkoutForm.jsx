// src/components/EditWorkoutForm.jsx
import React from "react";
import { getRule } from "../rules/progressionRules";

const generateReps = (name, sets) => {
  const { minReps, maxReps } = getRule(name);
  const decrement = 2;
  const reps = [];
  let current = maxReps;
  for (let i = 0; i < sets; i++) {
    reps.push(current.toString());
    current = Math.max(minReps, current - decrement);
  }
  return reps;
};

const EditWorkoutForm = ({
  editData,
  setEditData,
  saveEdit,
  cancelEdit,
  workoutId,
}) => {
  const handleEditChange = (field, value) => {
    if (field === "sets") {
      const num = parseInt(value, 10) || 0;
      setEditData({
        ...editData,
        sets: num,
        reps: generateReps(editData.name, num),
      });
    } else if (field === "name") {
      setEditData({
        ...editData,
        name: value, // let user type freely
        reps: generateReps(value, editData.sets),
      });
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleEditRepChange = (idx, value) => {
    const reps = [...editData.reps];
    reps[idx] = value;
    setEditData({ ...editData, reps });
  };

  return (
    <form onSubmit={(e) => saveEdit(e, workoutId)} className="edit-form">
      <input
        type="text"
        value={editData.name}
        onChange={(e) => handleEditChange("name", e.target.value)}
        placeholder="Workout name"
      />
      <input
        type="number"
        value={editData.sets}
        onChange={(e) => handleEditChange("sets", e.target.value)}
        placeholder="Number of sets"
      />
      {editData.reps.map((rep, i) => (
        <input
          key={i}
          type="number"
          value={rep}
          onChange={(e) => handleEditRepChange(i, e.target.value)}
          placeholder={`Reps for set ${i + 1}`}
        />
      ))}
      <div className="edit-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="back-btn" onClick={cancelEdit}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditWorkoutForm;
