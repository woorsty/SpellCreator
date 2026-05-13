import { OriginFeat } from "../model";
import { Alignment } from "../model/alignment";
import { CharacterClassId } from "../model/character-class";
import type { CharacterSheet } from "../model/character-sheet";
import {
  AllSkills,
  ATTRIBUTE_SKILLS,
  Attribute,
  SkillOf,
} from "../model/skill";
import { AllSpecies, CreatureSize, SPECIES } from "../model/species";
import { AttributeService } from "./attribute-service";

export class CharacterService {
  public static async saveCharacter(character: CharacterSheet) {
    CharacterService.calculateParameters(character);
    const response = await fetch("/api/characters/" + character.name, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(character),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Speichern");
    }

    return response.json();
  }

  private static calculateParameters(character: CharacterSheet) {
    const perceptionModifier =
      AttributeService.calculateSkillModifierFromCharacter(
        character,
        "wisdom",
        "perception",
      );
    character.passivePerception = 10 + perceptionModifier;
    character.initiative = AttributeService.calculateModifier(
      character.attributes.dexterity.value,
    );

    const castingAttribute =
      character.characterClass.castingAttribute ||
      character.subclass?.castingAttribute;

    if (castingAttribute) {
      const castingModificator = AttributeService.calculateModifier(
        character.attributes[castingAttribute].value,
      );
      character.spellAttackBonus = castingModificator;
      character.spellSaveDC = castingModificator + character.proficiencyBonus;
    }

    for (const attribute of Object.keys(character.attributes) as Attribute[]) {
      const attr = character.attributes[attribute];

      const modifier = AttributeService.calculateModifier(attr.value);
      const savingThrow = AttributeService.calculateSavingThrow(
        modifier,
        attr.proficiency,
        character.proficiencyBonus,
      );
      attr.modifier = modifier;
      attr.savingThrow = savingThrow;

      for (const skill of ATTRIBUTE_SKILLS[attribute]) {
        const skillValue = AttributeService.getSkillData(
          character,
          attribute,
          skill,
        );

        skillValue.modifier =
          AttributeService.calculateSkillModifierFromCharacter(
            character,
            attribute,
            skill,
          );
      }
    }
  }

  public static async checkIfCharacterExists(character: CharacterSheet) {
    const response = await fetch("/api/characters/" + character.name, {
      method: "HEAD",
    });
    console.log(response);
    return response.json();
  }

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
      feats: [],
      name: "",
      background: {
        attributes: [],
        equipment: [],
        id: "noble",
        skillProficiencies: [],
        feat: OriginFeat.SKILLED,
        toolProficiencies: [],
      },
      size: CreatureSize.MEDIUM,
      characterClass: {
        id: CharacterClassId.FIGHTER,
        equipment: [],
        features: [],
        hitDie: 1,
        primaryAbility: [],
        proficiencies: {
          armor: [],
          skillNumber: 0,
          skills: [],
          weapons: [],
        },
        savingThrows: [],
        subclasses: [],
      },
      species: SPECIES[AllSpecies.HUMAN],
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
      attributes: {
        charisma: {
          proficiency: false,
          value: 10,
          skills: {
            deception: { expertise: false, proficiency: false },
            intimidation: { expertise: false, proficiency: false },
            performance: { expertise: false, proficiency: false },
            persuasion: { expertise: false, proficiency: false },
          },
        },
        constitution: {
          proficiency: false,
          value: 10,
          skills: {},
        },
        dexterity: {
          proficiency: false,
          value: 10,
          skills: {
            acrobatics: { expertise: false, proficiency: false },
            sleightOfHand: { expertise: false, proficiency: false },
            stealth: { expertise: false, proficiency: false },
          },
        },
        intelligence: {
          proficiency: false,
          value: 10,
          skills: {
            arcana: { expertise: false, proficiency: false },
            history: { expertise: false, proficiency: false },
            investigation: { expertise: false, proficiency: false },
            nature: { expertise: false, proficiency: false },
            religion: { expertise: false, proficiency: false },
          },
        },
        strength: {
          proficiency: false,
          value: 10,
          skills: {
            athletics: {
              expertise: false,
              proficiency: false,
            },
          },
        },
        wisdom: {
          proficiency: false,
          value: 10,
          skills: {
            animalHandling: { expertise: false, proficiency: false },
            insight: { expertise: false, proficiency: false },
            medicine: { expertise: false, proficiency: false },
            perception: { expertise: false, proficiency: false },
            survival: { expertise: false, proficiency: false },
          },
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
      passivePerception: 0,
      attacks: [],
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
      languages: ["common"],
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
    const skillData = character.attributes[attribute].skills[skill];

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
