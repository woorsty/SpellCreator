import { API_BASE } from "./base";
import type {
  Combatant,
  CombatState,
  Condition,
  Encounter,
} from "@repo/domain";

const COMBAT_BASE = `${API_BASE}/combat`;

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const CombatApi = {
  async listCombats(): Promise<CombatState[]> {
    return json<CombatState[]>(await fetch(`${COMBAT_BASE}/`));
  },

  async createCombat(name: string): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }),
    );
  },

  async getCombat(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}`));
  },

  async startCombat(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/start`, { method: "POST" }));
  },

  async pauseCombat(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/pause`, { method: "POST" }));
  },

  async resumeCombat(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/resume`, { method: "POST" }));
  },

  async endCombat(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/end`, { method: "POST" }));
  },

  async nextTurn(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/next`, { method: "POST" }));
  },

  async previousTurn(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/previous`, { method: "POST" }));
  },

  async skipTurn(id: string): Promise<CombatState> {
    return json<CombatState>(await fetch(`${COMBAT_BASE}/${id}/skip`, { method: "POST" }));
  },

  async addCombatant(
    combatId: string,
    combatant: Omit<Combatant, "turnOrder">,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/${combatId}/combatants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combatant),
      }),
    );
  },

  async removeCombatant(combatId: string, combatantId: string): Promise<void> {
    await fetch(`${COMBAT_BASE}/${combatId}/combatants/${combatantId}`, {
      method: "DELETE",
    });
  },

  async updateCombatant(
    combatId: string,
    combatantId: string,
    patch: Partial<Omit<Combatant, "id" | "turnOrder">>,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/${combatId}/combatants/${combatantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }),
    );
  },

  async changeHp(
    combatId: string,
    combatantId: string,
    change: number,
    source?: string,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/${combatId}/combatants/${combatantId}/hp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change, source }),
      }),
    );
  },

  async setTempHp(
    combatId: string,
    combatantId: string,
    tempHp: number,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/${combatId}/combatants/${combatantId}/temphp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempHp }),
      }),
    );
  },

  async setInitiative(
    combatId: string,
    combatantId: string,
    initiative: number,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/${combatId}/combatants/${combatantId}/initiative`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initiative }),
      }),
    );
  },

  async applyCondition(
    combatId: string,
    combatantId: string,
    condition: Condition,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/${combatId}/combatants/${combatantId}/conditions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(condition),
      }),
    );
  },

  async removeCondition(
    combatId: string,
    combatantId: string,
    conditionId: string,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(
        `${COMBAT_BASE}/${combatId}/combatants/${combatantId}/conditions/${conditionId}`,
        { method: "DELETE" },
      ),
    );
  },

  async listEncounters(): Promise<Encounter[]> {
    return json<Encounter[]>(await fetch(`${COMBAT_BASE}/encounters`));
  },

  async saveEncounter(encounter: Encounter): Promise<Encounter> {
    return json<Encounter>(
      await fetch(`${COMBAT_BASE}/encounters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encounter),
      }),
    );
  },

  async loadEncounter(id: string): Promise<Encounter> {
    return json<Encounter>(await fetch(`${COMBAT_BASE}/encounters/${id}`));
  },

  async loadEncounterIntoCombat(
    encounterId: string,
    name?: string,
  ): Promise<CombatState> {
    return json<CombatState>(
      await fetch(`${COMBAT_BASE}/encounters/${encounterId}/load`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }),
    );
  },
};
