import { describe, it, expect, beforeEach } from "@jest/globals";
import { GameManager } from "../../src/game/GameManager";
import { createTestDeck, resetTestCounters } from "../helpers/testData";

describe("Game Flow Integration", () => {
  let gameManager: GameManager;
  let player1Deck: any[];
  let player2Deck: any[];

  beforeEach(() => {
    resetTestCounters();
    gameManager = new GameManager();
    player1Deck = createTestDeck(25);
    player2Deck = createTestDeck(25);
  });

  describe("Complete Round Flow", () => {
    it("should complete a full round when both players pass", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      // Play some cards
      const p1Card = game.players[0].hand[0]!;
      gameManager.playCard(game.id, "p1", p1Card.id, p1Card.allowedRows[0]!);

      const p2Card = game.players[1].hand[0]!;
      gameManager.playCard(game.id, "p2", p2Card.id, p2Card.allowedRows[0]!);

      // Both pass
      gameManager.passRound(game.id, "p1");
      gameManager.passRound(game.id, "p2");

      const finalState = gameManager.getGame(game.id);
      expect(finalState?.players[0].hasPassed).toBe(true);
      expect(finalState?.players[1].hasPassed).toBe(true);
    });

    it("should handle multiple card plays in sequence", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      // Player 1 plays
      let currentState = game;
      const p1Card1 = currentState.players[0].hand[0]!;
      let result = gameManager.playCard(
        game.id,
        "p1",
        p1Card1.id,
        p1Card1.allowedRows[0]!
      );
      expect(result.success).toBe(true);

      // Player 2 plays
      currentState = gameManager.getGame(game.id)!;
      const p2Card1 = currentState.players[1].hand[0]!;
      result = gameManager.playCard(
        game.id,
        "p2",
        p2Card1.id,
        p2Card1.allowedRows[0]!
      );
      expect(result.success).toBe(true);

      // Player 1 plays again
      currentState = gameManager.getGame(game.id)!;
      const p1Card2 = currentState.players[0].hand[0]!;
      result = gameManager.playCard(
        game.id,
        "p1",
        p1Card2.id,
        p1Card2.allowedRows[0]!
      );
      expect(result.success).toBe(true);

      const finalState = gameManager.getGame(game.id);
      expect(finalState?.players[0].hand.length).toBe(8);
      expect(finalState?.players[1].hand.length).toBe(9);
    });
  });

  describe("Match Progression", () => {
    it("should progress through multiple rounds", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      // Round 1: Both pass immediately
      gameManager.passRound(game.id, "p1");
      gameManager.passRound(game.id, "p2");

      let currentState = gameManager.getGame(game.id);
      expect(currentState?.currentRound.number).toBe(1);
      expect(currentState?.currentRound.isComplete).toBe(true);
    });

    it("should handle player with no cards gracefully", () => {
      const smallDeck1 = createTestDeck(15);
      const smallDeck2 = createTestDeck(15);

      const game = gameManager.createGame(
        "p1",
        "Alice",
        smallDeck1,
        "northern-realms",
        "p2",
        "Bob",
        smallDeck2,
        "monsters"
      );

      // Play all cards from hand
      let currentState = game;
      let playCount = 0;

      while (playCount < 5 && currentState.players[0].hand.length > 0) {
        const card =
          currentState.players[currentState.currentPlayerIndex].hand[0]!;
        const playerId =
          currentState.players[currentState.currentPlayerIndex].id;
        const result = gameManager.playCard(
          game.id,
          playerId,
          card.id,
          card.allowedRows[0]!
        );

        if (!result.success) break;

        currentState = gameManager.getGame(game.id)!;
        playCount++;
      }

      expect(currentState).toBeDefined();
    });
  });

  describe("Game State Consistency", () => {
    it("should maintain consistent state after actions", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      const initialHandSize = game.players[0].hand.length;

      // Play a card
      const card = game.players[0].hand[0]!;
      gameManager.playCard(game.id, "p1", card.id, card.allowedRows[0]!);

      const updatedGame = gameManager.getGame(game.id)!;

      // Check consistency
      expect(updatedGame.players[0].hand.length).toBe(initialHandSize - 1);
      expect(updatedGame.turnCount).toBe(2);
      expect(updatedGame.currentPlayerIndex).toBe(1);
    });

    it("should update statistics correctly", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      const initialStats = gameManager.getGameStats(game.id);
      expect(initialStats?.currentRound).toBe(1);

      // Play and pass
      const card = game.players[0].hand[0]!;
      gameManager.playCard(game.id, "p1", card.id, card.allowedRows[0]!);

      const updatedStats = gameManager.getGameStats(game.id);
      expect(updatedStats?.currentRound).toBe(1);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid actions gracefully", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      // Try to play opponent's card
      const p2Card = game.players[1].hand[0]!;
      const result = gameManager.playCard(
        game.id,
        "p1",
        p2Card.id,
        p2Card.allowedRows[0]!
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject actions on non-existent game", () => {
      const result = gameManager.playCard("fake-id", "p1", "card-id", "melee");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Game not found");
    });

    it("should reject pass when already passed", () => {
      const game = gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );

      gameManager.passRound(game.id, "p1");

      // Advance to p1's turn again
      const card = gameManager.getGame(game.id)!.players[1].hand[0]!;
      gameManager.playCard(game.id, "p2", card.id, card.allowedRows[0]!);

      // Try to pass again
      const result = gameManager.passRound(game.id, "p1");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Player cannot act at this time.");
    });
  });
});
