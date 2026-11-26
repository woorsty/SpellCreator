import { API_BASE } from "./base";
import type { Combatant } from "@repo/domain";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

const MONSTERS_BASE = `${API_BASE}/api/monsters`;

export const MonsterApi = {
  async listMonsters(): Promise<Combatant[]> {
    return json<Combatant[]>(await fetch(MONSTERS_BASE));
  },

  async getMonster(name: string): Promise<Combatant> {
    return json<Combatant>(await fetch(`${MONSTERS_BASE}/${encodeURIComponent(name)}`));
  },

  async createMonster(monster: Omit<Combatant, "turnOrder">): Promise<{ ok: boolean; id: string }> {
    return json<{ ok: boolean; id: string }>(
      await fetch(MONSTERS_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monster),
      }),
    );
  },

  async updateMonster(
    name: string,
    monster: Partial<Omit<Combatant, "turnOrder">>,
  ): Promise<{ ok: boolean }> {
    return json<{ ok: boolean }>(
      await fetch(`${MONSTERS_BASE}/${encodeURIComponent(name)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monster),
      }),
    );
  },

  async deleteMonster(name: string): Promise<{ ok: boolean }> {
    return json<{ ok: boolean }>(
      await fetch(`${MONSTERS_BASE}/${encodeURIComponent(name)}`, {
        method: "DELETE",
      }),
    );
  },

  async uploadMonsterImage(
    name: string,
    file: File,
  ): Promise<{ ok: boolean; url: string }> {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${MONSTERS_BASE}/${encodeURIComponent(name)}/image`, {
      method: "POST",
      body: formData,
    });
    return json<{ ok: boolean; url: string }>(res);
  },

  async deleteMonsterImage(name: string): Promise<{ ok: boolean }> {
    return json<{ ok: boolean }>(
      await fetch(`${MONSTERS_BASE}/${encodeURIComponent(name)}/image`, {
        method: "DELETE",
      }),
    );
  },
};
