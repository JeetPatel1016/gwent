import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  playCard,
  passRound,
  advanceTurn,
  canPlayerAct,
  findPlayerById,
  validateCardPlay,
} from "../../src/actions/ActionProcessor";
import { createInitialGameState } from "../../src/game/GameState";
import { createPlayer } from "../../src/game/PlayerManager";
import {
  createTestCard,
  createTestDeck,
  resetTestCounters,
} from "../helpers/testData";
import { GameState } from "@gwent/shared-types";

describe("ActionProcessor", () => {
  let gameState: GameState;
  let player1Deck: any[];
  let player2Deck: any[];

  beforeEach(() => {
    resetTestCounters();
    player1Deck = createTestDeck(25);
    player2Deck = createTestDeck(25);

    const player1 = createPlayer(
      "p1",
      "Player 1",
      player1Deck,
      "northern-realms"
    );
    const player2 = createPlayer("p2", "Player 2", player2Deck, "monsters");

    gameState = createInitialGameState(player1, player2);
  });

  describe("playCard", () => {
    it("should successfully play a card from hand to board", () => {
      const card = gameState.players[0].hand[0]!;
      const result = playCard(gameState, "p1", card.id!, card.allowedRows[0]!);

      expect(result.success).toBe(true);
      expect(result.newState?.players[0].hand.length).toBe(9);
      expect(result.newState?.currentPlayerIndex).toBe(1);
    });

    it("should fail if not player turn", () => {
      const card = gameState.players[1].hand[0]!;
      const result = playCard(gameState, "p2", card.id!, card.allowedRows[0]!);

      expect(result.success).toBe(false);
      expect(result.error).toContain("cannot act");
    });

    it("should fail if card not in hand", () => {
      const result = playCard(gameState, "p1", "fake-card", "melee");

      expect(result.success).toBe(false);
      expect(result.error).toContain("not in player");
    });

    it("should fail if card played in wrong row", () => {
      const card = createTestCard({ allowedRows: ["melee"] });
      const player = gameState.players[0];
      player.hand.push(card);

      const result = playCard(gameState, "p1", card.id, "siege");

      expect(result.success).toBe(false);
      expect(result.error).toContain("cannot be played");
    });

    it("should fail if player already passed", () => {
      gameState.players[0].hasPassed = true;
      const card = gameState.players[0].hand[0]!;

      const result = playCard(gameState, "p1", card.id!, card.allowedRows[0]!);

      expect(result.success).toBe(false);
    });
  });

  describe("passRound", () => {
    it("should successfully pass when it is player turn", () => {
      const result = passRound(gameState, "p1");

      expect(result.success).toBe(true);
      expect(result.newState?.players[0].hasPassed).toBe(true);
      expect(result.newState?.currentPlayerIndex).toBe(1);
    });

    it("should not advance turn if opponent already passed", () => {
      gameState.players[1].hasPassed = true;
      const result = passRound(gameState, "p1");

      expect(result.success).toBe(true);
      expect(result.newState?.players[0].hasPassed).toBe(true);
      expect(result.newState?.currentPlayerIndex).toBe(0);
    });

    it("should fail if not player turn", () => {
      const result = passRound(gameState, "p2");

      expect(result.success).toBe(false);
    });

    it("should fail if player already passed", () => {
      gameState.players[0].hasPassed = true;
      const result = passRound(gameState, "p1");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Player cannot act at this time.");
    });
  });

  describe("advanceTurn", () => {
    it("should switch to next player", () => {
      const newState = advanceTurn(gameState);

      expect(newState.currentPlayerIndex).toBe(1);
      expect(newState.turnCount).toBe(2);
    });

    it("should cycle back to player 0 from player 1", () => {
      gameState.currentPlayerIndex = 1;
      const newState = advanceTurn(gameState);

      expect(newState.currentPlayerIndex).toBe(0);
      expect(newState.turnCount).toBe(2);
    });
  });

  describe("canPlayerAct", () => {
    it("should return true when it is player turn and not passed", () => {
      const result = canPlayerAct(gameState, "p1");
      expect(result).toBe(true);
    });

    it("should return false when not player turn", () => {
      const result = canPlayerAct(gameState, "p2");
      expect(result).toBe(false);
    });

    it("should return false when player passed", () => {
      gameState.players[0].hasPassed = true;
      const result = canPlayerAct(gameState, "p1");
      expect(result).toBe(false);
    });

    it("should return false when game not in progress", () => {
      gameState.status = "finished";
      const result = canPlayerAct(gameState, "p1");
      expect(result).toBe(false);
    });
  });

  describe("findPlayerById", () => {
    it("should find player 1 by id", () => {
      const result = findPlayerById(gameState, "p1");

      expect(result).not.toBeNull();
      expect(result?.player.id).toBe("p1");
      expect(result?.index).toBe(0);
    });

    it("should find player 2 by id", () => {
      const result = findPlayerById(gameState, "p2");

      expect(result).not.toBeNull();
      expect(result?.player.id).toBe("p2");
      expect(result?.index).toBe(1);
    });

    it("should return null for invalid id", () => {
      const result = findPlayerById(gameState, "invalid");
      expect(result).toBeNull();
    });
  });

  describe("validateCardPlay", () => {
    it("should validate correct card play", () => {
      const card = gameState.players[0].hand[0]!;
      const result = validateCardPlay(
        gameState,
        "p1",
        card.id,
        card.allowedRows[0]!
      );

      expect(result.valid).toBe(true);
    });

    it("should fail validation if wrong player", () => {
      const card = gameState.players[0].hand[0]!;
      const result = validateCardPlay(
        gameState,
        "p2",
        card.id,
        card.allowedRows[0]!
      );

      expect(result.valid).toBe(false);
    });

    it("should fail validation if card not in hand", () => {
      const result = validateCardPlay(gameState, "p1", "fake-card", "melee");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("not in player");
    });

    it("should fail validation if wrong row", () => {
      const card = createTestCard({ allowedRows: ["melee"] });
      gameState.players[0].hand.push(card);

      const result = validateCardPlay(gameState, "p1", card.id, "siege");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("cannot be played");
    });
  });
});
