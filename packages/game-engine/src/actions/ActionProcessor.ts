// packages/game-engine/src/actions/ActionProcessor.ts

import { produce } from "immer";
import { GameState, Card, RowType, Player } from "@gwent/shared-types";
import {
  findCardById,
  removeCardById,
  addCardToRow,
  canPlayCardInRow,
} from "../utils/GameUtils.js";
import { getCurrentPlayer } from "../game/GameState.js";

/**
 * Result type for action processing
 */
export type ActionResult = {
  success: boolean;
  newState?: GameState;
  error?: string;
};

/**
 * Play a card from player's hand to a board row
 * @param state - Current game state
 * @param playerId - ID of the player playing the card
 * @param cardId - ID of the card to play
 * @param targetRow - The row to play the card in
 * @returns Result containing new state or error
 */
export function playCard(
  state: GameState,
  playerId: string,
  cardId: string,
  targetRow: RowType
): ActionResult {
  // Validate the card play action
  const validation = validateCardPlay(state, playerId, cardId, targetRow);
  if (!validation.valid)
    return {
      success: false,
      error: validation.error,
    };

  // Find the player and their index
  const playerData = findPlayerById(state, playerId);
  if (!playerData) {
    return {
      success: false,
      error: "Player not found.",
    };
  }

  const { player, index: playerIndex } = playerData;

  // Find the card in player's hand
  const card = findCardById(player.hand, cardId);
  if (!card) {
    return {
      success: false,
      error: "Card not found in hand.",
    };
  }

  // create new state with the card moved from hand to board
  const newState = produce(state, (draft) => {
    // Remove card from hand
    draft.players[playerIndex]!.hand = removeCardById(
      draft.players[playerIndex]!.hand,
      cardId
    );

    // Add appropriate card to the boardRow
    draft.players[playerIndex]!.boardRows[targetRow] = addCardToRow(
      draft.players[playerIndex]!.boardRows[targetRow],
      card
    );

    // Update timestamp
    draft.updatedAt = new Date();
  });

  const stateWIthAbilities = applyCardAbilities(newState, card, playerId); // placeholder for now apply later.

  const finalState = advanceTurn(stateWIthAbilities);

  return {
    success: true,
    newState: finalState,
  };
}

/**
 * Player passes their turn for the current round
 * @param state - Current game state
 * @param playerId - ID of the player passing
 * @returns Result containing new state or error
 */
export function passRound(state: GameState, playerId: string): ActionResult {
  // TODO: Implement
  // 2. Validate player hasn't already passed
  // 3. Use produce() to set player's hasPassed to true
  // 4. Advance turn if opponent hasn't passed yet

  // Check if the player can act
  if (!canPlayerAct(state, playerId)) {
    return {
      success: false,
      error: "Player cannot act at this time.",
    };
  }

  // find the player
  const playerData = findPlayerById(state, playerId);
  if (!playerData) {
    return {
      success: false,
      error: "Player not found.",
    };
  }
  const { player, index: playerIndex } = playerData;
  if (player.hasPassed) {
    return {
      success: false,
      error: "Player has already passed this round.",
    };
  }

  // Create new state with player passed
  const newState = produce(state, (draft) => {
    draft.players[playerIndex]!.hasPassed = true;
    draft.updatedAt = new Date();
  });

  // Get opponent
  const opponentIndex = playerIndex === 0 ? 1 : 0;
  const opponent = newState.players[opponentIndex];

  // Only advance turn if opponent hasn't passed yet
  const finalState = opponent.hasPassed ? newState : advanceTurn(newState);

  return {
    success: true,
    newState: finalState,
  };
}

/**
 * Advance to the next player's turn
 * @param state - Current game state
 * @returns New game state with turn advanced
 */
export function advanceTurn(state: GameState): GameState {
  const newState = produce(state, (draft) => {
    // Switch to the other player
    draft.currentPlayerIndex = draft.currentPlayerIndex === 0 ? 1 : 0;

    // Increment turn count
    draft.turnCount += 1;

    // Update timestamp
    draft.updatedAt = new Date();
  });

  return newState;
}

/**
 * Validate if a player can take an action
 * @param state - Current game state
 * @param playerId - ID of the player attempting action
 * @returns True if player can act, false otherwise
 */
export function canPlayerAct(state: GameState, playerId: string): boolean {
  // Game must be in progress.
  if (state.status !== "in-progress") return false;

  // Find the player
  const playerData = findPlayerById(state, playerId);
  if (!playerData) {
    return false;
  }

  const { player, index: playerIndex } = playerData;

  if (state.currentPlayerIndex !== playerIndex) return false;

  // player must not have passed
  if (player.hasPassed) {
    return false;
  }

  return true;
}

/**
 * Find player by ID in game state
 * @param state - Current game state
 * @param playerId - ID of the player to find
 * @returns Player object and index, or null if not found
 */
export function findPlayerById(
  state: GameState,
  playerId: string
): { player: Player; index: number } | null {
  let player: Player;
  let index: number;
  if (state.players[0].id === playerId)
    return {
      player: state.players[0],
      index: 0,
    };
  if (state.players[1].id === playerId)
    return {
      player: state.players[1],
      index: 1,
    };

  return null;
}

/**
 * Validate card play action
 * @param state - Current game state
 * @param playerId - ID of the player
 * @param cardId - ID of the card
 * @param targetRow - Target row for the card
 * @returns Validation result with error message if invalid
 */
export function validateCardPlay(
  state: GameState,
  playerId: string,
  cardId: string,
  targetRow: RowType
): { valid: boolean; error?: string } {
  // Check if player can act
  if (!canPlayerAct(state, playerId)) {
    return { valid: false, error: "Player cannot act at this time" };
  }

  // Find the player
  const playerData = findPlayerById(state, playerId);
  if (!playerData) {
    return { valid: false, error: "Player not found" };
  }

  const { player } = playerData;

  // Check if player has the card in hand
  const card = findCardById(player.hand, cardId);
  if (!card) {
    return { valid: false, error: "Card not in player's hand" };
  }

  // Check if card can be played in target row
  if (!canPlayCardInRow(card, targetRow)) {
    return {
      valid: false,
      error: `Card cannot be played in ${targetRow} row`,
    };
  }

  return { valid: true };
}

/**
 * Apply card abilities when played (placeholder for future implementation)
 * @param state - Current game state
 * @param card - The card being played
 * @param playerId - ID of the player playing the card
 * @returns New game state with abilities applied
 */
export function applyCardAbilities(
  state: GameState,
  card: Card,
  playerId: string
): GameState {
  // TODO: Implement in Phase 4 when adding abilities
  // For now, just return the state unchanged
  return state;
}
