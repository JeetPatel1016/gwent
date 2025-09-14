import { Player } from "./Players.js";
import { WeatherEffect } from "./Board.js";

export interface GameBoard {
  player1: Player;
  player2: Player;
  weatherEffect: WeatherEffect[];
}

export interface Round {
  number: 1 | 2 | 3;
  winner?: string;
  player1Score: number;
  player2Score: number;
  isComplete: boolean;
}

export interface GameState {
  id: string;
  players: [Player, Player];
  board: GameBoard;

  currentRound: Round;
  rounds: Round[];

  currentPlayerIndex: 0 | 1;
  turnCount: number;

  status: "waiting" | "in-progress" | "finished";
  winner?: string;

  createdAt: Date;
  updatedAt: Date;
}
