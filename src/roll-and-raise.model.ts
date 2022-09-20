export enum OptionKeys {
  BASE = "base",
  EXPLODE = "explode",
  LEGENDARY = "legendary",
  PLUSONE = "plusOne",
  REROLL = "reroll",
  VIVRE = "vivre",
}

export interface RollAndRaiseOptions {
  [OptionKeys.BASE]: number;
  [OptionKeys.EXPLODE]?: boolean;
  [OptionKeys.LEGENDARY]?: boolean;
  [OptionKeys.PLUSONE]?: boolean;
  [OptionKeys.REROLL]?: boolean;
  [OptionKeys.VIVRE]?: number;
}

export interface RaiseSet {
  sets: number[][];
  remainders: number[];
}
