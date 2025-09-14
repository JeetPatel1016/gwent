import { Card } from "@gwent/shared-types";
import { validateCard } from "../validation/index.js";
import * as fs from "fs/promises";
import * as path from "path";

export async function loadCardsFromJSON(filePath: string): Promise<Card[]> {
  try {
    const jsonData = await fs.readFile(filePath, "utf-8");
    const cardsData = JSON.parse(jsonData);

    const validatedCards: Card[] = [];
    const errors: string[] = [];

    for (const cardData of cardsData) {
      const validation = validateCard(cardData);
      if (validation.isValid && validation.card) {
        validatedCards.push(validation.card);
      } else {
        errors.push(
          `Invalid card ${cardData.id || "unknown"}: ${validation.errors.join(", ")}`
        );
      }
    }

    if (errors.length > 0) {
      console.warn("Card validation errors:", errors);
    }

    return validatedCards;
  } catch (error) {
    console.error(`Failed to load cards from ${filePath}:`, error);
    return [];
  }
}

export async function saveCardsToJSON(
  cards: Card[],
  filePath: string
): Promise<void> {
  try {
    const jsonData = JSON.stringify(cards, null, 2);
    await fs.writeFile(filePath, jsonData, "utf-8");
    console.log(`Saved ${cards.length} cards to ${filePath}`);
  } catch (error) {
    console.error(`Failed to save cards to ${filePath}:`, error);
  }
}

export function convertTSCardsToJSON(tsCards: Card[]): Card[] {
  // Validate and clean the cards for JSON export
  return tsCards.map((card) => {
    const validation = validateCard(card);
    if (!validation.isValid) {
      throw new Error(
        `Invalid card ${card.id}: ${validation.errors.join(", ")}`
      );
    }
    return validation.card!;
  });
}

export async function loadAllFactionCards(): Promise<{
  [faction: string]: Card[];
}> {
  const dataDir = path.join(process.cwd(), "src", "data");

  const factions = ["northern-realms", "monsters", "scoia-tael"];
  const allCards: { [faction: string]: Card[] } = {};

  for (const faction of factions) {
    const filePath = path.join(dataDir, `${faction}.json`);
    allCards[faction] = await loadCardsFromJSON(filePath);
  }

  return allCards;
}
