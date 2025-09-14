export interface AbilityEffect {
  type:
    | "damage"
    | "boost"
    | "spawn"
    | "draw"
    | "ressurect"
    | "weather"
    | "clear-weather"
    | "spy"
    | "scorch";
  value?: number;
  target:
    | "self"
    | "random-enemy"
    | "strongest-enemy"
    | "weakest-enemy"
    | "all-enemies"
    | "all-allies"
    | "row";
  condition?: string;
}

export interface CardAbility {
  id: string;
  name: string;
  description: string;
  trigger: "deploy" | "destroy" | "round-end" | "round-start" | "passive";
  effects: AbilityEffect[];
}
