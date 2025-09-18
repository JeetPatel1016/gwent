import { CardSchema, DeckSchema } from "./cardSchema.js";

export {
  CardSchema,
  DeckSchema,
  FactionSchema,
  CardTypeSchema,
  RowTypeSchema,
} from "./cardSchema.js";

export type CardValidationResult = {
  isValid: boolean;
  errors: string[];
  card?: any;
};

export type DeckValidationResult = {
  isValid: boolean;
  errors: string[];
  deck?: any;
};

export function validateCard(cardData: unknown): CardValidationResult {
  const result = CardSchema.safeParse(cardData);

  if (result.success) {
    return {
      isValid: true,
      errors: [],
      card: result.data,
    };
  }

  return {
    isValid: false,
    errors: result.error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    ),
    card: null,
  };
}

export function validateDeck(deckData: unknown): DeckValidationResult {
  const result = DeckSchema.safeParse(deckData);

  if (result.success) {
    return {
      isValid: true,
      errors: [],
      deck: result.data,
    };
  }

  return {
    isValid: false,
    errors: result.error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    ),
    deck: null,
  };
}
