import {
  CharacterService,
  DamageType,
  type CharacterSheet,
  type Combatant,
  type Encounter,
} from "@repo/domain";

const DEFAULT_FOLDER = "Eigene";
const DEFAULT_SPEED = 9;

type IiEntry = { Name?: string; Content?: string; Usage?: string };

type IiStatBlock = {
  Id?: string;
  Name?: string;
  Path?: string;
  Source?: string;
  Type?: string;
  HP?: { Value?: number; Notes?: string };
  AC?: { Value?: number; Notes?: string };
  InitiativeModifier?: number;
  Speed?: string[];
  Abilities?: {
    Str?: number;
    Dex?: number;
    Con?: number;
    Int?: number;
    Wis?: number;
    Cha?: number;
  };
  DamageVulnerabilities?: string[];
  DamageResistances?: string[];
  DamageImmunities?: string[];
  ConditionImmunities?: string[];
  Saves?: unknown[];
  Skills?: unknown[];
  Senses?: string[];
  Languages?: string[];
  Challenge?: string;
  Traits?: IiEntry[];
  Actions?: IiEntry[];
  BonusActions?: IiEntry[];
  Reactions?: IiEntry[];
  LegendaryActions?: IiEntry[];
  MythicActions?: IiEntry[];
  Description?: string;
  Player?: string;
  ImageURL?: string;
};

type IiCreature = IiStatBlock;

type IiPersistentCharacter = {
  Name?: string;
  Path?: string;
  StatBlock?: IiStatBlock;
};

type IiEncounterCombatant = {
  Alias?: string;
  StatBlock?: IiStatBlock;
};

type IiEncounter = {
  Name?: string;
  Path?: string;
  Id?: string;
  Combatants?: IiEncounterCombatant[];
};

export type ImprovedInitiativeImport = {
  monsters: Omit<Combatant, "turnOrder">[];
  players: CharacterSheet[];
  encounters: Encounter[];
};

