import { RowType } from "./Factions.js";
import { Card } from "./Cards.js";

export interface WeatherEffect {
  type: "fog" | "frost" | "rain" | "clear";
  affectedRows: RowType[];
  powerModifier: number;
}

export interface BoardRow {
  type: RowType;
  cards: Card[];
  weatherEffect: WeatherEffect;
}
