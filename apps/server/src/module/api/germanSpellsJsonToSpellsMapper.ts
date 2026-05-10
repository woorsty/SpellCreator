import { SpellSchool, CharacterClass } from "@domain";
import { Spell } from "@domain";

export type RawSpell = {
  Stufe: number;
  Name: string;
  Schule: string;
  Zeitaufwand: string;
  Reichweite: string;
  Dauer: string;
  Material?: string;
  Text: string;
  HöhereLevel?: string;
  Klasse: string[];
  Konzentration: boolean;
  Ritual: boolean;
  Verbal: boolean;
  Gestik: boolean;
};

const schoolMap: Record<string, SpellSchool> = {
  Beschwörung: SpellSchool.CONJURATION,
  Hervorrufung: SpellSchool.EVOCATION,
  Verzauberung: SpellSchool.ENCHANTMENT,
  Illusion: SpellSchool.ILLUSION,
  Nekromantie: SpellSchool.NECROMANCY,
  Transmutation: SpellSchool.TRANSMUTATION,
  Bannmagie: SpellSchool.ABJURATION,
  Weissagung: SpellSchool.DIVINATION,
};

const classMap: Record<string, CharacterClass> = {
  Magier: CharacterClass.WIZARD,
  Hexenmeister: CharacterClass.WARLOCK,
  Kleriker: CharacterClass.CLERIC,
  Druide: CharacterClass.DRUID,
  Barde: CharacterClass.BARD,
  Paladin: CharacterClass.PALADIN,
  Waldläufer: CharacterClass.RANGER,
  Zauberer: CharacterClass.SORCERER,
};

export function mapGermanSpellJsonToSpell(raw: RawSpell): Spell {
  return {
    level: raw.Stufe,
    name: raw.Name,
    school: schoolMap[raw.Schule],
    castingTime: raw.Zeitaufwand,
    range: raw.Reichweite,
    duration: raw.Dauer,
    concentration: raw.Konzentration,
    ritual: raw.Ritual,

    components: {
      gestic: raw.Gestik,
      verbal: raw.Verbal,
      material: raw.Material || "",
    },

    text: raw.Text,

    characterClasses: raw.Klasse.map((cls) => classMap[cls]),

    higherLevel: raw.HöhereLevel || "",

    notes: "",
  };
}

export function getSpellByName() {}
