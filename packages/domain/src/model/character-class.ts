import { Attribute } from "./skill";

export enum CharacterClassId {
  ARTEFICER = "arteficer",
  BABARIAN = "barbarian",
  BARD = "bard",
  CLERIC = "cleric",
  DRUID = "druid",
  FIGHTER = "fighter",
  MONK = "monk",
  PALADIN = "paladin",
  RANGER = "ranger",
  ROUGE = "rouge",
  SORCERER = "sorcerer",
  WARLOCK = "warlock",
  WIZARD = "wizard",
}

export type CharacterClass = {
  id: CharacterClassId;
  primaryAbility: Attribute[];
  hitDice: number;
  savingThrows: string[];
  proficiencies: Proficience;
  equipment: string[];
  features: ClassFeature[];
  subclasses: Subclass[];
  castingAttribute?: Attribute | null;
};

export type Proficience = {
  skills: string[];
  armor: string[];
  weapons: string[];
  skillNumber: number;
};

export type ClassFeature = {
  id: string;
  level: number;
  notes?: string;
};

export type Subclass = {
  id: string;
  features: ClassFeature[];
  castingAttribute?: Attribute | null;
};
