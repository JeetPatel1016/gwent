import { monstersCards } from "./monsters.js";
import { northernRealmsCards } from "./northern-realms.js";
import { scoiaTaelCards } from "./scoia-tael.js";

export { northernRealmsCards } from "./northern-realms.js";
export { monstersCards } from "./monsters.js";
export { scoiaTaelCards } from "./scoia-tael.js";

// Export all cards combined
export const allCards = [
  ...northernRealmsCards,
  ...monstersCards,
  ...scoiaTaelCards,
];

// Export cards by faction
export const cardsByFaction = {
  "northern-realms": northernRealmsCards,
  monsters: monstersCards,
  "scoia-tael": scoiaTaelCards,
} as const;
