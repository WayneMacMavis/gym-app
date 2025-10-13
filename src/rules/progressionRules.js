// src/rules/progressionRules.js
export const progressionRules = {
  "bench press": { increment: 2.5, minReps: 6, maxReps: 12 },
  "incline db press": { increment: 2.5, minReps: 8, maxReps: 12 },
  "squat": { increment: 5, minReps: 5, maxReps: 10 },
  "deadlift": { increment: 5, minReps: 3, maxReps: 8 },
  "overhead press": { increment: 2.5, minReps: 5, maxReps: 10 },
  default: { increment: 2.5, minReps: 6, maxReps: 12 },
};

export function getRule(name) {
  const key = (name || "").trim().toLowerCase();
  const rule = progressionRules[key] || progressionRules.default;

  // 🔍 Debug log
  console.log("getRule lookup:", { raw: name, normalized: key, rule });

  return rule;
}
