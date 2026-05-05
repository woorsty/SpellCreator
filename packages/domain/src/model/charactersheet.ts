import { Spell } from "./spell";
import { Attribute } from "./attribute";
import { DamageCantrip } from "./damageCantrip";
import { Skill } from "./skill";
import { Weapon } from "./weapon";
import { Alignment } from "./Alignment";
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

  attributes: Attribute[] = [
    new Attribute("strength", false, 0, false, 0, 0, [
      new Skill("athletics", false, 0, false),
    ]),
    new Attribute("dexterity", false, 0, false, 0, 0, [
      new Skill("acrobatics", false, 0, false),
      new Skill("sleight of hand", false, 0, false),
      new Skill("stealth", false, 0, false),
    ]),
    new Attribute("constitution", false, 0, false, 0, 0, []),
    new Attribute("intelligence", false, 0, false, 0, 0, [
      new Skill("arcana", false, 0, false),
      new Skill("history", false, 0, false),
      new Skill("investigation", false, 0, false),
      new Skill("nature", false, 0, false),
      new Skill("religion", false, 0, false),
    ]),
    new Attribute("wisdom", false, 0, false, 0, 0, [
      new Skill("animal handling", false, 0, false),
      new Skill("insight", false, 0, false),
      new Skill("medicine", false, 0, false),
      new Skill("perception", false, 0, false),
      new Skill("survival", false, 0, false),
    ]),
    new Attribute("charisma", false, 0, false, 0, 0, [
      new Skill("deception", false, 0, false),
      new Skill("intimidation", false, 0, false),
      new Skill("performance", false, 0, false),
      new Skill("persuasion", false, 0, false),
    ]),
  ];

  heroicInspiration = false;

  lightArmorTraining = false;
  mediumArmorTraining = false;
  heavyArmorTraining = false;
  shieldTraining = false;
  weaponTrainingSimple = false;
  weaponTrainingMartial = false;
  toolProficiencies: string[] = [];

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
  alignment = Alignment.CHAOTIC_EVIL;
  languages: string[] = [];
  equipment: string[] = [];
  attunedMagicItems: string[] = [];

  copper = 0;
  silver = 0;
  electrum = 0;
  gold = 0;
  platinum = 0;

  public constructor(init?: Partial<CharacterSheet>) {
    Object.assign(this, init);
  }

  public getAttributeByName(name: string): Attribute | undefined {
    return this.attributes.find((attr) => attr.name === name);
  }

  public getSkillByName(name: string): Skill | undefined {
    for (const attr of this.attributes) {
      const skill = attr.skills.find((s) => s.name === name);
      if (skill) return skill;
    }
    return undefined;
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
      attributes: [
        new Attribute("strength", false, 0, false, 0, 0, [
          new Skill("athletics", false, 0, false),
        ]),
        new Attribute("dexterity", false, 0, false, 0, 0, [
          new Skill("acrobatics", false, 0, false),
          new Skill("sleight of hand", false, 0, false),
          new Skill("stealth", false, 0, false),
        ]),
        new Attribute("constitution", false, 0, false, 0, 0, []),
        new Attribute("intelligence", false, 0, false, 0, 0, [
          new Skill("arcana", false, 0, false),
          new Skill("history", false, 0, false),
          new Skill("investigation", false, 0, false),
          new Skill("nature", false, 0, false),
          new Skill("religion", false, 0, false),
        ]),
        new Attribute("wisdom", false, 0, false, 0, 0, [
          new Skill("animal handling", false, 0, false),
          new Skill("insight", false, 0, false),
          new Skill("medicine", false, 0, false),
          new Skill("perception", false, 0, false),
          new Skill("survival", false, 0, false),
        ]),
        new Attribute("charisma", true, 5, false, 20, 7, [
          new Skill("deception", false, -1, true),
          new Skill("intimidation", false, 5, false),
          new Skill("performance", true, 5, false),
          new Skill("persuasion", false, 2, false),
        ]),
      ],
      heroicInspiration: false,
      lightArmorTraining: true,
      mediumArmorTraining: true,
      heavyArmorTraining: false,
      shieldTraining: true,
      weaponTrainingSimple: true,
      weaponTrainingMartial: true,
      toolProficiencies: ["Smith's Tools"],
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
      spellSaveDC: 1,
      spellAttackBonus: 3,
      totalSpellSlots1: 4,
      totalSpellSlots2: 3,
      totalSpellSlots3: 3,
      totalSpellSlots4: 3,
      totalSpellSlots5: 3,
      totalSpellSlots6: 2,
      totalSpellSlots7: 1,
      totalSpellSlots8: 0,
      totalSpellSlots9: 0,
      usedSpellSlots1: 1,
      usedSpellSlots2: 0,
      usedSpellSlots3: 2,
      usedSpellSlots4: 0,
      usedSpellSlots5: 0,
      usedSpellSlots6: 0,
      usedSpellSlots7: 0,
      usedSpellSlots8: 0,
      usedSpellSlots9: 0,
      cantripsAndPreparedSpells: [Spell.getTestSpell()],
      appearance:
        "A tall, muscular human with short brown hair and green eyes.",
      backstory:
        "Born in a small village, this character grew up learning the ways of the sword. After their village was attacked by bandits, they set out on a quest for justice and adventure.",
      alignment: Alignment.LAWFUL_GOOD,
      languages: ["Common", "Dwarvish"],
      equipment: [
        "Explorer's Pack",
        "Tinderbox",
        "Rations (1 day)",
        "Waterskin",
      ],
      attunedMagicItems: [
        "Amulet of Health",
        "Cloak of Protection",
        "Ring of Protection",
      ],
      copper: 10,
      silver: 5,
      electrum: 0,
      gold: 20,
      platinum: 0,
    });
  }
}
