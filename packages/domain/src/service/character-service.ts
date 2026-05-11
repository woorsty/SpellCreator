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
      background: {
        attributes: [],
        equipment: [],
        id: "human",
        skillProficiencies: [],
        talent: "",
        toolProficiencies: [],
      },
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
