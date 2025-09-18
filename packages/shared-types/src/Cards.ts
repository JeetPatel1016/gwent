import { Faction, CardType } from "./Factions.js";
import { RowType } from "./Board.js";
import { CardAbility } from "./Abilities.js";

export interface Card {
  id: string;
  name: string;
  power: number;
  basePower: number;
  faction: Faction;
  type: CardType;
  allowedRows: RowType[];
  ability?: CardAbility;
  isHero: boolean;
  imageUrl?: string;
  description: string;
}
