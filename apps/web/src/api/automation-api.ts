import { API_BASE } from "./base";
import type { Automation } from "@repo/domain";

const AUTO_BASE = `${API_BASE}/automation`;
const HA_BASE = `${AUTO_BASE}/config/homeassistant`;

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const AutomationApi = {
  async list(): Promise<Automation[]> {
    return json<Automation[]>(await fetch(`${AUTO_BASE}/`));
  },

  async get(id: string): Promise<Automation> {
    return json<Automation>(await fetch(`${AUTO_BASE}/${id}`));
  },

  async create(
    automation: Omit<
      Automation,
      "id" | "createdAt" | "updatedAt" | "lastRun" | "lastStatus" | "lastError"
    >,
  ): Promise<Automation> {
    return json<Automation>(
      await fetch(`${AUTO_BASE}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automation),
      }),
    );
  },

  async update(id: string, patch: Partial<Automation>): Promise<Automation> {
    return json<Automation>(
      await fetch(`${AUTO_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }),
    );
  },

  async remove(id: string): Promise<void> {
    await fetch(`${AUTO_BASE}/${id}`, { method: "DELETE" });
  },

  async setEnabled(id: string, enabled: boolean): Promise<Automation> {
    return json<Automation>(
      await fetch(`${AUTO_BASE}/${id}/enabled`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      }),
    );
  },

  async history(id: string, limit = 50): Promise<unknown[]> {
    return json<unknown[]>(
      await fetch(`${AUTO_BASE}/${id}/history?limit=${limit}`),
    );
  },

  async configureHA(config: {
    baseUrl: string;
    token: string;
    webSocketEnabled?: boolean;
  }): Promise<{ ok: boolean }> {
    return json<{ ok: boolean }>(
      await fetch(HA_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      }),
    );
  },

  async haStatus(): Promise<{ configured: boolean }> {
    return json<{ configured: boolean }>(await fetch(`${HA_BASE}/status`));
  },
};
