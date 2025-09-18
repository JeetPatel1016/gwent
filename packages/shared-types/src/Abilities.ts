export interface AbilityEffect {
  type:
    | "agile"
    | "medic"
    | "morale_boost"
    | "muster"
    | "spy"
    | "tight_bond"
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
