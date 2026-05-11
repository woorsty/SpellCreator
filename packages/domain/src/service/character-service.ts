import { Alignment } from "../model/alignment";
import { CharacterClassId } from "../model/character-class";
import type { CharacterSheet } from "../model/character-sheet";
import {
  AllSkills,
  ATTRIBUTE_SKILLS,
  Attribute,
  SkillOf,
} from "../model/skill";
import { Species } from "../model/species";
import { AttributeService } from "./attribute-service";
import { SpellService } from "./spell-service";

export class CharacterService {
  public static findAttributeBySkill(skill: AllSkills): Attribute {
    for (const attr in ATTRIBUTE_SKILLS) {
      if (ATTRIBUTE_SKILLS[attr as Attribute].includes(skill as never)) {
        return attr as Attribute;
      }
    }
    throw new Error("Skill not found");
  }

  public static getEmptyCharacter(): CharacterSheet {
    return {
      talents: [],
      name: "",
      background: "",
      characterClass: {
        id: CharacterClassId.FIGHTER,
        equipment: [],
        features: [],
        hitDie: 1,
        primaryAbility: [],
        proficiencies: {
          Armor: [],
          SkillNumber: 0,
          Skills: [],
          Weapons: [],
        },
        savingThrows: [],
        subclasses: [],
      },
      species: Species.HUMAN,
      subclass: null,
      level: 1,
      xp: 0,
      armorClass: 0,
      currentHitpoints: 0,
      temporaryHitpoints: 0,
      spentHitDice: 0,
      maxHitpoints: 0,
      hitDiceValue: 0,
      successDeathSaves: 0,
      failedDeathSaves: 0,
      proficiencyBonus: 2,
      skills: {
        strength: {
          athletics: {
            expertise: false,
            proficiency: false,
          },
        },
        charisma: {
          deception: { expertise: false, proficiency: false },
          intimidation: { expertise: false, proficiency: false },
          performance: { expertise: false, proficiency: false },
          persuasion: { expertise: false, proficiency: false },
        },
        constitution: {},
        dexterity: {
          acrobatics: { expertise: false, proficiency: false },
          sleightOfHand: { expertise: false, proficiency: false },
          stealth: { expertise: false, proficiency: false },
        },
        intelligence: {
          arcana: { expertise: false, proficiency: false },
          history: { expertise: false, proficiency: false },
          investigation: { expertise: false, proficiency: false },
          nature: { expertise: false, proficiency: false },
          religion: { expertise: false, proficiency: false },
        },
        wisdom: {
          animalHandling: { expertise: false, proficiency: false },
          insight: { expertise: false, proficiency: false },
          medicine: { expertise: false, proficiency: false },
          perception: { expertise: false, proficiency: false },
          survival: { expertise: false, proficiency: false },
        },
      },
      attributes: {
        charisma: {
          proficiency: false,
          value: 10,
        },
        constitution: {
          proficiency: false,
          value: 10,
        },
        dexterity: {
          proficiency: false,
          value: 10,
        },
        intelligence: {
          proficiency: false,
          value: 10,
        },
        strength: {
          proficiency: false,
          value: 10,
        },
        wisdom: {
          proficiency: false,
          value: 10,
        },
      },
      heroicInspiration: false,
      armorTraining: {
        light: false,
        heavy: false,
        medium: false,
        shield: false,
      },
      weaponTraining: {
        finesse: false,
        light: false,
        martial: false,
        simple: false,
      },
      toolProficiencies: [],
      initiative: 0,
      speed: 9,
      size: "Medium",
      passivePerception: 0,
      attacks: [],
      speciesTraits: [],
      feats: [],
      spellcastingAbility: null,
      spellSaveDC: 0,
      spellAttackBonus: 0,
      spellSlots: {
        total: [],
        used: [],
      },
      preparedSpells: [],
      appearance: "",
      story: "",
      alignment: Alignment.TRUE_NEUTRAL,
      languages: ["Common"],
      equipment: [],
      attunedMagicItems: ["", "", ""],
      coins: {
        copper: 0,
        silver: 0,
        electrum: 0,
        gold: 0,
        platinum: 0,
      },
    };
  }

