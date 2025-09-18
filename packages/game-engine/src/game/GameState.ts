import { GameState, Player, Round } from "@gwent/shared-types";

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
    status: "waiting",

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
/**
 * Check if the current round is complete (both players passed)
 */
export function isRoundComplete(gameState: GameState): boolean {
  return gameState.players[0].hasPassed && gameState.players[1].hasPassed;
}

/**
 * Count how many rounds each player has won
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
    }
  }

  return { player1Wins, player2Wins };
}
