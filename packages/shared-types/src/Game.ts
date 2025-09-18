import { WeatherType } from "./Board.js";
import { Player } from "./Players.js";

export interface Round {
  number: 1 | 2 | 3;
  winner?: string;
  player1Score: number;
  player2Score: number;
  isComplete: boolean;
}

export type RoundOutcome =
  | "PLAYER_1_WINS"
  | "PLAYER_2_WINS"
  | "DRAW"
  | "ONGOING";

export type GameOutcome =
  | "PLAYER_1_WINS"
  | "PLAYER_2_WINS"
  | "DRAW"
  | "ONGOING";

export interface GameState {
  id: string;
  players: [Player, Player];
  activeWeathers: WeatherType[];

  currentRound: Round;
  rounds: Round[];

  currentPlayerIndex: 0 | 1;
  turnCount: number;

  status: "waiting" | "in-progress" | "finished";
  winner?: string;

  createdAt: Date;
  updatedAt: Date;
}
