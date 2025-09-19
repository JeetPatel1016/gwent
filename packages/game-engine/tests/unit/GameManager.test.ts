import { describe, it, expect, beforeEach } from "@jest/globals";
import { GameManager } from "../../src/game/GameManager";
import { createTestDeck, resetTestCounters } from "../helpers/testData";

describe("GameManager", () => {
  let gameManager: GameManager;
  let player1Deck: any[];
  let player2Deck: any[];

  beforeEach(() => {
    resetTestCounters();
    gameManager = new GameManager();
    player1Deck = createTestDeck(25);
    player2Deck = createTestDeck(25);
  });

  describe("createGame", () => {
    it("should create a new game with two players", () => {
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

      expect(game).toBeDefined();
      expect(game.players).toHaveLength(2);
      expect(game.players[0].name).toBe("Alice");
      expect(game.players[1].name).toBe("Bob");
      expect(game.status).toBe("in-progress");
    });

    it("should initialize players with correct hand size", () => {
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

      expect(game.players[0].hand.length).toBe(10);
      expect(game.players[1].hand.length).toBe(10);
    });

    it("should store the game", () => {
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

      const retrieved = gameManager.getGame(game.id);
      expect(retrieved).toEqual(game);
    });
  });

  describe("playCard", () => {
    it("should successfully play a card", () => {
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

      const card = game.players[0].hand[0]!;
      const result = gameManager.playCard(
        game.id,
        "p1",
        card.id,
        card.allowedRows[0]!
      );

      expect(result.success).toBe(true);
      expect(result.newState?.currentPlayerIndex).toBe(1);
    });

    it("should return error for invalid game id", () => {
      const result = gameManager.playCard(
        "invalid-id",
        "p1",
        "card-id",
        "melee"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Game not found");
    });
  });

  describe("passRound", () => {
    it("should successfully pass round", () => {
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

      const result = gameManager.passRound(game.id, "p1");

      expect(result.success).toBe(true);
      expect(result.newState?.players[0].hasPassed).toBe(true);
    });

    it("should return error for invalid game id", () => {
      const result = gameManager.passRound("invalid-id", "p1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Game not found");
    });
  });

  describe("getGame", () => {
    it("should retrieve existing game", () => {
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

      const retrieved = gameManager.getGame(game.id);

      expect(retrieved).toEqual(game);
    });

    it("should return null for non-existent game", () => {
      const retrieved = gameManager.getGame("invalid-id");
      expect(retrieved).toBeNull();
    });
  });

  describe("getCurrentPlayer", () => {
    it("should return current player", () => {
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

      const currentPlayer = gameManager.getCurrentPlayer(game.id);

      expect(currentPlayer?.id).toBe("p1");
    });

    it("should return null for invalid game", () => {
      const currentPlayer = gameManager.getCurrentPlayer("invalid-id");
      expect(currentPlayer).toBeNull();
    });
  });

  describe("isRoundComplete", () => {
    it("should return true when both players passed", () => {
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
      gameManager.passRound(game.id, "p2");

      console.log(game.players[0].hasPassed && game.players[1].hasPassed)
      const isComplete = gameManager.isRoundComplete(game.id);
      expect(isComplete).toBe(true);
    });

    it("should return false when round ongoing", () => {
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

      const isComplete = gameManager.isRoundComplete(game.id);
      expect(isComplete).toBe(false);
    });
  });

  describe("getGameStats", () => {
    it("should return correct game statistics", () => {
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

      const stats = gameManager.getGameStats(game.id);

      expect(stats).toBeDefined();
      expect(stats?.currentRound).toBe(1);
      expect(stats?.player1Lives).toBe(2);
      expect(stats?.player2Lives).toBe(2);
      expect(stats?.player1RoundsWon).toBe(0);
      expect(stats?.player2RoundsWon).toBe(0);
      expect(stats?.isFinished).toBe(false);
    });
  });

  describe("deleteGame", () => {
    it("should delete existing game", () => {
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

      const deleted = gameManager.deleteGame(game.id);
      expect(deleted).toBe(true);

      const retrieved = gameManager.getGame(game.id);
      expect(retrieved).toBeNull();
    });

    it("should return false for non-existent game", () => {
      const deleted = gameManager.deleteGame("invalid-id");
      expect(deleted).toBe(false);
    });
  });

  describe("clearAllGames", () => {
    it("should clear all games", () => {
      gameManager.createGame(
        "p1",
        "Alice",
        player1Deck,
        "northern-realms",
        "p2",
        "Bob",
        player2Deck,
        "monsters"
      );
      gameManager.createGame(
        "p3",
        "Charlie",
        player1Deck,
        "scoia-tael",
        "p4",
        "Dave",
        player2Deck,
        "monsters"
      );

      expect(gameManager.getGameCount()).toBe(2);

      gameManager.clearAllGames();
      expect(gameManager.getGameCount()).toBe(0);
    });
  });
});
