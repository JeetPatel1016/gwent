export interface GameEvent {
  type:
    | "card-played"
    | "round-ended"
    | "game-ended"
    | "player-passed"
    | "ability-triggered";
  data: any;
  timestamp: Date;
}
