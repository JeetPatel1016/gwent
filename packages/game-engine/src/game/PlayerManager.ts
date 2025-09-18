// packages/game-engine/src/game/PlayerManager.ts

import { Player, Card, Faction } from "@gwent/shared-types";
import { shuffleDeck, drawCards } from "../utils/GameUtils.js";
import { GAME_RULES } from "../constants/GameConstants.js";

/**
 * Create a new player with shuffled deck and starting hand
 * @param id - Player ID
 * @param name - Player name
 * @param deck - Player's deck
 * @param faction - Player's faction
 * @returns Complete player object
 */
export function createPlayer(
  id: string,
  name: string,
  deck: Card[],
  faction: Faction
): Player {
  // Shuffle the deck
  const shuffledDeck = shuffleDeck([...deck]);

  // Draw starting hand
  const { drawnCards, remainingDeck } = drawCards(
    shuffledDeck,
    GAME_RULES.STARTING_HAND_SIZE
  );

  return {
    id,
    name,
    faction,
    hand: drawnCards,
    deck: remainingDeck,
    graveyard: [],
    boardRows: {
      melee: { type: "melee", cards: [] },
      ranged: { type: "ranged", cards: [] },
      siege: { type: "siege", cards: [] },
    },
    roundsWon: 0,
    hasPassed: false,
    lives: GAME_RULES.STARTING_LIVES,
    leaderUsed: false,
  };
}

/**
 * Validate deck composition
 * @param deck - Deck to validate
 * @returns Validation result
 */
export function validateDeck(deck: Card[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check deck size
  if (deck.length < GAME_RULES.MIN_DECK_SIZE) {
    errors.push(`Deck must have at least ${GAME_RULES.MIN_DECK_SIZE} cards`);
  }

  if (deck.length > GAME_RULES.MAX_DECK_SIZE) {
    errors.push(`Deck cannot exceed ${GAME_RULES.MAX_DECK_SIZE} cards`);
  }

  // Check card limits (max 3 of same card for non-heroes)
  const cardCounts = new Map<string, number>();
  for (const card of deck) {
    const count = cardCounts.get(card.id) || 0;
    cardCounts.set(card.id, count + 1);

    if (!card.isHero && count >= 3) {
      errors.push(`Cannot have more than 3 copies of ${card.name}`);
    }
  }

  // Check hero limits
  let heroCount = 0;
  for (const card of deck) {
    if (card.isHero) {
      heroCount++;
    }
  }

  if (heroCount > GAME_RULES.MAX_HERO_CARDS) {
    errors.push(
      `Cannot have more than ${GAME_RULES.MAX_HERO_CARDS} hero cards`
    );
  }

  // Check faction consistency
  const factions = new Set(deck.map((card) => card.faction));
  if (factions.size > 1) {
    errors.push("All cards must be from the same faction");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
