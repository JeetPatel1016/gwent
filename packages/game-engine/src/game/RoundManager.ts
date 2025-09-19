// packages/game-engine/src/game/RoundManager.ts

import { produce } from "immer";
import { GameState, Round, RoundOutcome } from "@gwent/shared-types";
import {
  determineRoundWinner,
  updatePlayerLives,
  isMatchOver,
  calculateCurrentScores,
} from "../utils/ScoreCalculator.js";
import { isRoundComplete, getRoundWinCounts } from "./GameState.js";
import { GAME_RULES } from "../constants/GameConstants.js";
import { drawCards } from "../utils/GameUtils.js";

/**
 * Check if the current round should end and process if so
 * @param state - Current game state
 * @returns New game state with round ended, or original state if round continues
 */
export function checkAndEndRound(state: GameState): GameState {
  if (!isRoundComplete(state)) {
    return state;
  }
  return endCurrentRound(state);
}

/**
 * End the current round, determine winner, update lives
 * @param state - Current game state
 * @returns New game state with round ended
 */
export function endCurrentRound(state: GameState): GameState {
  const outcome = determineRoundWinner(
    state.players[0],
    state.players[1],
    state.activeWeathers
  );

  const scores = calculateCurrentScores(
    state.players[0],
    state.players[1],
    state.activeWeathers
  );

  const newLives = updatePlayerLives(
    state.players[0].lives,
    state.players[1].lives,
    outcome
  );

  const newState = produce(state, (draft) => {
    // Update player lives
    draft.players[0].lives = newLives.player1Lives;
    draft.players[1].lives = newLives.player2Lives;

    // Update roundsWon for each player
    if (outcome === "PLAYER_1_WINS") {
      draft.players[0].roundsWon++;
    } else if (outcome === "PLAYER_2_WINS") {
      draft.players[1].roundsWon++;
    }
    // For draw, no one's roundsWon increases

    // Update current round data
    draft.currentRound.isComplete = true;
    draft.currentRound.player1Score = scores.player1Score;
    draft.currentRound.player2Score = scores.player2Score;

    // Set round winner based on outcome
    if (outcome === "PLAYER_1_WINS") {
      draft.currentRound.winner = draft.players[0].id;
    } else if (outcome === "PLAYER_2_WINS") {
      draft.currentRound.winner = draft.players[1].id;
    }
    // For draw winner is undefined

    // Update the current round in the rounds array
    const currentRoundIndex = draft.rounds.length - 1;
    draft.rounds[currentRoundIndex] = draft.currentRound;

    draft.updatedAt = new Date();
  });

  // Check if match is over - UPDATED to pass Player objects
  const matchOutcome = isMatchOver(newState.players[0], newState.players[1]);

  if (matchOutcome !== "ONGOING") {
    return produce(newState, (draft) => {
      draft.status = "finished";

      if (matchOutcome === "PLAYER_1_WINS") {
        draft.winner = draft.players[0].id;
      } else if (matchOutcome === "PLAYER_2_WINS") {
        draft.winner = draft.players[1].id;
      }

      draft.updatedAt = new Date();
    });
  }

  return newState;
}

/**
 * Start a new round (called after previous round ends)
 * @param state - Current game state
 * @returns New game state with new round initialized
 */
export function startNewRound(state: GameState): GameState {
  // Validate that current round is complete
  if (!state.currentRound.isComplete)
    throw new Error("Cannot start new round: current round is not complete.");

  if (state.status === "finished")
    throw new Error("Cannot start new round: match is already finished.");

  // Get next round number
  const newRoundNumber = getNextRoundNumber(state.currentRound.number);
  if (!newRoundNumber)
    throw new Error("Cannot start new round: already at maximum rounds.");

  // Create next round
  const nextRound = createNewRound(newRoundNumber);

  let newState = produce(state, (draft) => {
    draft.rounds.push(nextRound);
    draft.currentRound = nextRound;
    draft.updatedAt = new Date();
  });

  newState = clearBoardsToGraveyard(newState);
  newState = resetPlayersForNewRound(newState);

  newState = drawCardsForRound(newState, newRoundNumber);

  return newState;
}

