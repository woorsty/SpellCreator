import { API_BASE } from "./base";
import type { CharacterSheet } from "@repo/domain";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const CreatureApi = {
  async listCreatures(): Promise<CharacterSheet[]> {
    return json<CharacterSheet[]>(
      await fetch(`${API_BASE}/api/characters`),
    );
  },
};
