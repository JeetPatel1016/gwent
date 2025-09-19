import { describe, it, expect } from "@jest/globals";

import {
  calculateCardPower,
  calculateRowPower,
  isCardAffectedByWeather,
  findCardById,
  removeCardById,
  addCardToRow,
  removeCardFromRow,
  shuffleDeck,
  drawCards,
  canPlayCardInRow,
  calculatePlayerScore,
  hasPlayableCards,
  modifyCardPower,
} from "../../src/utils/GameUtils";
import {
  createTestCard,
  createHeroCard,
  createAgileCard,
  createTestBoardRow,
  createTestDeck,
} from "../helpers/testData";

describe("GameUtils", () => {
  describe("calculateCardPower", () => {
    it("should return card power for normal card without weather", () => {
      const card = createTestCard({ power: 5 });
      const power = calculateCardPower(card, "melee", []);
      expect(power).toBe(5);
    });

    it("should reduce power to 1 when affected by weather", () => {
      const card = createTestCard({ power: 5 });
      const power = calculateCardPower(card, "melee", ["frost"]);
      expect(power).toBe(1);
    });

    it("should not affect hero cards with weather", () => {
      const card = createHeroCard({ power: 10 });
      const power = calculateCardPower(card, "melee", ["frost"]);
      expect(power).toBe(10);
    });

    it("should not reduce power for unaffected rows", () => {
      const card = createTestCard({ power: 5 });
      const power = calculateCardPower(card, "melee", ["fog"]); // fog affects ranged
      expect(power).toBe(5);
    });
  });

  describe("calculateRowPower", () => {
    it("should return 0 for empty row", () => {
      const row = createTestBoardRow("melee");
      const power = calculateRowPower(row, []);
      expect(power).toBe(0);
    });

    it("should sum all card powers in row", () => {
      const cards = [
        createTestCard({ id: "1", power: 3 }),
        createTestCard({ id: "2", power: 5 }),
        createTestCard({ id: "3", power: 2 }),
      ];
      const row = createTestBoardRow("melee", cards);
      const power = calculateRowPower(row, []);
      expect(power).toBe(10);
    });

    it("should apply weather effects to non-hero cards", () => {
      const cards = [
        createTestCard({ id: "1", power: 3 }),
        createHeroCard({ id: "2", power: 10 }),
        createTestCard({ id: "3", power: 5 }),
      ];
      const row = createTestBoardRow("melee", cards);
      const power = calculateRowPower(row, ["frost"]);
      expect(power).toBe(12); // 1 + 10 + 1
    });
  });

  describe("isCardAffectedByWeather", () => {
    it("should return true when card row matches weather", () => {
      const card = createTestCard();
      const affected = isCardAffectedByWeather(card, "melee", ["frost"]);
      expect(affected).toBe(true);
    });
    it("should not affect even agile cards if card row does not match weather", () => {
      const card = createTestCard({
        allowedRows: ["melee", "ranged"],
      });
      const affected = isCardAffectedByWeather(card, "melee", ["fog"]);
      expect(affected).toBe(false);
    });

    it("should return false for heroes", () => {
      const card = createHeroCard();
      const affected = isCardAffectedByWeather(card, "melee", ["frost"]);
      expect(affected).toBe(false);
    });

    it("should return false for clear weather", () => {
      const card = createTestCard();
      const affected = isCardAffectedByWeather(card, "melee", ["clear"]);
      expect(affected).toBe(false);
    });
  });

  describe("findCardById", () => {
    it("should find card by id", () => {
      const cards = [
        createTestCard({ id: "card-1" }),
        createTestCard({ id: "card-2" }),
        createTestCard({ id: "card-3" }),
      ];
      const found = findCardById(cards, "card-2");
      expect(found?.id).toBe("card-2");
    });

    it("should return undefined if card not found", () => {
      const cards = [createTestCard({ id: "card-1" })];
      const found = findCardById(cards, "nonexistent");
      expect(found).toBeUndefined();
    });
  });

  describe("removeCardById", () => {
    it("should remove card from array", () => {
      const cards = [
        createTestCard({ id: "card-1" }),
        createTestCard({ id: "card-2" }),
        createTestCard({ id: "card-3" }),
      ];
      const result = removeCardById(cards, "card-2");
      expect(result).toHaveLength(2);
      expect(result.find((c) => c.id === "card-2")).toBeUndefined();
    });

    it("should not modify original array", () => {
      const cards = [createTestCard({ id: "card-1" })];
      const result = removeCardById(cards, "card-1");
      expect(cards).toHaveLength(1);
      expect(result).toHaveLength(0);
    });
  });

  describe("addCardToRow", () => {
    it("should add card to row", () => {
      const row = createTestBoardRow("melee");
      const card = createTestCard();
      const result = addCardToRow(row, card);
      expect(result.cards).toHaveLength(1);
      expect(result.cards[0]?.id).toBe(card.id);
    });

    it("should not modify original row", () => {
      const row = createTestBoardRow("melee");
      const card = createTestCard();
      const result = addCardToRow(row, card);
      expect(row.cards).toHaveLength(0);
      expect(result.cards)?.toHaveLength(1);
    });
  });

  describe("removeCardFromRow", () => {
    it("should remove card from row", () => {
      const card = createTestCard({ id: "card-1" });
      const row = createTestBoardRow("melee", [card]);
      const result = removeCardFromRow(row, "card-1");
      expect(result.cards).toHaveLength(0);
    });
  });

  describe("shuffleDeck", () => {
    it("should return array of same length", () => {
      const deck = createTestDeck(10);
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(10);
    });

    it("should contain same cards", () => {
      const deck = createTestDeck(10);
      const shuffled = shuffleDeck(deck);
      expect(shuffled.map((c) => c.id).sort()).toEqual(
        deck.map((c) => c.id).sort()
      );
    });

    it("should not modify original array", () => {
      const deck = createTestDeck(5);
      const original = [...deck];
      shuffleDeck(deck);
      expect(deck).toEqual(original);
    });
  });

  describe("drawCards", () => {
    it("should draw correct number of cards", () => {
      const deck = createTestDeck(10);
      const { drawnCards, remainingDeck } = drawCards(deck, 3);
      expect(drawnCards).toHaveLength(3);
      expect(remainingDeck).toHaveLength(7);
    });

    it("should draw from top of deck", () => {
      const deck = createTestDeck(5);
      const { drawnCards } = drawCards(deck, 2);
      expect(drawnCards[0]?.id).toBe(deck[0]?.id);
      expect(drawnCards[1]?.id).toBe(deck[1]?.id);
    });

    it("should handle drawing all cards", () => {
      const deck = createTestDeck(3);
      const { drawnCards, remainingDeck } = drawCards(deck, 3);
      expect(drawnCards).toHaveLength(3);
      expect(remainingDeck).toHaveLength(0);
    });

    it("should handle drawing more than available", () => {
      const deck = createTestDeck(3);
      const { drawnCards, remainingDeck } = drawCards(deck, 5);
      expect(drawnCards).toHaveLength(3);
      expect(remainingDeck).toHaveLength(0);
    });
  });

  describe("canPlayCardInRow", () => {
    it("should allow card in its designated row", () => {
      const card = createTestCard({ allowedRows: ["melee"] });
      expect(canPlayCardInRow(card, "melee")).toBe(true);
    });

    it("should not allow card in wrong row", () => {
      const card = createTestCard({ allowedRows: ["melee"] });
      expect(canPlayCardInRow(card, "ranged")).toBe(false);
    });

    it("should allow agile card in multiple rows", () => {
      const card = createAgileCard();
      expect(canPlayCardInRow(card, "melee")).toBe(true);
      expect(canPlayCardInRow(card, "ranged")).toBe(true);
      expect(canPlayCardInRow(card, "siege")).toBe(false);
    });
  });

  describe("calculatePlayerScore", () => {
    it("should sum all row scores", () => {
      const playerRows = {
        melee: createTestBoardRow("melee", [createTestCard({ power: 3 })]),
        ranged: createTestBoardRow("ranged", [createTestCard({ power: 5 })]),
        siege: createTestBoardRow("siege", [createTestCard({ power: 2 })]),
      };
      const score = calculatePlayerScore(playerRows, []);
      expect(score).toBe(10);
    });

    it("should apply weather to appropriate rows", () => {
      const playerRows = {
        melee: createTestBoardRow("melee", [createTestCard({ power: 5 })]),
        ranged: createTestBoardRow("ranged", [createTestCard({ power: 5 })]),
        siege: createTestBoardRow("siege", [createTestCard({ power: 5 })]),
      };
      const score = calculatePlayerScore(playerRows, ["frost"]); // affects melee
      expect(score).toBe(11); // 1 + 5 + 5
    });
  });

  describe("hasPlayableCards", () => {
    it("should return true when hand has unit cards", () => {
      const hand = [createTestCard({ type: "unit" })];
      expect(hasPlayableCards(hand)).toBe(true);
    });

    it("should return false for empty hand", () => {
      expect(hasPlayableCards([])).toBe(false);
    });
  });

  describe("modifyCardPower", () => {
    it("should modify card power", () => {
      const card = createTestCard({ power: 5 });
      const modified = modifyCardPower(card, 8);
      expect(modified.power).toBe(8);
    });

    it("should not allow negative power", () => {
      const card = createTestCard({ power: 5 });
      const modified = modifyCardPower(card, -3);
      expect(modified.power).toBe(0);
    });

    it("should not modify original card", () => {
      const card = createTestCard({ power: 5 });
      modifyCardPower(card, 8);
      expect(card.power).toBe(5);
    });
  });
});
