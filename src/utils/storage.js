const PROGRAM_KEY = "user_program";

export const saveProgram = (programsArray) => {
  try {
    if (!Array.isArray(programsArray)) {
      throw new Error("Programs must be an array");
    }
    localStorage.setItem(PROGRAM_KEY, JSON.stringify(programsArray));
    console.log("Saved to localStorage:", programsArray);
  } catch (err) {
    console.error("Error saving program:", err);
  }
};

export const loadProgram = () => {
  try {
    const raw = localStorage.getItem(PROGRAM_KEY);
    if (!raw) {
      // ✅ Nothing saved yet → return empty array
      return [];
    }

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (parsed && typeof parsed === "object") {
      // ✅ Fallback for older format (single week object)
      return [parsed];
    }

    // ✅ If parsed is null or unexpected type
    return [];
  } catch (err) {
    console.error("Error loading program:", err);
    return [];
  }
};
