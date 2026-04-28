import { Spell } from "./spell";
import { Attribute } from "./attribute";
import { DamageCantrip } from "./damageCantrip";
import { Skill } from "./skill";
import { Weapon } from "./weapon";
import { Alignment } from "./Alignment";
import path from "path";
import { Species } from "./species";

export class CharacterSheet {
  name = "";
  background = "";
  class = "";
  species = Species.Human;
  subclass?: string;

  level = 1;
  xp = 0;

  armorClass = 0;

  currentHitpoints = 0;
  temporaryHitpoints = 0;
  maxHitpoints = 0;

  spentHitDice = 0;
  /**
   * Die Art des Trefferwürfels z.B. für W6: 6, für W8: 8, etc.
   */
  hitDiceValue = 0;

  successDeathSaves = 0;
  failedDeathSaves = 0;

  proficiencyBonus = 2;
  strength: Attribute = new Attribute();
  athletics: Skill = new Skill();

  dexterity: Attribute = new Attribute();
  acrobatics: Skill = new Skill();
  sleightOfHand: Skill = new Skill();
  stealth: Skill = new Skill();

  constitution: Attribute = new Attribute();

  intelligence: Attribute = new Attribute();
  arcana: Skill = new Skill();
  history: Skill = new Skill();
  investigation: Skill = new Skill();
  nature: Skill = new Skill();
  religion: Skill = new Skill();

  wisdom: Attribute = new Attribute();
  animalHandling: Skill = new Skill();
  insight: Skill = new Skill();
  medicine: Skill = new Skill();
  perception: Skill = new Skill();
  survival: Skill = new Skill();

  charisma: Attribute = new Attribute();
  deception: Skill = new Skill();
  intimidation: Skill = new Skill();
  performance: Skill = new Skill();
  persuasion: Skill = new Skill();

  lightArmorTraining = false;
  mediumArmorTraining = false;
  heavyArmorTraining = false;
  shieldTraining = false;
  weaponTrainingSimple = false;
  weaponTrainingMartial = false;
  toolTraining: string[] = [];

  initiative = 0;
  speed = 0;
  size = "";
  passivePerception = 0;

  weapons: Weapon[] = [];
  damageCantrips: DamageCantrip[] = [];

  classFeatures: string[] = [];
  speciesTraits: string[] = [];
  feats: string[] = [];

  spellcastingAbility: Attribute | null = null;
  spellSaveDC = 0;
  spellAttackBonus = 0;

  totalSpellSlots1 = 0;
  totalSpellSlots2 = 0;
  totalSpellSlots3 = 0;
  totalSpellSlots4 = 0;
  totalSpellSlots5 = 0;
  totalSpellSlots6 = 0;
  totalSpellSlots7 = 0;
  totalSpellSlots8 = 0;
  totalSpellSlots9 = 0;

  usedSpellSlots1 = 0;
  usedSpellSlots2 = 0;
  usedSpellSlots3 = 0;
  usedSpellSlots4 = 0;
  usedSpellSlots5 = 0;
  usedSpellSlots6 = 0;
  usedSpellSlots7 = 0;
  usedSpellSlots8 = 0;
  usedSpellSlots9 = 0;

  cantripsAndPreparedSpells: Spell[] = [];

  appearance = "";
  backstory = "";
  alignment: Alignment | null = null;
  languages: string[] = [];
  equipment: string[] = [];
  magicItemAttunement1 = "";
  magicItemAttunement2 = "";
  magicItemAttunement3 = "";

  copper = 0;
  silver = 0;
  electrum = 0;
  gold = 0;
  platinum = 0;

  public constructor(init?: Partial<CharacterSheet>) {
    Object.assign(this, init);
  }
}

export const JsonFilePath = path.join(__dirname, "../assets/characters.json");