function uid(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `ii-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function parseSpeed(speed: string[] | undefined): number {
  if (!Array.isArray(speed)) return DEFAULT_SPEED;
  for (const entry of speed) {
    const match = String(entry).match(/\d+/);
    if (match) return Number(match[0]);
  }
  return DEFAULT_SPEED;
}

function mapEntries(entries: IiEntry[] | undefined) {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((e) => e && (e.Name || e.Content))
    .map((e) => ({
      name: e.Name ?? "",
      description: e.Content ?? "",
    }));
}

function mapSkills(skills: unknown[] | undefined) {
  if (!Array.isArray(skills)) return [];
  const result: { name: string; bonus: number }[] = [];
  for (const raw of skills) {
    if (typeof raw === "string") {
      result.push({ name: raw, bonus: 0 });
      continue;
    }
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      const name = (obj.Name ?? obj.name ?? "") as string;
      const bonus = toNumber(obj.Bonus ?? obj.bonus ?? 0);
      if (name) result.push({ name, bonus });
    }
  }
  return result;
}

function statBlockToCombatant(
  sb: IiStatBlock,
  options: { type: Combatant["type"]; folder?: string; name?: string },
): Omit<Combatant, "turnOrder"> {
  const abilities = sb.Abilities ?? {};
  const strength = toNumber(abilities.Str, 10);
  const dexterity = toNumber(abilities.Dex, 10);
  const constitution = toNumber(abilities.Con, 10);
  const intelligence = toNumber(abilities.Int, 10);
  const wisdom = toNumber(abilities.Wis, 10);
  const charisma = toNumber(abilities.Cha, 10);
  const hp = toNumber(sb.HP?.Value, 0);

  return {
    id: uid(),
    name: options.name ?? sb.Name ?? "",
    type: options.type,
    initiative: 0,
    initiativeBonus: toNumber(sb.InitiativeModifier, 0),
    hp,
    maxHp: hp,
    tempHp: 0,
    armorClass: toNumber(sb.AC?.Value, 10),
    movementRate: parseSpeed(sb.Speed),
    conditions: [],
    isDead: false,
    isConcentrating: false,
    source: "custom",
    folder: options.folder,
    description: sb.Description || undefined,
    imageUrl: sb.ImageURL || undefined,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    savingThrowStrength: abilityModifier(strength),
    savingThrowDexterity: abilityModifier(dexterity),
    savingThrowConstitution: abilityModifier(constitution),
    savingThrowIntelligence: abilityModifier(intelligence),
    savingThrowWisdom: abilityModifier(wisdom),
    savingThrowCharisma: abilityModifier(charisma),
    skills: mapSkills(sb.Skills),
    senses: Array.isArray(sb.Senses) ? sb.Senses : [],
    damageVulnerabilities: Array.isArray(sb.DamageVulnerabilities)
      ? sb.DamageVulnerabilities
      : [],
    damageResistances: Array.isArray(sb.DamageResistances)
      ? sb.DamageResistances
      : [],
    damageImmunities: Array.isArray(sb.DamageImmunities)
      ? sb.DamageImmunities
      : [],
    conditionImmunities: Array.isArray(sb.ConditionImmunities)
      ? sb.ConditionImmunities
      : [],
    languages: Array.isArray(sb.Languages) ? sb.Languages : [],
    challengeRating: sb.Challenge || undefined,
    traits: mapEntries(sb.Traits),
    actions: mapEntries(sb.Actions),
    bonusActions: mapEntries(sb.BonusActions),
    legendaryActions: mapEntries(sb.LegendaryActions),
    mythicActions: mapEntries(sb.MythicActions),
  };
}

function statBlockToCharacterSheet(
  sb: IiStatBlock,
  folder: string | undefined,
  name?: string,
): CharacterSheet {
  const sheet = CharacterService.getEmptyCharacter();
  const abilities = sb.Abilities ?? {};
  const values: Record<keyof CharacterSheet["attributes"], number> = {
    strength: toNumber(abilities.Str, 10),
    dexterity: toNumber(abilities.Dex, 10),
    constitution: toNumber(abilities.Con, 10),
    intelligence: toNumber(abilities.Int, 10),
    wisdom: toNumber(abilities.Wis, 10),
    charisma: toNumber(abilities.Cha, 10),
  };

  for (const key of Object.keys(values) as (keyof typeof values)[]) {
    const value = values[key];
    const modifier = abilityModifier(value);
    sheet.attributes[key].value = value;
    sheet.attributes[key].modifier = modifier;
    sheet.attributes[key].savingThrow = modifier;
  }

  const hp = toNumber(sb.HP?.Value, 0);
  sheet.name = name ?? sb.Name ?? "";
  sheet.folder = folder;
  sheet.armorClass = toNumber(sb.AC?.Value, 10);
  sheet.maxHitpoints = hp;
  sheet.currentHitpoints = hp;
  sheet.temporaryHitpoints = 0;
  sheet.initiative = toNumber(sb.InitiativeModifier, abilityModifier(values.dexterity));
  sheet.languages = Array.isArray(sb.Languages) ? sb.Languages : [];
  sheet.attacks = (Array.isArray(sb.Actions) ? sb.Actions : []).map((a) => ({
    id: uid(),
    name: a.Name ?? "",
    attackBonus: 0,
    sg: 0,
    damage: a.Content ?? "",
    damageType: DamageType.BLUDGEONING,
    notes: "",
  }));

  return sheet;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Parses an Improved Initiative export (improved-initiative.json) into the
 * internal monster, player-character and encounter representations.
 */
export function parseImprovedInitiative(
  root: unknown,
): ImprovedInitiativeImport {
  const result: ImprovedInitiativeImport = {
    monsters: [],
    players: [],
    encounters: [],
  };
  if (!isRecord(root)) return result;

  for (const [key, value] of Object.entries(root)) {
    if (key.startsWith("Creatures.") && isRecord(value)) {
      const sb = value as IiStatBlock;
      result.monsters.push(
        statBlockToCombatant(sb, {
          type: "npc",
          folder: sb.Path || DEFAULT_FOLDER,
        }),
      );
    } else if (
      key.startsWith("PersistentCharacters.") &&
      isRecord(value)
    ) {
      const pc = value as IiPersistentCharacter;
      const sb = pc.StatBlock;
      if (!sb) continue;
      result.players.push(
        statBlockToCharacterSheet(sb, pc.Path || sb.Path, pc.Name ?? sb.Name),
      );
    } else if (key.startsWith("SavedEncounters.") && isRecord(value)) {
      const enc = value as IiEncounter;
      const combatants = (Array.isArray(enc.Combatants) ? enc.Combatants : [])
        .filter((c) => !!c?.StatBlock)
        .map((c) =>
          statBlockToCombatant(c.StatBlock as IiStatBlock, {
            type: "npc",
            name: c.Alias || c.StatBlock?.Name,
          }),
        );
      const now = new Date().toISOString();
      result.encounters.push({
        id: enc.Id || uid(),
        name: enc.Name || "",
        folder: enc.Path || undefined,
        combatants,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return result;
}