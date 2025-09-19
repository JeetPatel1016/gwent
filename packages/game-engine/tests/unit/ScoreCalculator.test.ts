import { describe, it, expect } from "@jest/globals";
import {
  determineRoundWinner,
  isMatchOver,
  updatePlayerLives,
  calculateCurrentScores,
  shouldEndRound,
} from "../../src/utils/ScoreCalculator";
import {
  createTestPlayer,
  createTestCard,
  createTestBoardRow,
} from "../helpers/testData";

describe("ScoreCalculator", () => {
  describe("determineRoundWinner", () => {
    it("should return PLAYER_1_WINS when both passed and player 1 score is higher", () => {
      const player1 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 10 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 5 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("PLAYER_1_WINS");
    });

    it("should return PLAYER_2_WINS when both passed and player 2 score is higher", () => {
      const player1 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 3 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 8 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("PLAYER_2_WINS");
    });

    it("should return DRAW when both passed with equal scores", () => {
      const player1 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 5 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 5 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("DRAW");
    });

    it("should return DRAW when both passed with zero scores", () => {
      const player1 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee"),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee"),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("DRAW");
    });

    it("should return ONGOING when neither player has passed", () => {
      const player1 = createTestPlayer({ hasPassed: false });
      const player2 = createTestPlayer({ hasPassed: false });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("ONGOING");
    });

    it("should return ONGOING when only player 1 has passed", () => {
      const player1 = createTestPlayer({ hasPassed: true });
      const player2 = createTestPlayer({ hasPassed: false });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("ONGOING");
    });

    it("should return ONGOING when only player 2 has passed", () => {
      const player1 = createTestPlayer({ hasPassed: false });
      const player2 = createTestPlayer({ hasPassed: true });

      const result = determineRoundWinner(player1, player2, []);
      expect(result).toBe("ONGOING");
    });

    it("should calculate scores with weather effects applied", () => {
      const player1 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 10 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        hasPassed: true,
        boardRows: {
          melee: createTestBoardRow("melee"),
          ranged: createTestBoardRow("ranged", [createTestCard({ power: 2 })]),
          siege: createTestBoardRow("siege"),
        },
      });

      const result = determineRoundWinner(player1, player2, ["frost"]);
      expect(result).toBe("PLAYER_2_WINS");
    });
  });

  describe("isMatchOver", () => {
    it("should return PLAYER_1_WINS when player 1 has won 2 rounds", () => {
      const player1 = createTestPlayer({ roundsWon: 2, lives: 2 });
      const player2 = createTestPlayer({ roundsWon: 0, lives: 1 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_1_WINS");
    });

    it("should return PLAYER_2_WINS when player 2 has won 2 rounds", () => {
      const player1 = createTestPlayer({ roundsWon: 0, lives: 1 });
      const player2 = createTestPlayer({ roundsWon: 2, lives: 2 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_2_WINS");
    });

    it("should return PLAYER_1_WINS when player 1 has won 2 out of 3 rounds", () => {
      const player1 = createTestPlayer({ roundsWon: 2, lives: 1 });
      const player2 = createTestPlayer({ roundsWon: 1, lives: 1 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_1_WINS");
    });

    it("should return ONGOING when no player has won 2 rounds yet", () => {
      const player1 = createTestPlayer({ roundsWon: 1, lives: 1 });
      const player2 = createTestPlayer({ roundsWon: 1, lives: 1 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("ONGOING");
    });

    it("should return ONGOING when match just started", () => {
      const player1 = createTestPlayer({ roundsWon: 0, lives: 2 });
      const player2 = createTestPlayer({ roundsWon: 0, lives: 2 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("ONGOING");
    });

    it("should return PLAYER_2_WINS when player 1 has no lives left", () => {
      const player1 = createTestPlayer({ roundsWon: 1, lives: 0 });
      const player2 = createTestPlayer({ roundsWon: 1, lives: 1 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_2_WINS");
    });

    it("should return PLAYER_1_WINS when player 2 has no lives left", () => {
      const player1 = createTestPlayer({ roundsWon: 1, lives: 1 });
      const player2 = createTestPlayer({ roundsWon: 1, lives: 0 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_1_WINS");
    });

    it("should return DRAW when both players have no lives left", () => {
      const player1 = createTestPlayer({ roundsWon: 1, lives: 0 });
      const player2 = createTestPlayer({ roundsWon: 1, lives: 0 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("DRAW");
    });

    it("should prioritize round wins over lives", () => {
      const player1 = createTestPlayer({ roundsWon: 2, lives: 0 });
      const player2 = createTestPlayer({ roundsWon: 1, lives: 2 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_1_WINS");
    });

    it("should handle edge case where player wins with 3 rounds", () => {
      const player1 = createTestPlayer({ roundsWon: 3, lives: 0 });
      const player2 = createTestPlayer({ roundsWon: 0, lives: 2 });

      const result = isMatchOver(player1, player2);
      expect(result).toBe("PLAYER_1_WINS");
    });
  });

  describe("updatePlayerLives", () => {
    it("should reduce player 2 life when player 1 wins", () => {
      const result = updatePlayerLives(2, 2, "PLAYER_1_WINS");
      expect(result).toEqual({
        player1Lives: 2,
        player2Lives: 1,
      });
    });

    it("should reduce player 1 life when player 2 wins", () => {
      const result = updatePlayerLives(2, 2, "PLAYER_2_WINS");
      expect(result).toEqual({
        player1Lives: 1,
        player2Lives: 2,
      });
    });

    it("should reduce both lives on draw", () => {
      const result = updatePlayerLives(2, 2, "DRAW");
      expect(result).toEqual({
        player1Lives: 1,
        player2Lives: 1,
      });
    });

    it("should not reduce lives when round is ongoing", () => {
      const result = updatePlayerLives(2, 2, "ONGOING");
      expect(result).toEqual({
        player1Lives: 2,
        player2Lives: 2,
      });
    });

    it("should not allow lives below 0", () => {
      const result = updatePlayerLives(0, 2, "PLAYER_2_WINS");
      expect(result).toEqual({
        player1Lives: 0,
        player2Lives: 2,
      });
    });

    it("should handle when both players have 1 life and draw", () => {
      const result = updatePlayerLives(1, 1, "DRAW");
      expect(result).toEqual({
        player1Lives: 0,
        player2Lives: 0,
      });
    });
  });

  describe("calculateCurrentScores", () => {
    it("should calculate scores for both players", () => {
      const player1 = createTestPlayer({
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 5 })]),
          ranged: createTestBoardRow("ranged", [createTestCard({ power: 3 })]),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 2 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege", [createTestCard({ power: 4 })]),
        },
      });

      const scores = calculateCurrentScores(player1, player2, []);
      expect(scores).toEqual({
        player1Score: 8,
        player2Score: 6,
      });
    });

    it("should return zero scores for empty boards", () => {
      const player1 = createTestPlayer();
      const player2 = createTestPlayer();

      const scores = calculateCurrentScores(player1, player2, []);
      expect(scores).toEqual({
        player1Score: 0,
        player2Score: 0,
      });
    });

    it("should apply weather effects to scores", () => {
      const player1 = createTestPlayer({
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 10 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const player2 = createTestPlayer({
        boardRows: {
          melee: createTestBoardRow("melee", [createTestCard({ power: 5 })]),
          ranged: createTestBoardRow("ranged"),
          siege: createTestBoardRow("siege"),
        },
      });

      const scores = calculateCurrentScores(player1, player2, ["frost"]);
      expect(scores).toEqual({
        player1Score: 1, // Affected by frost
        player2Score: 1, // Affected by frost
      });
    });
  });

  describe("shouldEndRound", () => {
    it("should return true when both players have passed", () => {
      const player1 = createTestPlayer({ hasPassed: true });
      const player2 = createTestPlayer({ hasPassed: true });

      const result = shouldEndRound(player1, player2);
      expect(result).toBe(true);
    });

    it("should return false when neither player has passed", () => {
      const player1 = createTestPlayer({ hasPassed: false });
      const player2 = createTestPlayer({ hasPassed: false });

      const result = shouldEndRound(player1, player2);
      expect(result).toBe(false);
    });

    it("should return false when only player 1 has passed", () => {
      const player1 = createTestPlayer({ hasPassed: true });
      const player2 = createTestPlayer({ hasPassed: false });

      const result = shouldEndRound(player1, player2);
      expect(result).toBe(false);
    });

    it("should return false when only player 2 has passed", () => {
      const player1 = createTestPlayer({ hasPassed: false });
      const player2 = createTestPlayer({ hasPassed: true });

      const result = shouldEndRound(player1, player2);
      expect(result).toBe(false);
    });
  });
});
