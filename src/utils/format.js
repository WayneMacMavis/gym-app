// src/utils/format.js
export const capitalizeWords = (str = "") =>
  str
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
