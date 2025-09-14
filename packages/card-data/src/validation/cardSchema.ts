import { z } from "zod";

export const FactionSchema = z.enum([
  "northern-realms",
  "monsters",
  "scoia-tael",
  "nilfgaard",
  "skellige",
]);

export const CardTypeSchema = z.enum(["unit", "spell", "weather", "leader"]);

export const RowTypeSchema = z.enum(["melee", "ranged", "siege"]);

export const CardRaritySchema = z.enum(["bronze", "silver", "gold"]);

export const AbilityEffectSchema = z.object({
  type: z.enum([
    "damage",
    "boost",
    "spawn",
    "draw",
    "resurrect",
    "weather",
    "clear-weather",
    "spy",
    "scorch",
  ]),
  value: z.number().optional(),
  target: z
    .enum([
      "self",
      "random-enemy",
      "strongest-enemy",
      "weakest-enemy",
      "all-enemies",
      "all-allies",
      "row",
    ])
    .optional(),
  condition: z.string().optional(),
});
export const CardAbilitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  trigger: z.enum(["deploy", "destroy", "round-end", "round-start", "passive"]),
  effects: z.array(AbilityEffectSchema),
});

export const CardSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    power: z.number().min(0).max(15),
    basePower: z.number().min(0).max(15),
    faction: FactionSchema,
    type: CardTypeSchema,
    rarity: CardRaritySchema,
    row: RowTypeSchema.optional(),
    ability: CardAbilitySchema.optional(),
    isHero: z.boolean(),
    imageUrl: z.string().url().optional(),
    description: z.string().optional(),
  })
  .refine(
    (card) => {
      // Unit cards must have a row
      if (card.type === "unit" && !card.row) {
        return false;
      }
      // Non-unit cards shouldn't have a row
      if (card.type !== "unit" && card.row) {
        return false;
      }
      // Power and basePower should match initially
      if (card.power !== card.basePower) {
        return false;
      }
      return true;
    },
    {
      message:
        "Card validation failed: unit cards must have a row, power must equal basePower",
    }
  );

export const DeckSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    faction: FactionSchema,
    cards: z.array(CardSchema),
    leader: CardSchema.optional(),
    isValid: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .refine(
    (deck) => {
      // Deck size validation
      if (deck.cards.length < 22 || deck.cards.length > 40) {
        return false;
      }

      // All cards must be from same faction
      const validFactionCards = deck.cards.every(
        (card) => card.faction === deck.faction
      );
      if (!validFactionCards) {
        return false;
      }

      // No more than 3 copies of any bronze card
      const cardCounts = new Map<string, number>();
      for (const card of deck.cards) {
        const count = cardCounts.get(card.id) || 0;
        if (card.rarity === "bronze" && count >= 3) {
          return false;
        }
        if (card.rarity === "silver" && count >= 1) {
          return false;
        }
        if (card.rarity === "gold" && count >= 1) {
          return false;
        }
        cardCounts.set(card.id, count + 1);
      }

      return true;
    },
    {
      message:
        "Invalid deck: check size (22-40 cards), faction consistency, and card limits",
    }
  );
