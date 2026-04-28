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
  subclass = "";

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

  heroicInspiration = false;

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

  public static getTestCharacter(): CharacterSheet {
    return new CharacterSheet({
      name: "Test Character",
      background: "A brave adventurer",
      class: "Fighter",
      species: Species.Human,
      subclass: "Champion",
      level: 5,
      xp: 6500,
      armorClass: 16,
      currentHitpoints: 38,
      temporaryHitpoints: 0,
      maxHitpoints: 38,
      hitDiceValue: 10,
      successDeathSaves: 0,
      failedDeathSaves: 0,
      proficiencyBonus: 3,
      strength: new Attribute({
        value: 16,
        savingThrow: 5,
        proficiency: true,
        modifier: 3,
      }),
      athletics: new Skill({
        name: "Athletics",
        proficiency: true,
        modifier: 5,
      }),
      dexterity: new Attribute({
        value: 12,
        savingThrow: 1,
        proficiency: false,
        modifier: 1,
      }),
      acrobatics: new Skill({
        name: "Acrobatics",
        proficiency: false,
        modifier: 1,
      }),
      sleightOfHand: new Skill({
        name: "Sleight of Hand",
        proficiency: false,
        modifier: 1,
      }),
      stealth: new Skill({ name: "Stealth", proficiency: false, modifier: 1 }),
      constitution: new Attribute({
        value: 14,
        savingThrow: 2,
        proficiency: false,
        modifier: 2,
      }),
      intelligence: new Attribute({
        value: 10,
        savingThrow: 0,
        proficiency: false,
        modifier: 0,
      }),
      arcana: new Skill({ name: "Arcana", proficiency: false, modifier: 0 }),
      history: new Skill({ name: "History", proficiency: false, modifier: 0 }),
      investigation: new Skill({
        name: "Investigation",
        proficiency: false,
        modifier: 0,
      }),
      nature: new Skill({ name: "Nature", proficiency: false, modifier: 0 }),
      religion: new Skill({
        name: "Religion",
        proficiency: false,
        modifier: 0,
      }),
      wisdom: new Attribute({
        value: 8,
        savingThrow: -1,
        proficiency: false,
        modifier: -1,
      }),
      animalHandling: new Skill({
        name: "Animal Handling",
        proficiency: false,
        modifier: -1,
      }),
      insight: new Skill({ name: "Insight", proficiency: false, modifier: -1 }),
      medicine: new Skill({
        name: "Medicine",
        proficiency: false,
        modifier: -1,
      }),
      perception: new Skill({
        name: "Perception",
        proficiency: false,
        modifier: -1,
      }),
      survival: new Skill({
        name: "Survival",
        proficiency: false,
        modifier: -1,
      }),
      charisma: new Attribute({
        value: 10,
        savingThrow: 0,
        proficiency: false,
        modifier: 0,
      }),
      deception: new Skill({
        name: "Deception",
        proficiency: false,
        modifier: 0,
      }),
      intimidation: new Skill({
        name: "Intimidation",
        proficiency: false,
        modifier: 0,
      }),
      performance: new Skill({
        name: "Performance",
        proficiency: false,
        modifier: 0,
      }),
      persuasion: new Skill({
        name: "Persuasion",
        proficiency: false,
        modifier: 0,
      }),
      heroicInspiration: false,
      lightArmorTraining: true,
      mediumArmorTraining: true,
      heavyArmorTraining: false,
      shieldTraining: true,
      weaponTrainingSimple: true,
      weaponTrainingMartial: true,
      toolTraining: ["Smith's Tools"],
      initiative: 1,
      speed: 30,
      size: "Medium",
      passivePerception: 9,
      weapons: [
        new Weapon({
          name: "Longsword",
          attackBonus: 5,
          difficultyBonus: 3,
          damage: "1d8+3",
          damageType: "Slashing",
          notes: "Versatile (1d10)",
        }),
        new Weapon({
          name: "Shortbow",
          attackBonus: 5,
          difficultyBonus: 3,
          damage: "1d6+3",
          damageType: "Piercing",
          notes: "Range 80/320",
        }),
      ],
      damageCantrips: [],
      classFeatures: ["Second Wind", "Action Surge"],
      speciesTraits: ["Human Resilience"],
      feats: ["Great Weapon Fighting"],
      spellcastingAbility: null,
      spellSaveDC: 0,
      spellAttackBonus: 0,
      totalSpellSlots1: 0,
      totalSpellSlots2: 0,
      totalSpellSlots3: 0,
      totalSpellSlots4: 0,
      totalSpellSlots5: 0,
      totalSpellSlots6: 0,
      totalSpellSlots7: 0,
      totalSpellSlots8: 0,
      totalSpellSlots9: 0,
      usedSpellSlots1: 0,
      usedSpellSlots2: 0,
      usedSpellSlots3: 0,
      usedSpellSlots4: 0,
      usedSpellSlots5: 0,
      usedSpellSlots6: 0,
      usedSpellSlots7: 0,
      usedSpellSlots8: 0,
      usedSpellSlots9: 0,
      cantripsAndPreparedSpells: [],
      appearance:
        "A tall, muscular human with short brown hair and green eyes.",
      backstory:
        "Born in a small village, this character grew up learning the ways of the sword. After their village was attacked by bandits, they set out on a quest for justice and adventure.",
      alignment: Alignment.LawfulGood,
      languages: ["Common", "Dwarvish"],
      equipment: [
        "Explorer's Pack",
        "Tinderbox",
        "Rations (1 day)",
        "Waterskin",
      ],
      magicItemAttunement1: "Amulet of Health",
      magicItemAttunement2: "",
      magicItemAttunement3: "",
      copper: 10,
      silver: 5,
      electrum: 0,
      gold: 20,
      platinum: 0,
    });
  }
}

export const JsonFilePath = path.join(__dirname, "../assets/characters.json");