  public static getTestCharacter(): CharacterSheet {
    return {
      talents: [],
      name: "Test Character",
      background: "A brave adventurer",
      characterClass: {
        id: CharacterClassId.FIGHTER,
        equipment: [],
        features: [],
        hitDie: 1,
        primaryAbility: [],
        proficiencies: {
          Armor: [],
          SkillNumber: 0,
          Skills: [],
          Weapons: [],
        },
        savingThrows: [],
        subclasses: [],
      },
      species: Species.HUMAN,
      subclass: "Champion",
      level: 5,
      xp: 6500,
      armorClass: 16,
      currentHitpoints: 38,
      temporaryHitpoints: 0,
      spentHitDice: 0,
      maxHitpoints: 38,
      hitDiceValue: 10,
      successDeathSaves: 0,
      failedDeathSaves: 0,
      proficiencyBonus: 3,
      skills: {
        strength: {
          athletics: {
            expertise: false,
            proficiency: true,
          },
        },
        charisma: {
          deception: { expertise: false, proficiency: true },
          intimidation: { expertise: false, proficiency: true },
          performance: { expertise: false, proficiency: true },
          persuasion: { expertise: false, proficiency: true },
        },
        constitution: {},
        dexterity: {
          acrobatics: { expertise: false, proficiency: true },
          sleightOfHand: { expertise: false, proficiency: true },
          stealth: { expertise: false, proficiency: true },
        },
        intelligence: {
          arcana: { expertise: false, proficiency: true },
          history: { expertise: false, proficiency: true },
          investigation: { expertise: false, proficiency: true },
          nature: { expertise: false, proficiency: true },
          religion: { expertise: false, proficiency: true },
        },
        wisdom: {
          animalHandling: { expertise: false, proficiency: true },
          insight: { expertise: false, proficiency: true },
          medicine: { expertise: false, proficiency: true },
          perception: { expertise: false, proficiency: true },
          survival: { expertise: false, proficiency: true },
        },
      },
      attributes: {
        charisma: {
          proficiency: false,
          value: 11,
        },
        constitution: {
          proficiency: false,
          value: 11,
        },
        dexterity: {
          proficiency: false,
          value: 11,
        },
        intelligence: {
          proficiency: false,
          value: 11,
        },
        strength: {
          proficiency: false,
          value: 11,
        },
        wisdom: {
          proficiency: false,
          value: 11,
        },
      },
      heroicInspiration: false,
      armorTraining: {
        heavy: false,
        light: true,
        medium: true,
        shield: true,
      },
      weaponTraining: {
        finesse: false,
        light: false,
        martial: true,
        simple: true,
      },
      toolProficiencies: [
        { name: "Smith's Tools", notes: "Zum Schmieden halt duh" },
      ],
      initiative: 1,
      speed: 30,
      size: "Medium",
      passivePerception: 9,
      attacks: [],
      speciesTraits: ["Human Resilience"],
      feats: ["Great Weapon Fighting"],
      spellcastingAbility: null,
      spellSaveDC: 1,
      spellAttackBonus: 3,
      spellSlots: {
        total: [],
        used: [],
      },
      preparedSpells: [SpellService.getTestSpell()],
      appearance:
        "A tall, muscular human with short brown hair and green eyes.",
      story:
        "Born in a small village, this character grew up learning the ways of the sword. After their village was attacked by bandits, they set out on a quest for justice and adventure.",
      alignment: Alignment.LAWFUL_GOOD,
      languages: ["Common", "Dwarvish"],
      equipment: [
        { name: "Explorer's Pack", notes: "" },
        { name: "Tinderbox", notes: "" },
        { name: "Rations", notes: "1 day" },
        { name: "Waterskin", notes: "" },
      ],
      attunedMagicItems: [
        "Amulet of Health",
        "Cloak of Protection",
        "Ring of Protection",
      ],
      coins: {
        copper: 10,
        silver: 5,
        electrum: 0,
        gold: 20,
        platinum: 0,
      },
    };
  }

  public static getSkillModifier<A extends Attribute>(
    character: CharacterSheet,
    attribute: A,
    skill: SkillOf<A>,
  ) {
    const attr = character.attributes[attribute];
    const skillData = character.skills[attribute][skill];

    const modifier = AttributeService.calculateModifier(attr.value);

    let bonus = 0;

    if (skillData.proficiency) {
      bonus += character.proficiencyBonus;
    }
    if (skillData.expertise) {
      bonus += character.proficiencyBonus;
    }

    return modifier + bonus;
  }
}
