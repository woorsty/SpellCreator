import { CharacterClass } from "./character-class";

export type Class = {
  Name: CharacterClass;
  PrimaryAbility: string;
  HitDie: number;
  SavingThrows: string[];
  Proficiencies: Proficience;
  Equipment: string[];
  ProficiencBonus: number[];
  Features: ClassFeature[];
  Subclasses: Subclass[];
};

export type Proficience = {
  Skills: string[];
  Armor: string[];
  Weapons: string[];
  SkillNumber: number;
};

export type ClassFeature = {
  Name: string;
  Description: string;
  Stufe: number;
  HöhereStufe?: string;
  Reference?: string;
};

export type Subclass = {
  Id: string;
  Name: string;
  Description: string;
  Features: ClassFeature[];
};
