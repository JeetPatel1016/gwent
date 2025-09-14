import { Faction } from "./Factions.js";
import { Card } from "./Cards.js";

export interface Deck {
  id: string;
  name: string;
  faction: Faction;
  cards: Card[];
  leader?: Card;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeckValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
