import { Card, BoardRow, WeatherType, RowType } from "@gwent/shared-types";
import {
  WEATHER_ROW_MAPPING,
  POWER_LIMITS,
} from "../constants/GameConstants.js";

/**
 * Calculate a card's effective power considering weather effects and other modifiers
 * @param card - The card to calculate power for
 * @param currentRow - The row the card is currently placed in
 * @param weatherEffects - Array of active weather effects
 * @returns The effective power of the card after applying all modifiers
 */
export function calculateCardPower(
  card: Card,
  currentRow: RowType,
  weatherEffects: WeatherType[] = []
): number {
  // Heroes are immune to all effects
  if (card.isHero) {
    return card.power;
  }

  // Check if card is affected by weather
  const isAffectedByWeather = isCardAffectedByWeather(
    card,
    currentRow,
    weatherEffects
  );

  if (isAffectedByWeather) {
    return POWER_LIMITS.WEATHER_AFFECTED_POWER;
  }

  return card.power;
}

/**
 * Calculate total power of a board row
 */
export function calculateRowPower(
  row: BoardRow,
  weatherEffects: WeatherType[] = []
): number {
  if (row.cards.length === 0) {
    return 0;
  }

  return row.cards.reduce((total, card) => {
    return total + calculateCardPower(card, row.type, weatherEffects);
  }, 0);
}

/**
 * Check if a card is affected by current weather effects
 */
export function isCardAffectedByWeather(
  card: Card,
  currentRow: RowType, // ← Add this parameter
  activeWeather: WeatherType[]
): boolean {
  // Heroes immune, only check units
  if (card.isHero || card.type !== "unit") {
    return false;
  }

  // Check if weather affects the current row the card is in
  return activeWeather.some((weatherType) => {
    if (weatherType === "clear") return false;
    const affectedRows = WEATHER_ROW_MAPPING[weatherType] || [];
    return affectedRows.includes(currentRow);
  });
}

/**
 * Find a card by ID in a collection
 */
export function findCardById(cards: Card[], cardId: string): Card | undefined {
  return cards.find((card) => card.id === cardId);
}

/**
 * Remove a card from a collection by ID
 */
export function removeCardById(cards: Card[], cardId: string): Card[] {
  return cards.filter((card) => card.id !== cardId);
}

/**
 * Add a card to a specific row on the board
 */
export function addCardToRow(row: BoardRow, card: Card): BoardRow {
  return {
    ...row,
    cards: [...row.cards, card],
  };
}

/**
 * Remove a card from a board row by ID
 */
export function removeCardFromRow(row: BoardRow, cardId: string): BoardRow {
  return {
    ...row,
    cards: row.cards.filter((card) => card.id !== cardId),
  };
}

/**
 * Shuffle an array of cards
 */
export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

/**
 * Draw cards from the top of a deck
 */
export function drawCards(
  deck: Card[],
  count: number
): { drawnCards: Card[]; remainingDeck: Card[] } {
  const drawnCards = deck.slice(0, count);
  const remainingDeck = deck.slice(count);

  return {
    drawnCards,
    remainingDeck,
  };
}

/**
 * Check if a card can be played in a specific row
 */
export function canPlayCardInRow(card: Card, rowType: RowType): boolean {
  if (card.type === "unit") {
    return card.allowedRows.includes(rowType);
  }
  return false;
}

/**
 * Get all active weather effects affecting a specific row
 */
export function getWeatherEffectsForRow(
  rowType: RowType,
  weatherEffects: WeatherType[]
): WeatherType[] {
  return weatherEffects.filter((weather) => {
    if (weather === "clear") {
      return false;
    }

    const affectedRows = WEATHER_ROW_MAPPING[weather] || [];
    return affectedRows.includes(rowType);
  });
}

/**
 * Calculate total score for a player (all rows combined)
 */
export function calculatePlayerScore(
  playerRows: { melee: BoardRow; ranged: BoardRow; siege: BoardRow },
  weatherEffects: WeatherType[] = []
): number {
  const meleeScore = calculateRowPower(playerRows.melee, weatherEffects);
  const rangedScore = calculateRowPower(playerRows.ranged, weatherEffects);
  const siegeScore = calculateRowPower(playerRows.siege, weatherEffects);

  return meleeScore + rangedScore + siegeScore;
}

/**
 * Check if a player has any cards left to play
 */
export function hasPlayableCards(hand: Card[]): boolean {
  // For now, any unit card in hand is playable
  // Later this might include checking for valid targets, mana, etc.
  return hand.some((card) => card.type === "unit");
}

/**
 * Create a copy of a card with modified power
 */
export function modifyCardPower(card: Card, newPower: number): Card {
  return {
    ...card,
    power: Math.max(0, newPower), // Power can't go below 0
  };
}

/**
 * Filter cards by type
 */
export function filterCardsByType(cards: Card[], type: Card["type"]): Card[] {
  return cards.filter((card) => card.type === type);
}

/**
 * Filter cards by row (cards that CAN be played in this row)
 */
export function filterCardsByRow(cards: Card[], row: RowType): Card[] {
  return cards.filter(
    (card) => card.allowedRows && card.allowedRows.includes(row)
  );
}

/**
 * Check if a game state has any active weather
 */
export function hasActiveWeather(activeWeather: WeatherType[]): boolean {
  return activeWeather.some((weatherType) => weatherType !== "clear");
}

/**
 * Clear all weather effects
 */
export function clearAllWeather(): WeatherType[] {
  return [];
}
