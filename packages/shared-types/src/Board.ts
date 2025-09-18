import { Card } from "./Cards.js";

export type WeatherType = "fog" | "frost" | "rain" | "clear";
export type RowType = "melee" | "ranged" | "siege";

export interface BoardRow {
  type: RowType;
  cards: Card[];
}
