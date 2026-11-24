import { create } from "zustand";
import { AutomationApi } from "../../../api/automation-api";
import type { Automation } from "@repo/domain";

type AutomationStore = {
  automations: Automation[];
  selected: Automation | null;
  loading: boolean;
  error: string | null;
  haConfigured: boolean;

  fetchAutomations: () => Promise<void>;
  fetchHAStatus: () => Promise<void>;
  createAutomation: (data: Omit<Automation, "id" | "createdAt" | "updatedAt" | "lastRun" | "lastStatus" | "lastError">) => Promise<void>;
  updateAutomation: (id: string, patch: Partial<Automation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  setEnabled: (id: string, enabled: boolean) => Promise<void>;
  selectAutomation: (id: string) => Promise<void>;
  clearSelection: () => void;
  configureHA: (config: { baseUrl: string; token: string; webSocketEnabled?: boolean }) => Promise<void>;
};

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  automations: [],
  selected: null,
  loading: false,
  error: null,
  haConfigured: false,

  fetchAutomations: async () => {
    set({ loading: true, error: null });
    try {
      const automations = await AutomationApi.list();
      set({ automations, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchHAStatus: async () => {
    try {
      const { configured } = await AutomationApi.haStatus();
      set({ haConfigured: configured });
    } catch {
      set({ haConfigured: false });
    }
  },

  createAutomation: async (data) => {
    set({ loading: true, error: null });
    try {
      const a = await AutomationApi.create(data);
      set((state) => ({
        automations: [a, ...state.automations],
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  updateAutomation: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const a = await AutomationApi.update(id, patch);
      set((state) => ({
        automations: state.automations.map((x) => (x.id === id ? a : x)),
        selected: get().selected?.id === id ? a : get().selected,
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  deleteAutomation: async (id) => {
    try {
      await AutomationApi.remove(id);
      set((state) => ({
        automations: state.automations.filter((x) => x.id !== id),
        selected: get().selected?.id === id ? null : get().selected,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  setEnabled: async (id, enabled) => {
    try {
      const a = await AutomationApi.setEnabled(id, enabled);
      set((state) => ({
        automations: state.automations.map((x) => (x.id === id ? a : x)),
        selected: get().selected?.id === id ? a : get().selected,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  selectAutomation: async (id) => {
    set({ loading: true, error: null });
    try {
      const a = await AutomationApi.get(id);
      set({ selected: a, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  clearSelection: () => set({ selected: null }),

  configureHA: async (config) => {
    set({ loading: true, error: null });
    try {
      await AutomationApi.configureHA(config);
      set({ haConfigured: true, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
