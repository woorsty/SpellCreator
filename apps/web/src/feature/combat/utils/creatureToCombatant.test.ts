import { describe, expect, it } from "vitest";
import {
  Alignment,
  AllSpecies,
  CharacterClassId,
  CreatureSize,
  CreatureType,
  DamageType,
  OriginFeat,
} from "@repo/domain";
import type { CharacterSheet } from "@repo/domain";
import { characterSheetToCombatant } from "./creatureToCombatant";

const baseSheet: CharacterSheet = {
  name: "Testgoblin",
  background: {
    id: "noble",
    attributes: [],
    feat: OriginFeat.SKILLED,
    skillProficiencies: [],
    toolProficiencies: [],
    equipment: [],
  },
  size: CreatureSize.MEDIUM,
  characterClass: {
    id: CharacterClassId.FIGHTER,
    equipment: [],
    features: [],
    hitDice: 1,
    primaryAbility: [],
    proficiencies: { armor: [], skillNumber: 0, skills: [], weapons: [] },
    savingThrows: [],
    subclasses: [],
  },
  species: {
    id: AllSpecies.HUMAN,
    creature_type: CreatureType.HUMANOID,
    speed: 9,
    size: [CreatureSize.MEDIUM],
    feats: [],
  },
  subclass: null,
  level: 1,
  xp: 0,
  armorClass: 13,
  currentHitpoints: 7,
  temporaryHitpoints: 0,
  maxHitpoints: 7,
  spentHitDice: 0,
  hitDiceValue: 6,
  successDeathSaves: 0,
  failedDeathSaves: 0,
  proficiencyBonus: 2,
  attributes: {
    strength: { value: 10, proficiency: false, skills: { athletics: { proficiency: false, expertise: false, modifier: 0 } } },
    dexterity: { value: 14, proficiency: false, skills: { acrobatics: { proficiency: false, expertise: false, modifier: 2 }, sleightOfHand: { proficiency: false, expertise: false, modifier: 2 }, stealth: { proficiency: false, expertise: false, modifier: 2 } } },
    constitution: { value: 10, proficiency: false, skills: {} },
    intelligence: { value: 10, proficiency: false, skills: { arcana: { proficiency: false, expertise: false }, history: { proficiency: false, expertise: false }, investigation: { proficiency: false, expertise: false }, nature: { proficiency: false, expertise: false }, religion: { proficiency: false, expertise: false } } },
    wisdom: { value: 10, proficiency: false, skills: { animalHandling: { proficiency: false, expertise: false }, insight: { proficiency: false, expertise: false }, medicine: { proficiency: false, expertise: false }, perception: { proficiency: false, expertise: false }, survival: { proficiency: false, expertise: false } } },
    charisma: { value: 10, proficiency: false, skills: { deception: { proficiency: false, expertise: false }, intimidation: { proficiency: false, expertise: false }, performance: { proficiency: false, expertise: false }, persuasion: { proficiency: false, expertise: false } } },
  },
  feats: [],
  heroicInspiration: false,
  armorTraining: { light: false, medium: false, heavy: false, shield: false },
  weaponTraining: { simple: false, martial: false, light: false, finesse: false },
  toolProficiencies: [],
  initiative: 2,
  passivePerception: 10,
  attacks: [
    {
      id: "a1",
      name: "Dolch",
      attackBonus: 4,
      sg: 10,
      damage: "1W4+2",
      damageType: DamageType.PIERCING,
      notes: "Feines",
    },
  ],
  spellSaveDC: 0,
  spellAttackBonus: 0,
  spellSlots: { total: [], used: {} },
  preparedSpells: [],
  appearance: "",
  story: "",
  alignment: Alignment.TRUE_NEUTRAL,
  languages: ["Gemein"],
  equipment: [],
  attunedMagicItems: { "0": "", "1": "", "2": "" },
  coins: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
  notes: "",
};

describe("characterSheetToCombatant", () => {
  it("maps core fields from character sheet", () => {
    const combatant = characterSheetToCombatant(baseSheet);

    expect(combatant.id).toBeDefined();
    expect(combatant.name).toBe("Testgoblin");
    expect(combatant.type).toBe("npc");
    expect(combatant.initiative).toBe(2);
    expect(combatant.hp).toBe(7);
    expect(combatant.maxHp).toBe(7);
    expect(combatant.tempHp).toBe(0);
    expect(combatant.armorClass).toBe(13);
    expect(combatant.isDead).toBe(false);
    expect(combatant.conditions).toEqual([]);
    expect(combatant.source).toBe("Charakterbogen");
  });

  it("maps attributes", () => {
    const combatant = characterSheetToCombatant(baseSheet);

    expect(combatant.strength).toBe(10);
    expect(combatant.dexterity).toBe(14);
    expect(combatant.constitution).toBe(10);
    expect(combatant.intelligence).toBe(10);
    expect(combatant.wisdom).toBe(10);
    expect(combatant.charisma).toBe(10);
  });

  it("maps skills with modifiers", () => {
    const combatant = characterSheetToCombatant(baseSheet);

    expect(combatant.skills).toContainEqual({ name: "acrobatics", bonus: 2 });
    expect(combatant.skills).toContainEqual({ name: "athletics", bonus: 0 });
  });

  it("maps attacks to actions", () => {
    const combatant = characterSheetToCombatant(baseSheet);

    expect(combatant.actions).toContainEqual({
      name: "Dolch",
      description: "1W4+2 · Feines",
    });
  });

  it("maps languages", () => {
    const combatant = characterSheetToCombatant(baseSheet);

    expect(combatant.languages).toEqual(["Gemein"]);
  });
});
