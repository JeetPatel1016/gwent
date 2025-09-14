import { Faction, CardType, RowType } from "./Factions.js";
import { CardAbility } from "./Abilities.js";

export type CardRarity = "bronze" | "silver" | "gold";

export interface Card {
  id: string;
  name: string;
  power: number;
  basePower: number;
  rarity: CardRarity;
  faction: Faction;
  type: CardType;
  row?: RowType;
  ability?: CardAbility;
  isHero: boolean;
  imageUrl?: string;
  description: string;
}
