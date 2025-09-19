// packages/game-engine/tests/helpers/testData.ts

import { Card, Player, BoardRow } from "@gwent/shared-types";

let cardIdCounter = 0;
let playerIdCounter = 0;

/**
 * Sample cards for testing
 */
export const createTestCard = (overrides?: Partial<Card>): Card => ({
  id: `test-card-${++cardIdCounter}`,
  name: "Test Card",
  power: 5,
  basePower: 5,
  faction: "northern-realms",
  type: "unit",
  allowedRows: ["melee"],
  isHero: false,
  description: "A test card",
  ...overrides,
});

export const createHeroCard = (overrides?: Partial<Card>): Card => ({
  id: `hero-card-${++cardIdCounter}`,
  name: "Hero Card",
  power: 10,
  basePower: 10,
  faction: "northern-realms",
  type: "unit",
  allowedRows: ["melee"],
  isHero: true,
  description: "A hero card",
  ...overrides,
});

export const createAgileCard = (overrides?: Partial<Card>): Card => ({
  id: `agile-card-${++cardIdCounter}`,
  name: "Agile Card",
  power: 4,
  basePower: 4,
  faction: "scoia-tael",
  type: "unit",
  allowedRows: ["melee", "ranged"],
  isHero: false,
  description: "An agile card",
  ...overrides,
});

/**
 * Sample board row for testing
 */
export const createTestBoardRow = (
  type: "melee" | "ranged" | "siege",
  cards: Card[] = []
): BoardRow => ({
  type,
  cards,
});

/**
 * Sample player for testing
 */
export const createTestPlayer = (overrides?: Partial<Player>): Player => ({
  id: `player-${++playerIdCounter}`,
  name: `Test Player ${playerIdCounter}`,
  faction: "northern-realms",
  hand: [],
  deck: [],
  graveyard: [],
  boardRows: {
    melee: createTestBoardRow("melee"),
    ranged: createTestBoardRow("ranged"),
    siege: createTestBoardRow("siege"),
  },
  roundsWon: 0,
  hasPassed: false,
  lives: 2,
  leaderUsed: false,
  ...overrides,
});

/**
 * Create a deck of test cards
 */
export const createTestDeck = (count: number = 10): Card[] => {
  return Array.from({ length: count }, (_, i) =>
    createTestCard({
      id: `card-${++cardIdCounter}`,
      name: `Card ${cardIdCounter}`,
      power: Math.floor(Math.random() * 10) + 1,
    })
  );
};

/**
 * Reset counters (useful for test isolation)
 */
export const resetTestCounters = () => {
  cardIdCounter = 0;
  playerIdCounter = 0;
};
