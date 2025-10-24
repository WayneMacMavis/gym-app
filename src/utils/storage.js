const PROGRAM_KEY = "user_program";

export const saveProgram = (programsArray) => {
  try {
    localStorage.setItem(PROGRAM_KEY, JSON.stringify(programsArray));
    console.log("Saved to localStorage:", programsArray);
  } catch (err) {
    console.error("Error saving program:", err);
  }
};

export const loadProgram = () => {
  try {
    const raw = localStorage.getItem(PROGRAM_KEY);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [parsed]; // fallback for older format
  } catch (err) {
    console.error("Error loading program:", err);
    return [{}];
  }
};
