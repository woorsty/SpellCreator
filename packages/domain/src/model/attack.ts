import { DamageType } from "./damage-type";

export type Attack = {
  id: string;
  name: string;
  attackBonus: number;
  sg: number;
  damage: string;
  damageType: DamageType;
  notes?: string;
};
