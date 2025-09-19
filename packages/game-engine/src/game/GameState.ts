import { GameState, Player, Round } from "@gwent/shared-types";
import { GAME_RULES } from "../constants/GameConstants.js";

/**
 * Get the opponent of the currently active player
 * @param gameState - Current game state
 * @returns The player who is not currently active
 */
export function getOpponentPlayer(gameState: GameState): Player {
  const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  return gameState.players[opponentIndex];
}

/**
 * Check if the entire match is complete
 * @param gameState - Current game state
 * @returns True if the match is over
 */
export function isMatchComplete(gameState: GameState): boolean {
  return gameState.status === "finished";
}

/**
 * Get the current round number (1, 2, or 3)
 * @param gameState - Current game state
 * @returns The current round number
 */
export function getCurrentRoundNumber(gameState: GameState): 1 | 2 | 3 {
  return gameState.currentRound.number as 1 | 2 | 3;
}

/**
 * Validate that a game state is in a consistent state
 * @param gameState - Game state to validate
 * @returns True if state is valid, throws error if invalid
 */
export function validateGameState(gameState: GameState): boolean {
  // Check basic structure
  if (!gameState.id || !gameState.players || gameState.players.length !== 2) {
    throw new Error(
      "Invalid game state: missing required fields or incorrect player count"
    );
  }

  // Check turn index is valid
  if (gameState.currentPlayerIndex < 0 || gameState.currentPlayerIndex > 1) {
    throw new Error("Invalid game state: currentPlayerIndex must be 0 or 1");
  }

  // Check round number is valid
  if (
    gameState.currentRound.number < 1 ||
    gameState.currentRound.number > GAME_RULES.MAX_ROUNDS
  ) {
    throw new Error(
      `Invalid game state: round number must be between 1 and ${GAME_RULES.MAX_ROUNDS}`
    );
  }

  // Check that players have valid data
  for (let i = 0; i < gameState.players.length; i++) {
    const player = gameState.players[i]!;
    if (!player.id || !player.name) {
      throw new Error(
        `Invalid game state: Player ${i} missing required fields`
      );
    }

    // Check that player lives are valid
    if (player.lives < 0 || player.lives > GAME_RULES.STARTING_LIVES) {
      throw new Error(
        `Invalid game state: Player ${i} has invalid life count: ${player.lives}`
      );
    }
  }

  return true;
}

/**
 * Create a deep copy of game state for immutable updates
 * @param gameState - Game state to copy
 * @returns Deep copy of the game state
 */
export function cloneGameState(gameState: GameState): GameState {
  return JSON.parse(JSON.stringify(gameState));
}

/**
 * Check if the current round is complete (both players passed)
 * @param gameState - Current game state
 * @returns True if both players have passed
 */
export function isRoundComplete(gameState: GameState): boolean {
  return gameState.players[0].hasPassed && gameState.players[1].hasPassed;
}

/**
 * Count how many rounds each player has won
 * @param gameState - Current game state
 * @returns Object with round win counts for both players
 */
export function getRoundWinCounts(gameState: GameState): {
  player1Wins: number;
  player2Wins: number;
} {
  let player1Wins = 0;
  let player2Wins = 0;

  for (const round of gameState.rounds) {
    if (round.isComplete && round.winner) {
      if (round.winner === gameState.players[0].id) {
        player1Wins++;
      } else if (round.winner === gameState.players[1].id) {
        player2Wins++;
      }
      // Note: draws don't count as wins for either player
    }
  }

  return { player1Wins, player2Wins };
}
/**
 * Get the currently active player
 * @param gameState - Current game state
 * @returns The player whose turn it is
 */
export function getCurrentPlayer(gameState: GameState): Player {
  return gameState.players[gameState.currentPlayerIndex];
}

/**
 * Create initial game state with two players
 * @param player1 - First player object with deck and initial setup
 * @param player2 - Second player object with deck and initial setup
 * @returns Complete initial game state
 */
export function createInitialGameState(
  player1: Player,
  player2: Player
): GameState {
  const gameId = generateGameId();
  const initialRound = createInitialRound();
  const currentTime = new Date();

  return {
    id: gameId,
    players: [player1, player2],
    status: "in-progress",

    currentRound: initialRound,
    rounds: [initialRound],

    currentPlayerIndex: 0,
    turnCount: 1,

    activeWeathers: [],

    createdAt: currentTime,
    updatedAt: currentTime,
  };
}

/**
 * Generate a unique game ID
 * @returns A unique identifier for the game
 */
function generateGameId() {
  return `game_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create initial round state for a new game
 * @returns Initial round configuration
 */
function createInitialRound(): Round {
  return {
    number: 1,
    player1Score: 0,
    player2Score: 0,
    isComplete: false,
    winner: undefined,
  };
}
