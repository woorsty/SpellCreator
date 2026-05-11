import { Spell } from "./spell";
import { AttributeValues, CharacterAttributes, CharacterSkills } from "./skill";
import { Alignment } from "./alignment";
import { Species } from "./species";
import { CharacterClass, Subclass } from "./character-class";
import { EquipmentItem } from "./equipment";
import { ToolItem } from "./tool";
import { Attack } from "./attack";
import { Talent } from "./talent";
import { Background } from "./background";

export type CharacterSheet = {
  name: string;
  background: Background;
  characterClass: CharacterClass;
  species: Species;
  subclass: Subclass | null;

  level: number;
  xp: number;

  armorClass: number;

  currentHitpoints: number;
  temporaryHitpoints: number;
  maxHitpoints: number;

  spentHitDice: number;
  /**
   * Die Art des Trefferwürfels z.B. für W6: 6, für W8: 8, etc.
   */
  hitDiceValue: number;

  successDeathSaves: number;
  failedDeathSaves: number;

  proficiencyBonus: number;

  skills: CharacterSkills;
  attributes: CharacterAttributes;
  talents: Talent[];

  heroicInspiration: boolean;

  armorTraining: {
    light: boolean;
    medium: boolean;
    heavy: boolean;
    shield: boolean;
  };
  weaponTraining: {
    simple: boolean;
    martial: boolean;
    light: boolean;
    finesse: boolean;
  };
  toolProficiencies: ToolItem[];

  initiative: number;
  speed: number;
  size: string;
  passivePerception: number;

  attacks: Attack[];

  speciesTraits: string[];
  feats: string[];

  spellcastingAbility: AttributeValues | null;
  spellSaveDC: number;
  spellAttackBonus: number;

  spellSlots: {
    total: number[];
    used: number[];
  };

  preparedSpells: Spell[];

  appearance: string;
  story: string;
  alignment: Alignment;
  languages: string[];

  equipment: EquipmentItem[];
  attunedMagicItems: string[];

  coins: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
  };
};
