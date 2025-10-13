// utils/storage.js
const STORAGE_KEY = "program";

export const loadProgram = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { "1": [], "2": [], "3": [] };
    const parsed = JSON.parse(saved);
    // normalize keys
    return {
      "1": parsed["1"] || [],
      "2": parsed["2"] || [],
      "3": parsed["3"] || [],
    };
  } catch (err) {
    console.error("Error loading program:", err);
    return { "1": [], "2": [], "3": [] };
  }
};

export const saveProgram = (program) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(program));
    console.log("Saved to localStorage:", program);
  } catch (err) {
    console.error("Error saving program:", err);
  }
};
