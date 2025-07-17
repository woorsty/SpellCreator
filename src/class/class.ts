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

export type Proficience = {
  Skills: string[];
  Armor: string[];
  Weapons: string[];
  SkillNumber: number;
};

export type ClassFeature = {
  Name: string;
  Description: string;
  Level: number;
  HigherLevels?: string;
  Reference?: string;
};

export type Subclass = {
  Name: string;
  Description: string;
  Features: ClassFeature[];
};
