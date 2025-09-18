// packages/game-engine/src/game/GameManager.ts

import { GameState, Player, Card, Faction, RowType } from "@gwent/shared-types";
import {
  createInitialGameState,
  getCurrentPlayer as getStateCurrentPlayer,
  isRoundComplete,
} from "./GameState.js";
import {
  playCard as processPlayCard,
  passRound as processPassRound,
  ActionResult,
} from "../actions/ActionProcessor.js";
import { checkAndEndRound, processRoundTransition } from "./RoundManager.js";
import { createPlayer } from "./PlayerManager.js";

/**
 * Main game manager class that orchestrates all game operations
 */
export class GameManager {
  private games: Map<string, GameState> = new Map();

  /**
   * Create a new game with two players
   * @param player1Id - ID of first player
   * @param player1Name - Name of first player
   * @param player1Deck - Deck for first player
   * @param player1Faction - Faction for first player
   * @param player2Id - ID of second player
   * @param player2Name - Name of second player
   * @param player2Deck - Deck for second player
   * @param player2Faction - Faction for second player
   * @returns The created game state
   */
  createGame(
    player1Id: string,
    player1Name: string,
    player1Deck: Card[],
    player1Faction: Faction,
    player2Id: string,
    player2Name: string,
    player2Deck: Card[],
    player2Faction: Faction
  ): GameState {
    // Create players using PlayerManager utility
    const player1 = createPlayer(
      player1Id,
      player1Name,
      player1Deck,
      player1Faction
    );
    const player2 = createPlayer(
      player2Id,
      player2Name,
      player2Deck,
      player2Faction
    );

    // Create initial game state
    const gameState = createInitialGameState(player1, player2);

    // Store the game
    this.games.set(gameState.id, gameState);

    return gameState;
  }

  /**
   * Get a game by ID
   * @param gameId - The game ID
   * @returns The game state or null if not found
   */
  getGame(gameId: string): GameState | null {
    return this.games.get(gameId) || null;
  }

  /**
   * Get all active games
   * @returns Array of all game states
   */
  getAllGames(): GameState[] {
    return Array.from(this.games.values());
  }

  /**
   * Delete a game
   * @param gameId - The game ID to delete
   * @returns True if game was deleted
   */
  deleteGame(gameId: string): boolean {
    return this.games.delete(gameId);
  }

  /**
   * Play a card in a game
   * @param gameId - The game ID
   * @param playerId - The player ID
   * @param cardId - The card ID to play
   * @param targetRow - The target row
   * @returns Action result with updated state
   */
  playCard(
    gameId: string,
    playerId: string,
    cardId: string,
    targetRow: RowType
  ): ActionResult {
    const game = this.games.get(gameId);
    if (!game) {
      return {
        success: false,
        error: "Game not found",
      };
    }

    // Process the card play
    const result = processPlayCard(game, playerId, cardId, targetRow);

    if (!result.success || !result.newState) {
      return result;
    }

    // Check if round should end
    let finalState = checkAndEndRound(result.newState);

    // Update stored game state
    this.games.set(gameId, finalState);

    return {
      success: true,
      newState: finalState,
    };
  }

  /**
   * Pass the round for a player
   * @param gameId - The game ID
   * @param playerId - The player ID
   * @returns Action result with updated state
   */
  passRound(gameId: string, playerId: string): ActionResult {
    const game = this.games.get(gameId);
    if (!game) {
      return {
        success: false,
        error: "Game not found",
      };
    }

    // Process the pass
    const result = processPassRound(game, playerId);

    if (!result.success || !result.newState) {
      return result;
    }

    // Check if round should end
    let finalState = checkAndEndRound(result.newState);

    // Update stored game state
    this.games.set(gameId, finalState);

    return {
      success: true,
      newState: finalState,
    };
  }

  /**
   * Transition to next round (call after round ends)
   * @param gameId - The game ID
   * @returns New game state or null if error
   */
  transitionToNextRound(gameId: string): GameState | null {
    const game = this.games.get(gameId);
    if (!game) {
      return null;
    }

    // Process round transition
    const newState = processRoundTransition(game);

    // Update stored game state
    this.games.set(gameId, newState);

    return newState;
  }

  /**
   * Get the current player for a game
   * @param gameId - The game ID
   * @returns Current player or null
   */
  getCurrentPlayer(gameId: string): Player | null {
    const game = this.games.get(gameId);
    if (!game) {
      return null;
    }
    return getStateCurrentPlayer(game);
  }

  /**
   * Check if round is complete
   * @param gameId - The game ID
   * @returns True if round is complete
   */
  isRoundComplete(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) {
      return false;
    }
    return isRoundComplete(game);
  }

  /**
   * Check if match is complete
   * @param gameId - The game ID
   * @returns True if match is finished
   */
  isMatchComplete(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) {
      return false;
    }
    return game.status === "finished";
  }

  /**
   * Get game statistics
   * @param gameId - The game ID
   * @returns Game stats or null
   */
  getGameStats(gameId: string): {
    currentRound: number;
    player1Lives: number;
    player2Lives: number;
    player1RoundsWon: number;
    player2RoundsWon: number;
    isFinished: boolean;
  } | null {
    const game = this.games.get(gameId);
    if (!game) {
      return null;
    }

    let player1RoundsWon = 0;
    let player2RoundsWon = 0;

    for (const round of game.rounds) {
      if (round.isComplete && round.winner) {
        if (round.winner === game.players[0].id) {
          player1RoundsWon++;
        } else if (round.winner === game.players[1].id) {
          player2RoundsWon++;
        }
      }
    }

    return {
      currentRound: game.currentRound.number,
      player1Lives: game.players[0].lives,
      player2Lives: game.players[1].lives,
      player1RoundsWon,
      player2RoundsWon,
      isFinished: game.status === "finished",
    };
  }

  /**
   * Clear all games (useful for testing)
   */
  clearAllGames(): void {
    this.games.clear();
  }

  /**
   * Get total number of active games
   */
  getGameCount(): number {
    return this.games.size;
  }
}

// Export singleton instance
export const gameManager = new GameManager();
