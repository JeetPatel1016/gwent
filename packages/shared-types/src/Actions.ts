import { RowType } from "./Board.js";

export type GameActionType =
  | "play-card"
  | "pass"
  | "use-leader"
  | "trigger-ability"
  | "mulligan"
  | "concede";

export interface BaseGameAction {
  type: GameActionType;
  playerId: string;
  timestamp: Date;
}

export interface PlayCardAction extends BaseGameAction {
  type: "play-card";
  cardId: string;
  targetRow?: RowType;
  targetCardId?: string;
  targetPosition?: number;
}

export interface PassAction extends BaseGameAction {
  type: "pass";
}

export interface UseLeaderAction extends BaseGameAction {
  type: "use-leader";
  targetCardId?: string;
  targetRow?: RowType;
}

export interface TriggerAbilityAction extends BaseGameAction {
  type: "trigger-ability";
  abilityId: string;
  sourceCardId: string;
  targetCardId?: string;
  targetRow?: RowType;
}

export interface MulliganAction extends BaseGameAction {
  type: "mulligan";
  cardIds: string[];
}

export interface ConcedeAction extends BaseGameAction {
  type: "concede";
}

export type GameAction =
  | PlayCardAction
  | PassAction
  | UseLeaderAction
  | TriggerAbilityAction
  | MulliganAction
  | ConcedeAction;
