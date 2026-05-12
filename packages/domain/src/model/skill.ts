export const ATTRIBUTE_SKILLS = {
  strength: ["athletics"],
  dexterity: ["acrobatics", "sleightOfHand", "stealth"],
  constitution: [],
  intelligence: ["arcana", "history", "investigation", "nature", "religion"],
  wisdom: ["animalHandling", "insight", "medicine", "perception", "survival"],
  charisma: ["deception", "intimidation", "performance", "persuasion"],
} as const;

export type Attribute = keyof typeof ATTRIBUTE_SKILLS;
export type SkillOf<A extends Attribute> = (typeof ATTRIBUTE_SKILLS)[A][number];

export type SkillValues = {
  proficiency: boolean;
  expertise: boolean;
};

export type AttributeValues<A extends Attribute> = {
  value: number;
  proficiency: boolean;
  skills: {
    [S in SkillOf<A>]: SkillValues;
  };
};

export type CharacterAttributes = {
  [A in Attribute]: AttributeValues<A>;
};

export type AllSkills =
  (typeof ATTRIBUTE_SKILLS)[keyof typeof ATTRIBUTE_SKILLS][number];
