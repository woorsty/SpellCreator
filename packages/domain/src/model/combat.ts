export type CombatantType = "player" | "npc" | "monster";

export type ConditionId = string;

export interface Condition {
  id: ConditionId;
  name: string;
  description?: string;
  source?: string;
  rounds?: number; // undefined = dauerhaft
  expiresAtRound?: number;
  expiresAtTurn?: string; // combatant id
  concentration?: boolean;
}

export interface Combatant {
  id: string;
  name: string; // Englisch (führende Sprache für Daten)
  type: CombatantType;
  initiative: number;
  initiativeBonus: number;
  initiativeModifier?: number; // zusätzlich zum Initiative-Bonus (z. B. Geschicklichkeit)
  hp: number;
  maxHp: number;
  tempHp: number;
  armorClass: number;
  movementRate?: number; // Fuß pro Runde
  conditions: Condition[];
  isDead: boolean;
  isConcentrating: boolean;
  concentrationSpell?: string;
  imageUrl?: string; // Portrait URL
  portraitUrl?: string;
  source?: "imported" | "custom"; // Herkunft: importiert (SRD) oder benutzerdefiniert
  folder?: string; // Ordner für die Gruppierung (z. B. "Eigene")
  notes?: string;
  description?: string; // Beschreibung
  owner?: string; // player name for multiplayer
  initiativeRoll?: number; // raw d20 roll
  turnOrder: number;
  // Attribute
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  // Rettungswürfe (Boni pro Attribut)
  savingThrowStrength?: number;
  savingThrowDexterity?: number;
  savingThrowConstitution?: number;
  savingThrowIntelligence?: number;
  savingThrowWisdom?: number;
  savingThrowCharisma?: number;
  // Fähigkeiten (name -> Bonus)
  skills?: Skill[];
  // Sinne
  senses: string[];
  // Schwächen / Resistenzen / Immunitäten
  damageVulnerabilities?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  // Sprachen
  languages?: string[];
  // Schwierigkeitsgrad
  challengeRating?: string;
  // Mehrzeilige Einträge
  traits?: TraitEntry[];
  actions?: ActionEntry[];
  bonusActions?: ActionEntry[];
  legendaryActions?: ActionEntry[];
  mythicActions?: ActionEntry[];
}

export interface Skill {
  name: string;
  bonus: number;
}

export interface TraitEntry {
  name: string;
  description: string;
}

export interface ActionEntry {
  name: string;
  description: string;
}

export interface Skill {
  name: string;
  bonus: number;
}

export interface TraitEntry {
  name: string;
  description: string;
}

export interface ActionEntry {
  name: string;
  description: string;
}

export interface CombatRound {
  number: number;
  startedAt?: string;
  endedAt?: string;
}

export interface CombatTurn {
  round: number;
  combatantId: string;
  startedAt?: string;
  endedAt?: string;
}

export interface CombatState {
  id: string;
  name: string;
  status: "preparing" | "active" | "paused" | "ended";
  round: number;
  currentTurnIndex: number; // index into combatants sorted by initiative
  combatants: Combatant[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface Encounter {
  id: string;
  name: string;
  folder?: string;
  description?: string;
  combatants: Omit<Combatant, "turnOrder">[];
  createdAt: string;
  updatedAt: string;
}

export type CombatEventType =
  | "combat.started"
  | "combat.ended"
  | "combat.paused"
  | "combat.resumed"
  | "combat.round.started"
  | "combat.round.ended"
  | "combat.turn.started"
  | "combat.turn.ended"
  | "combat.initiative.changed"
  | "combat.active_combatant.changed"
  | "combatant.added"
  | "combatant.removed"
  | "combatant.updated"
  | "combatant.hp.changed"
  | "combatant.damaged"
  | "combatant.healed"
  | "combatant.died"
  | "combatant.recovered"
  | "combatant.initiative.changed"
  | "condition.applied"
  | "condition.removed"
  | "condition.expired"
  | "condition.updated"
  | "effect.applied"
  | "effect.removed"
  | "effect.expired"
  | "concentration.started"
  | "concentration.ended"
  | "action.executed"
  | "resource.changed"
  | "encounter.loaded"
  | "encounter.saved"
  | `custom:${string}`;

export interface CombatEventPayload<T extends CombatEventType = CombatEventType> {
  event: T;
  timestamp: string;
  combatId?: string;
  [key: string]: unknown;
}

export interface CombatTurnStartedPayload extends CombatEventPayload<"combat.turn.started"> {
  combat: {
    id: string;
    round: number;
  };
  combatant: {
    id: string;
    name: string;
    type: CombatantType;
    hp: number;
    maxHp: number;
    initiative: number;
    conditions: Condition[];
  };
  previousCombatant?: {
    id: string;
    name: string;
  };
}

export interface CombatantHpChangedPayload extends CombatEventPayload<"combatant.hp.changed"> {
  combatant: {
    id: string;
    name: string;
    type: CombatantType;
    hp: number;
    maxHp: number;
    tempHp: number;
  };
  previousHp: number;
  change: number;
  source?: string;
}

export interface ConditionAppliedPayload extends CombatEventPayload<"condition.applied"> {
  combatant: {
    id: string;
    name: string;
  };
  condition: Condition;
}

export interface CombatantDiedPayload extends CombatEventPayload<"combatant.died"> {
  combatant: {
    id: string;
    name: string;
    type: CombatantType;
  };
}

export interface RoundStartedPayload extends CombatEventPayload<"combat.round.started"> {
  combat: {
    id: string;
    round: number;
  };
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  event: CombatEventType;
  condition?: string; // JavaScript expression
  code: string; // JavaScript code
  lastRun?: string;
  lastStatus: "idle" | "running" | "success" | "error";
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  permissions: AutomationPermission[];
  timeoutMs?: number;
}

export type AutomationPermission =
  | "homeassistant:call"
  | "homeassistant:read"
  | "audio:play"
  | "http:request"
  | "websocket:connect"
  | "file:read"
  | "file:write";

export interface AutomationExecutionResult {
  automationId: string;
  event: CombatEventType;
  startedAt: string;
  finishedAt?: string;
  status: "success" | "error" | "timeout";
  result?: unknown;
  error?: string;
  stacktrace?: string;
  durationMs: number;
}
