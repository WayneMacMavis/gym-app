// uid.js
// Utility function to generate a unique ID string.
// Used when creating new workouts or other entities that need unique keys.

export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}-${crypto.randomUUID?.() || ""}`;

