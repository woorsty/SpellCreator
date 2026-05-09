import { Alignment } from "../model/alignment";
import { CharacterClass } from "../model/character-class";
import type { CharacterSheet } from "../model/character-sheet";
import {
  AllSkills,
  ATTRIBUTE_SKILLS,
  Attribute,
  SkillOf,
} from "../model/skill";
import { Species } from "../model/species";
import { Spell } from "../model/spell";
import { Weapon } from "../model/weapon";
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
      name: "",
      background: "",
      characterClass: CharacterClass.FIGHTER,
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
      lightArmorTraining: false,
      mediumArmorTraining: false,
      heavyArmorTraining: false,
      shieldTraining: false,
      weaponTrainingSimple: false,
      weaponTrainingMartial: false,
      toolProficiencies: [],
      initiative: 0,
      speed: 9,
      size: "Medium",
      passivePerception: 0,
      weapons: [],
      damageCantrips: [],
      classFeatures: [],
      speciesTraits: [],
      feats: [],
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
      appearance: "",
      backstory: "",
      alignment: Alignment.TRUE_NEUTRAL,
      languages: ["Common"],
      equipment: [],
      attunedMagicItems: [],
      copper: 0,
      silver: 0,
      electrum: 0,
      gold: 0,
      platinum: 0,
    };
  }

  public static getTestCharacter(): CharacterSheet {
    return {
      name: "Test Character",
      background: "A brave adventurer",
      characterClass: CharacterClass.FIGHTER,
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
