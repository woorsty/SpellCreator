import type {
  Combatant,
  CombatEventType,
  CombatState,
  Condition,
  Encounter,
} from "@repo/domain";
import { EventBus } from "@repo/domain";
import { JsonService } from "@repo/domain";
import * as fs from "fs/promises";
import * as path from "path";

const COMBATS_PATH = path.resolve(process.cwd(), "data/combats");

function now(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sortCombatants(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort(
    (a, b) => b.initiative - a.initiative || b.turnOrder - a.turnOrder,
  );
}

function combatantSnapshot(c: Combatant) {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    hp: c.hp,
    maxHp: c.maxHp,
    initiative: c.initiative,
    conditions: c.conditions,
  };
}

export class CombatService {
  private combats = new Map<string, CombatState>();
  private eventBus = new EventBus<CombatEventType, unknown>();
  private readonly saveDebounce = new Map<string, NodeJS.Timeout>();
  private readonly saveDelayMs = 500;

  constructor() {
    this.ensureDataDir();
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(COMBATS_PATH, { recursive: true });
    } catch {
      // directory may already exist
    }
  }

  /* ---------------------------------------------------------------- *
   * Event-Bus                                                        *
   * ---------------------------------------------------------------- */

  getEventBus(): EventBus<CombatEventType, unknown> {
    return this.eventBus;
  }

  private async emit<T extends CombatEventType>(
    event: T,
    payload: unknown,
  ): Promise<void> {
    await this.eventBus.emit(event, { event, timestamp: now(), ...(payload as Record<string, unknown>) });
  }

  /* ---------------------------------------------------------------- *
   * Persistence                                                      *
   * ---------------------------------------------------------------- */

  private combatPath(id: string): string {
    return path.join(COMBATS_PATH, `${id}.json`);
  }

  private async loadCombatFromDisk(id: string): Promise<CombatState | null> {
    try {
      const content = await fs.readFile(this.combatPath(id), "utf-8");
      return JSON.parse(content) as CombatState;
    } catch {
      return null;
    }
  }

  private async saveCombatToDisk(combat: CombatState): Promise<void> {
    await fs.writeFile(
      this.combatPath(combat.id),
      JSON.stringify(combat, null, 2),
      "utf-8",
    );
  }

  private debouncedSave(combat: CombatState): void {
    const existing = this.saveDebounce.get(combat.id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(async () => {
      this.saveDebounce.delete(combat.id);
      try {
        await this.saveCombatToDisk(combat);
      } catch (err) {
        console.error(`[CombatService] Failed to save combat ${combat.id}:`, err);
      }
    }, this.saveDelayMs);
    this.saveDebounce.set(combat.id, timer);
  }

  /* ---------------------------------------------------------------- *
   * Combat CRUD                                                      *
   * ---------------------------------------------------------------- */

  async createCombat(name: string): Promise<CombatState> {
    const id = generateId();
    const combat: CombatState = {
      id,
      name,
      status: "preparing",
      round: 1,
      currentTurnIndex: 0,
      combatants: [],
      createdAt: now(),
      updatedAt: now(),
    };
    this.combats.set(id, combat);
    await this.saveCombatToDisk(combat);
    return combat;
  }

  async getCombat(id: string): Promise<CombatState | null> {
    const cached = this.combats.get(id);
    if (cached) return cached;
    const loaded = await this.loadCombatFromDisk(id);
    if (loaded) this.combats.set(id, loaded);
    return loaded;
  }

  async listCombats(): Promise<CombatState[]> {
    try {
      const files = await fs.readdir(COMBATS_PATH);
      const combats: CombatState[] = [];
      for (const file of files.filter((f) => f.endsWith(".json"))) {
        const combat = await this.loadCombatFromDisk(
          path.join(COMBATS_PATH, file),
        );
        if (combat) {
          this.combats.set(combat.id, combat);
          combats.push(combat);
        }
      }
      return combats.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch {
      return [];
    }
  }

  async deleteCombat(id: string): Promise<boolean> {
    const combat = this.combats.get(id) || (await this.loadCombatFromDisk(id));
    if (!combat) return false;
    try {
      await fs.unlink(this.combatPath(id));
    } catch {
      // ignore missing file
    }
    this.combats.delete(id);
    await this.emit("combat.ended", { combat: { id } });
    return true;
  }

  /* ---------------------------------------------------------------- *
   * Combatants                                                       *
   * ---------------------------------------------------------------- */

  async addCombatant(
    combatId: string,
    combatant: Omit<Combatant, "turnOrder">,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    
    // Ensure unique ID for each combatant instance
    const existingIds = new Set(combat.combatants.map((c) => c.id));
    let newId = combatant.id;
    if (!newId || existingIds.has(newId)) {
      newId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    while (existingIds.has(newId)) {
      newId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    
    const turnOrder = combat.combatants.length + 1;
    const newCombatant: Combatant = { ...combatant, id: newId, turnOrder, conditions: combatant.conditions ?? [] };
    combat.combatants.push(newCombatant);
    combat.combatants = sortCombatants(combat.combatants);
    combat.updatedAt = now();

    if (combat.status === "active" && combat.combatants.length === 1) {
      combat.currentTurnIndex = 0;
    }

    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combatant.added", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(newCombatant),
    });
    return combat;
  }

  async removeCombatant(combatId: string, combatantId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const index = combat.combatants.findIndex((c) => c.id === combatantId);
    if (index === -1) {
      throw new Error(`Combatant ${combatantId} not found in combat ${combatId}`);
    }
    const removed = combat.combatants.splice(index, 1);
    combat.combatants = sortCombatants(combat.combatants);
    combat.currentTurnIndex = Math.max(0, Math.min(combat.currentTurnIndex, combat.combatants.length - 1));
    combat.updatedAt = now();

    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combatant.removed", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(removed[0]),
    });
    return combat;
  }

  async updateCombatant(
    combatId: string,
    combatantId: string,
    patch: Partial<Omit<Combatant, "id" | "turnOrder">>,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant) {
      throw new Error(`Combatant ${combatantId} not found`);
    }
    Object.assign(combatant, patch);
    combat.combatants = sortCombatants(combat.combatants);
    combat.updatedAt = now();

    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combatant.updated", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(combatant),
    });
    return combat;
  }

  /* ---------------------------------------------------------------- *
   * HP / Damage / Heal                                               *
   * ---------------------------------------------------------------- */

  async changeHp(
    combatId: string,
    combatantId: string,
    change: number,
    source?: string,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant) {
      throw new Error(`Combatant ${combatantId} not found`);
    }

    const previousHp = combatant.hp;
    let newHp = combatant.hp + change;

    // Apply temp HP first
    if (change < 0 && combatant.tempHp > 0) {
      const tempAbsorbed = Math.min(combatant.tempHp, -change);
      combatant.tempHp -= tempAbsorbed;
      newHp = combatant.hp + (change + tempAbsorbed);
    }

    newHp = Math.max(0, Math.min(newHp, combatant.maxHp));
    combatant.hp = newHp;
    combatant.isDead = newHp <= 0;
    combat.updatedAt = now();

    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);

    await this.emit("combatant.hp.changed", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(combatant),
      previousHp,
      change,
      source,
    });

    if (change < 0) {
      await this.emit("combatant.damaged", {
        combat: { id: combat.id, round: combat.round },
        combatant: combatantSnapshot(combatant),
        damage: -change,
        source,
      });
    } else if (change > 0) {
      await this.emit("combatant.healed", {
        combat: { id: combat.id, round: combat.round },
        combatant: combatantSnapshot(combatant),
        healing: change,
        source,
      });
    }

    if (combatant.isDead && previousHp > 0) {
      await this.emit("combatant.died", {
        combat: { id: combat.id, round: combat.round },
        combatant: {
          id: combatant.id,
          name: combatant.name,
          type: combatant.type,
        },
      });
    }

    return combat;
  }

  async setTempHp(
    combatId: string,
    combatantId: string,
    tempHp: number,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant) throw new Error(`Combatant ${combatantId} not found`);
    combatant.tempHp = tempHp;
    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combatant.updated", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(combatant),
    });
    return combat;
  }

  /* ---------------------------------------------------------------- *
   * Initiative                                                       *
   * ---------------------------------------------------------------- */

  async setInitiative(
    combatId: string,
    combatantId: string,
    initiative: number,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant) throw new Error(`Combatant ${combatantId} not found`);
    combatant.initiative = initiative;
    combat.combatants = sortCombatants(combat.combatants);
    // Recompute currentTurnIndex based on sorted order
    combat.currentTurnIndex = combat.combatants.findIndex((c) => c.id === combatantId);
    if (combat.currentTurnIndex === -1) combat.currentTurnIndex = 0;
    combat.updatedAt = now();

    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combat.initiative.changed", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(combatant),
      initiative,
    });
    return combat;
  }

  /* ---------------------------------------------------------------- *
   * Conditions                                                       *
   * ---------------------------------------------------------------- */

  async applyCondition(
    combatId: string,
    combatantId: string,
    condition: Condition,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant) throw new Error(`Combatant ${combatantId} not found`);

    // Avoid duplicate conditions by id unless stacking is intended
    const existing = combatant.conditions.find((c) => c.id === condition.id);
    if (existing) {
      Object.assign(existing, condition);
    } else {
      combatant.conditions.push(condition);
    }

    if (condition.concentration) {
      combatant.isConcentrating = true;
      combatant.concentrationSpell = condition.name;
      await this.emit("concentration.started", {
        combat: { id: combat.id, round: combat.round },
        combatant: { id: combatant.id, name: combatant.name },
        condition,
      });
    }

    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("condition.applied", {
      combat: { id: combat.id, round: combat.round },
      combatant: { id: combatant.id, name: combatant.name },
      condition,
    });
    return combat;
  }

  async removeCondition(
    combatId: string,
    combatantId: string,
    conditionId: string,
  ): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants.find((c) => c.id === combatantId);
    if (!combatant) throw new Error(`Combatant ${combatantId} not found`);

    const idx = combatant.conditions.findIndex((c) => c.id === conditionId);
    if (idx === -1) {
      throw new Error(`Condition ${conditionId} not found on combatant ${combatantId}`);
    }
    const removed = combatant.conditions.splice(idx, 1)[0];

    if (removed.concentration) {
      combatant.isConcentrating = combatant.conditions.some((c) => c.concentration);
      if (!combatant.isConcentrating) combatant.concentrationSpell = undefined;
      await this.emit("concentration.ended", {
        combat: { id: combat.id, round: combat.round },
        combatant: { id: combatant.id, name: combatant.name },
        condition: removed,
      });
    }

    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("condition.removed", {
      combat: { id: combat.id, round: combat.round },
      combatant: { id: combatant.id, name: combatant.name },
      condition: removed,
    });
    return combat;
  }

  /* ---------------------------------------------------------------- *
   * Combat Lifecycle (start / pause / resume / end)                  *
   * ---------------------------------------------------------------- */

  async startCombat(combatId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    if (combat.status === "active") return combat;
    combat.status = "active";
    combat.startedAt = now();
    combat.round = 1;
    combat.currentTurnIndex = 0;
    combat.combatants = sortCombatants(combat.combatants);
    combat.updatedAt = now();

    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combat.started", {
      combat: { id: combat.id, round: combat.round },
    });
    await this.emit("combat.round.started", {
      combat: { id: combat.id, round: combat.round },
    });
    await this.startTurn(combatId);
    return combat;
  }

  private async startTurn(combatId: string): Promise<void> {
    const combat = await this.requireCombat(combatId);
    const combatant = combat.combatants[combat.currentTurnIndex];
    if (!combatant) return;

    // Expire conditions whose round has passed
    await this.expireConditions(combatId, combat.round);

    await this.emit("combat.turn.started", {
      combat: { id: combat.id, round: combat.round },
      combatant: combatantSnapshot(combatant),
      previousCombatant: this.previousCombatant(combat),
    });
  }

  private previousCombatant(combat: CombatState) {
    const idx = combat.currentTurnIndex - 1;
    if (idx < 0) return undefined;
    const c = combat.combatants[idx];
    return { id: c.id, name: c.name };
  }

  async nextTurn(combatId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    if (combat.status !== "active") throw new Error("Combat is not active");

    const current = combat.combatants[combat.currentTurnIndex];
    if (current) {
      await this.emit("combat.turn.ended", {
        combat: { id: combat.id, round: combat.round },
        combatant: combatantSnapshot(current),
      });
    }

    combat.currentTurnIndex += 1;
    if (combat.currentTurnIndex >= combat.combatants.length) {
      combat.currentTurnIndex = 0;
      combat.round += 1;
      await this.emit("combat.round.ended", {
        combat: { id: combat.id, round: combat.round - 1 },
      });
      await this.emit("combat.round.started", {
        combat: { id: combat.id, round: combat.round },
      });
    }

    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.startTurn(combatId);
    return combat;
  }

  async previousTurn(combatId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    if (combat.status !== "active") throw new Error("Combat is not active");

    const current = combat.combatants[combat.currentTurnIndex];
    if (current) {
      await this.emit("combat.turn.ended", {
        combat: { id: combat.id, round: combat.round },
        combatant: combatantSnapshot(current),
      });
    }

    combat.currentTurnIndex -= 1;
    if (combat.currentTurnIndex < 0) {
      combat.currentTurnIndex = combat.combatants.length - 1;
      combat.round = Math.max(1, combat.round - 1);
      await this.emit("combat.round.started", {
        combat: { id: combat.id, round: combat.round },
      });
    }

    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.startTurn(combatId);
    return combat;
  }

  async skipTurn(combatId: string): Promise<CombatState> {
    return this.nextTurn(combatId);
  }

  async pauseCombat(combatId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    if (combat.status !== "active") throw new Error("Combat is not active");
    combat.status = "paused";
    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combat.paused", {
      combat: { id: combat.id, round: combat.round },
    });
    return combat;
  }

  async resumeCombat(combatId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    if (combat.status !== "paused") throw new Error("Combat is not paused");
    combat.status = "active";
    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combat.resumed", {
      combat: { id: combat.id, round: combat.round },
    });
    return combat;
  }

  async endCombat(combatId: string): Promise<CombatState> {
    const combat = await this.requireCombat(combatId);
    combat.status = "ended";
    combat.endedAt = now();
    combat.updatedAt = now();
    this.combats.set(combat.id, combat);
    this.debouncedSave(combat);
    await this.emit("combat.ended", {
      combat: { id: combat.id, round: combat.round },
    });
    return combat;
  }

  /* ---------------------------------------------------------------- *
   * Encounters                                                       *
   * ---------------------------------------------------------------- */

  async saveEncounter(encounter: Encounter): Promise<Encounter> {
    encounter.updatedAt = now();
    const filePath = path.join(COMBATS_PATH, `encounter-${encounter.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(encounter, null, 2), "utf-8");
    await this.emit("encounter.saved", { encounter });
    return encounter;
  }

  async loadEncounter(id: string): Promise<Encounter | null> {
    try {
      const filePath = path.join(COMBATS_PATH, `encounter-${id}.json`);
      const content = await fs.readFile(filePath, "utf-8");
      const encounter = JSON.parse(content) as Encounter;
      await this.emit("encounter.loaded", { encounter });
      return encounter;
    } catch {
      return null;
    }
  }

  async listEncounters(): Promise<Encounter[]> {
    try {
      const files = await fs.readdir(COMBATS_PATH);
      const encounters: Encounter[] = [];
      for (const file of files.filter((f) => f.startsWith("encounter-") && f.endsWith(".json"))) {
        try {
          const content = await fs.readFile(path.join(COMBATS_PATH, file), "utf-8");
          encounters.push(JSON.parse(content) as Encounter);
        } catch {
          // skip malformed
        }
      }
      return encounters.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    } catch {
      return [];
    }
  }

  async loadEncounterIntoCombat(
    encounterId: string,
    combatName?: string,
  ): Promise<CombatState> {
    const encounter = await this.loadEncounter(encounterId);
    if (!encounter) throw new Error(`Encounter ${encounterId} not found`);
    const combat = await this.createCombat(combatName || encounter.name);
    for (const c of encounter.combatants) {
      await this.addCombatant(combat.id, c);
    }
    return combat;
  }

  /* ---------------------------------------------------------------- *
   * Condition expiry (round-based)                                   *
   * ---------------------------------------------------------------- */

  private async expireConditions(combatId: string, currentRound: number): Promise<void> {
    const combat = await this.requireCombat(combatId);
    for (const combatant of combat.combatants) {
      const toExpire: Condition[] = [];
      for (const condition of combatant.conditions ?? []) {
        let expired = false;
        if (condition.rounds !== undefined) {
          const expiresAt = condition.expiresAtRound ?? currentRound + condition.rounds;
          expired = currentRound >= expiresAt;
        }
        if (condition.expiresAtRound !== undefined && currentRound >= condition.expiresAtRound) {
          expired = true;
        }
        if (expired) toExpire.push(condition);
      }
      for (const condition of toExpire) {
        await this.removeCondition(combatId, combatant.id, condition.id);
        await this.emit("condition.expired", {
          combat: { id: combat.id, round: currentRound },
          combatant: { id: combatant.id, name: combatant.name },
          condition,
        });
      }
    }
  }

  /* ---------------------------------------------------------------- *
   * Helpers                                                          *
   * ---------------------------------------------------------------- */

  private async requireCombat(id: string): Promise<CombatState> {
    const combat = this.combats.get(id) || (await this.loadCombatFromDisk(id));
    if (!combat) {
      throw new Error(`Combat ${id} not found`);
    }
    return combat;
  }
}

export const combatService = new CombatService();
