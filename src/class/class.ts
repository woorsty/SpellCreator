export type Class = {
  Name: string;
  PrimaryAbility: string;
  HitDie: number;
  SavingThrows: string[];
  Proficiencies: Proficience;
  Equipment: string[];
  ProficiencBonus: number[];
  Features: ClassFeature[];
};

type Proficience = {
  Skills: string[];
  Armor: string[];
  Weapons: string[];
  SkillNumber: number;
};

type ClassFeature = {
  Name: string;
  Description: string;
  Level: number;
  HigherLevels?: string;
};

type Subclass = {
  Name: string;
  Description: string;
  Features: ClassFeature[];
};
