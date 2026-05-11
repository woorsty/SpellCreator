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
  hitDie: number;
  savingThrows: string[];
  proficiencies: Proficience;
  equipment: string[];
  features: ClassFeature[];
  subclasses: Subclass[];
};

export type Proficience = {
  Skills: string[];
  Armor: string[];
  Weapons: string[];
  SkillNumber: number;
};

export type ClassFeature = {
  id: string;
  level: number;
};

export type Subclass = {
  id: string;
  features: ClassFeature[];
};
