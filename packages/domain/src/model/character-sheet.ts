import { Spell } from "./spell";
import { DamageCantrip } from "./damage-cantrip";
import { AttributeValues, CharacterAttributes, CharacterSkills } from "./skill";
import { Weapon } from "./weapon";
import { Alignment } from "./alignment";
import { Species } from "./species";
import { CharacterClass } from "./character-class";
import { EquipmentItem } from "./equipment";

export type CharacterSheet = {
  name: string;
  background: string;
  characterClass: CharacterClass;
  species: Species;
  subclass: string | null;

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

  heroicInspiration: boolean;

  lightArmorTraining: boolean;
  mediumArmorTraining: boolean;
  heavyArmorTraining: boolean;
  shieldTraining: boolean;
  weaponTrainingSimple: boolean;
  weaponTrainingMartial: boolean;
  toolProficiencies: string[];

  initiative: number;
  speed: number;
  size: string;
  passivePerception: number;

  weapons: Weapon[];
  damageCantrips: DamageCantrip[];

  classFeatures: string[];
  speciesTraits: string[];
  feats: string[];

  spellcastingAbility: AttributeValues | null;
  spellSaveDC: number;
  spellAttackBonus: number;

  totalSpellSlots1: number;
  totalSpellSlots2: number;
  totalSpellSlots3: number;
  totalSpellSlots4: number;
  totalSpellSlots5: number;
  totalSpellSlots6: number;
  totalSpellSlots7: number;
  totalSpellSlots8: number;
  totalSpellSlots9: number;

  usedSpellSlots1: number;
  usedSpellSlots2: number;
  usedSpellSlots3: number;
  usedSpellSlots4: number;
  usedSpellSlots5: number;
  usedSpellSlots6: number;
  usedSpellSlots7: number;
  usedSpellSlots8: number;
  usedSpellSlots9: number;

  cantripsAndPreparedSpells: Spell[];

  appearance: string;
  backstory: string;
  alignment: Alignment;
  languages: string[];
  equipment: EquipmentItem[];
  attunedMagicItems: string[];

  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
};
