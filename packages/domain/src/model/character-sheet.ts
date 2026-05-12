import { Spell } from "./spell";
import { Attribute, CharacterAttributes } from "./skill";
import { Alignment } from "./alignment";
import { Species, SpeciesFeature as SpeciesTrait } from "./species";
import { CharacterClass, Subclass } from "./character-class";
import { EquipmentItem } from "./equipment";
import { ToolItem } from "./tool";
import { Attack } from "./attack";
import { Feat } from "./feat";
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

  attributes: CharacterAttributes;
  feats: Feat[];

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
  passivePerception: number;

  attacks: Attack[];

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
  attunedMagicItems: { 0: string; 1: string; 2: string };

  coins: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
  };
};
