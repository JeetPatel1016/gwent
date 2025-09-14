import { Faction } from "./Factions.js";
import { Card } from "./Cards.js";
import { BoardRow } from "./Board.js";

export interface Player {
  id: string;
  name: string;
  faction: Faction;

  hand: Card[];
  deck: Card[];
  graveyard: Card[];

  boardRows: {
    melee: BoardRow;
    ranged: BoardRow;
    siege: BoardRow;
  };

  roundsWon: number;
  hasPassed: boolean;
  lives: number;

  leader?: Card;
  leaderUsed: boolean;
}
