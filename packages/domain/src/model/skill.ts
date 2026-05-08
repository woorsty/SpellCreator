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

export type SkillOf<A extends Attribute> = (typeof ATTRIBUTE_SKILLS)[A][number];

export type AllSkills = (typeof ATTRIBUTE_SKILLS)[Attribute][number];

export type AttributeValues = {
  value: number;
  proficiency: boolean;
};

export type SkillValues = {
  expertise: boolean;
  proficiency: boolean;
};

export type CharacterAttributes = {
  [A in Attribute]: AttributeValues;
};

export type CharacterSkills = {
  [A in Attribute]: {
    [S in SkillOf<A>]: SkillValues;
  };
};

export type SkillViewModel<A extends Attribute> = {
  name: SkillOf<A>;
  attributeName: A;
  value: number;
  proficiency: boolean;
  expertiese: boolean;
  modifier: number;
};

export type AttributeViewModel = {
  name: Attribute;
  modifier: number;
  savingThrow: number;
  value: number;
  proficiency: boolean;
};