/**
 * Create a new round object
 * @param roundNumber - The round number (1, 2, or 3)
 * @returns New round object
 */
export function createNewRound(roundNumber: 1 | 2 | 3): Round {
  return {
    number: roundNumber,
    winner: undefined,
    player1Score: 0,
    player2Score: 0,
    isComplete: false,
  };
}

/**
 * Clear all cards from board rows and move to graveyard
 * @param state - Current game state
 * @returns New game state with cleared boards
 */
export function clearBoardsToGraveyard(state: GameState): GameState {
  return produce(state, (draft) => {
    for (let i = 0; i < 2; i++) {
      const player = draft.players[i];

      const meleeCards = [...player!.boardRows.melee.cards];
      const rangedCards = [...player!.boardRows.ranged.cards];
      const siegeCards = [...player!.boardRows.siege.cards];

      draft.players[i]!.graveyard.push(
        ...meleeCards,
        ...rangedCards,
        ...siegeCards
      );

      // clear all rows
      draft.players[i]!.boardRows.melee.cards = [];
      draft.players[i]!.boardRows.ranged.cards = [];
      draft.players[i]!.boardRows.siege.cards = [];
    }
    draft.updatedAt = new Date();
  });
}

/**
 * Draw cards for both players at start of new round
 * @param state - Current game state
 * @param roundNumber - The round number to determine cards to draw
 * @returns New game state with cards drawn
 */
export function drawCardsForRound(
  state: GameState,
  roundNumber: 1 | 2 | 3
): GameState {
  // Determine how many cards to draw
  let cardsToDraw = 0;
  switch (roundNumber) {
    case 1:
      cardsToDraw = GAME_RULES.CARDS_DRAWN_ROUND1; // 0 cards
      break;
    case 2:
      cardsToDraw = GAME_RULES.CARDS_DRAWN_ROUND2; // 1 card
      break;
    case 3:
      cardsToDraw = GAME_RULES.CARDS_DRAWN_ROUND3; // 1 card
      break;
  }

  // No cards to draw for round 1
  if (cardsToDraw === 0) {
    return state;
  }

  return produce(state, (draft) => {
    // Draw cards for each player
    for (let i = 0; i < draft.players.length; i++) {
      const player = draft.players[i]!;

      // Use the drawCards utility
      const { drawnCards, remainingDeck } = drawCards(player.deck, cardsToDraw);

      // Update player's hand and deck
      draft.players[i]!.hand.push(...drawnCards);
      draft.players[i]!.deck = remainingDeck;
    }

    draft.updatedAt = new Date();
  });
}

/**
 * Process the complete round transition (end current, start new)
 * @param state - Current game state
 * @returns New game state with round transitioned
 */
export function processRoundTransition(state: GameState): GameState {
  // End the current round
  let newState = endCurrentRound(state);

  // Check if match is over
  if (newState.status === "finished") {
    return newState; // Match over, no new round
  }

  // Start new round
  return startNewRound(newState);
}

/**
 * Get the next round number
 * @param currentRoundNumber - Current round number
 * @returns Next round number, or null if already at max
 */
export function getNextRoundNumber(
  currentRoundNumber: number
): 1 | 2 | 3 | null {
  if (currentRoundNumber === 1) return 2;
  if (currentRoundNumber === 2) return 3;
  return null; // Already at round 3
}

/**
 * Reset player state for new round
 * @param state - Current game state
 * @returns New game state with players reset
 */
export function resetPlayersForNewRound(state: GameState): GameState {
  return produce(state, (draft) => {
    // Reset pass status for both players
    draft.players[0].hasPassed = false;
    draft.players[1].hasPassed = false;

    draft.updatedAt = new Date();
  });
}
