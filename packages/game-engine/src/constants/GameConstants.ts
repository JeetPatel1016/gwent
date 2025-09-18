import { RowType, WeatherType } from "@gwent/shared-types";

export const GAME_RULES = {
  // Match Structure
  ROUNDS_TO_WIN: 2,
  MAX_ROUNDS: 3,
  STARTING_LIVES: 2,

  // Hand and Deck Limits
  STARTING_HAND_SIZE: 10,
  MIN_DECK_SIZE: 22,
  MAX_DECK_SIZE: 40,

  // Card Draw Rules
  CARDS_DRAWN_ROUND1: 0,
  CARDS_DRAWN_ROUND2: 1,
  CARDS_DRAWN_ROUND3: 1,

  // Board Layout
  ROWS_PER_PLAYER: 3,

  // Weather effects
  WEATHER_POWER_REDUCTION: 1,

  // Special Card limits per deck
  MAX_HERO_CARDS: 4,
} as const;

export const WEATHER_ROW_MAPPING: Record<WeatherType, RowType[]> = {
  frost: ["melee"],
  fog: ["ranged"],
  rain: ["siege"],
  clear: [],
} as const;

export const CARD_TYPES = {
  UNIT: "unit",
  SPELL: "spell",
  WEATHER: "weather",
  LEADER: "leader",
} as const;

export const CARD_RARITIES = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
} as const;

export const GAME_STATUS = {
  WAITING: "waiting",
  IN_PROGRESS: "in-progress",
  FINISHED: "finished",
} as const;

export const TURN_ACTIONS = {
  PLAY_CARD: "play-card",
  PASS: "pass",
  USE_LEADER: "use-leader",
  CONCEDE: "concede",
} as const;

export const ABILITY_TRIGGERS = {
  DEPLOY: "deploy",
  DESTROY: "destroy",
  ROUND_END: "round-end",
  ROUND_START: "round-start",
  PASSIVE: "passive",
} as const;

export const ABILITY_EFFECTS = {
  DAMAGE: "damage",
  BOOST: "bosst",
  SPAWN: "spawn",
  DRAW: "draw",
  RESURRECT: "resurrect",
  WEATHER: "weather",
  CLEAR_WEATHER: "clear-weather",
  SPY: "spy",
  SCORCH: "scorch",
} as const;

export const SCORING = {
  TIE_BREAKER_RULE: "first-to-pass-lose",
  ROUND_END_DELAY_MS: 2000,
  TURN_TIMEOUT_MS: 60000,
} as const;

export const POWER_LIMITS = {
  MIN_CARD_POWER: 0,
  MAX_CARD_POWER: 15,
  WEATHER_AFFECTED_POWER: 1,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_CARD_PLAY: "Cannot play this card",
  INVALID_TARGET: "Invalid target for this ability",
  PLAYER_ALREADY_PASSED: "Player has already passed this round",
  GAME_NOT_IN_PROGRESS: "Game is not in progress",
  NOT_PLAYER_TURN: "It is not this player's turn",
  CARD_NOT_IN_HAND: "Card is not in player's hand",
  INVALID_ROW: "Invalid row for this card type",
  DECK_SIZE_INVALID: "Deck does not meet size requirements",
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
