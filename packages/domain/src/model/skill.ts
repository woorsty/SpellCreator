export const ATTRIBUTE_SKILLS = {
  strength: ["athletics"],
  dexterity: ["acrobatics", "sleightOfHand", "stealth"],
  constitution: [],
  intelligence: ["arcana", "history", "investigation", "nature", "religion"],
  wisdom: ["animalHandling", "insight", "medicine", "perception", "survival"],
  charisma: ["deception", "intimidation", "performance", "persuasion"],
} as const;

export const ATTRIBUTES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

export type Attribute = keyof typeof ATTRIBUTE_SKILLS;

type SkillOf<A extends Attribute> = (typeof ATTRIBUTE_SKILLS)[A][number];

export type AllSkills = (typeof ATTRIBUTE_SKILLS)[Attribute][number];

type ProficiencyBlock = {
  proficiency: boolean;
  modifier: number;
};

export type AttributeValues = ProficiencyBlock & {
  value: number;
  savingThrow: number;
};

export type CharacterAttributes = {
  [A in Attribute]: AttributeValues;
};

export type CharacterSkills = {
  [A in Attribute]: {
    [S in SkillOf<A>]: ProficiencyBlock & {
      expertise: boolean;
    };
  };
};
