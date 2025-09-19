import { Player, WeatherType, RoundOutcome } from "@gwent/shared-types";
import { calculatePlayerScore } from "./GameUtils.js";
import { GAME_RULES } from "../constants/GameConstants.js";

/**
 * Determine the winner of a round based on player scores and pass status
 * @param player1 - First player object
 * @param player2 - Second player object
 * @param activeWeather - Array of active weather effects
 * @returns The outcome of the round
 */
export function determineRoundWinner(
  player1: Player,
  player2: Player,
  activeWeather: WeatherType[] = []
): RoundOutcome {
  // Only determine winner if both players have passed
  if (!player1.hasPassed || !player2.hasPassed) {
    return "ONGOING";
  }

  // Calculate scores for both players
  const player1Score = calculatePlayerScore(player1.boardRows, activeWeather);
  const player2Score = calculatePlayerScore(player2.boardRows, activeWeather);

  // Determine outcome based on scores
  if (player1Score > player2Score) {
    return "PLAYER_1_WINS";
  }

  if (player2Score > player1Score) {
    return "PLAYER_2_WINS";
  }

  // Tied scores when both players have passed = draw (both lose a life)
  return "DRAW";
}

/**
 * Check if the match is over based on rounds won
 * @param player1 - 1st Player object
 * @param player2 - 2nd Player object
 * @returns The match outcome
 */
export function isMatchOver(player1: Player, player2: Player): RoundOutcome {
  // Check if either player won 2 rounds
  if (player1.roundsWon >= GAME_RULES.ROUNDS_TO_WIN) {
    return "PLAYER_1_WINS";
  }

  if (player2.roundsWon >= GAME_RULES.ROUNDS_TO_WIN) {
    return "PLAYER_2_WINS";
  }

  // Check if either player has no lives left
  if (player1.lives <= 0 && player2.lives <= 0) {
    return "DRAW"; // Both eliminated
  }
  if (player1.lives <= 0) {
    return "PLAYER_2_WINS";
  }
  if (player2.lives <= 0) {
    return "PLAYER_1_WINS";
  }

  return "ONGOING";
}

/**
 * Update player lives based on round outcome
 * @param player1Lives - Current lives of player 1
 * @param player2Lives - Current lives of player 2
 * @param roundOutcome - The outcome of the completed round
 * @returns New life totals for both players
 */
export function updatePlayerLives(
  player1Lives: number,
  player2Lives: number,
  roundOutcome: RoundOutcome
): { player1Lives: number; player2Lives: number } {
  // Ensure lives don't go below 0
  const clampLives = (lives: number) => Math.max(0, lives);

  switch (roundOutcome) {
    case "PLAYER_1_WINS":
      // Player 1 wins: Player 2 loses a life
      return {
        player1Lives: player1Lives,
        player2Lives: clampLives(player2Lives - 1),
      };

    case "PLAYER_2_WINS":
      // Player 2 wins: Player 1 loses a life
      return {
        player1Lives: clampLives(player1Lives - 1),
        player2Lives: player2Lives,
      };

    case "DRAW":
      // Draw: Both players lose a life
      return {
        player1Lives: clampLives(player1Lives - 1),
        player2Lives: clampLives(player2Lives - 1),
      };

    case "ONGOING":
      // Round not finished: No change to lives
      return {
        player1Lives: player1Lives,
        player2Lives: player2Lives,
      };

    default:
      // Fallback: No change
      return {
        player1Lives: player1Lives,
        player2Lives: player2Lives,
      };
  }
}

/**
 * Get the current match winner based on rounds won (convenience function)
 * @param player1 - Player 1 object
 * @param player2 - Player 2 object
 * @returns Player index who won the match, or null if ongoing
 */
export function getMatchWinner(player1: Player, player2: Player): 0 | 1 | null {
  const matchOutcome = isMatchOver(player1, player2);

  switch (matchOutcome) {
    case "PLAYER_1_WINS":
      return 0;
    case "PLAYER_2_WINS":
      return 1;
    case "ONGOING":
    case "DRAW":
    default:
      return null;
  }
}

/**
 * Calculate final scores for both players in current round
 * @param player1 - First player object
 * @param player2 - Second player object
 * @param activeWeather - Array of active weather effects
 * @returns Object with both player scores
 */
export function calculateCurrentScores(
  player1: Player,
  player2: Player,
  activeWeather: WeatherType[] = []
): { player1Score: number; player2Score: number } {
  return {
    player1Score: calculatePlayerScore(player1.boardRows, activeWeather),
    player2Score: calculatePlayerScore(player2.boardRows, activeWeather),
  };
}

/**
 * Check if a round can be ended (both players passed or other end conditions)
 * @param player1 - First player object
 * @param player2 - Second player object
 * @returns True if the round should end
 */
export function shouldEndRound(player1: Player, player2: Player): boolean {
  // Round ends when both players have passed
  return player1.hasPassed && player2.hasPassed;
}
