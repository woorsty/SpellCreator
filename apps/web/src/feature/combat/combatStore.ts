import { create } from "zustand";
import { CombatApi } from "../../api/combat-api";
import { CreatureApi } from "../../api/creature-api";
import { MonsterApi } from "../../api/monster-api";
import type {
  CombatState,
  Combatant,
  CharacterSheet,
  Condition,
} from "@repo/domain";
import { characterSheetToCombatant } from "./utils/creatureToCombatant";

type CombatStore = {
  currentCombat: CombatState | null;
  loading: boolean;
  error: string | null;

  creatures: CharacterSheet[];
  creaturesLoading: boolean;
  creaturesError: string | null;

  monsters: Combatant[];
  monstersLoading: boolean;
  monstersError: string | null;

  fetchCreatures: () => Promise<void>;
  initCombat: () => Promise<void>;

  startCombat: () => Promise<void>;
  pauseCombat: () => Promise<void>;
  resumeCombat: () => Promise<void>;
  endCombat: () => Promise<void>;
  nextTurn: () => Promise<void>;
  previousTurn: () => Promise<void>;
  skipTurn: () => Promise<void>;

  addCombatant: (combatant: Omit<Combatant, "turnOrder">) => Promise<void>;
  addCombatants: (
    combatants: Omit<Combatant, "turnOrder">[],
  ) => Promise<void>;
  addMonsterToCombat: (monster: Omit<Combatant, "turnOrder">) => Promise<void>;
  removeCombatant: (combatantId: string) => Promise<void>;
  updateCombatant: (
    combatantId: string,
    patch: Partial<Omit<Combatant, "id" | "turnOrder">>,
  ) => Promise<void>;
  changeHp: (combatantId: string, change: number, source?: string) => Promise<void>;
  setTempHp: (combatantId: string, tempHp: number) => Promise<void>;
  setInitiative: (combatantId: string, initiative: number) => Promise<void>;
  applyCondition: (combatantId: string, condition: Condition) => Promise<void>;
  removeCondition: (combatantId: string, conditionId: string) => Promise<void>;

  /** conditionId -> combat round at application time (client-side countdown only) */
  conditionAppliedAt: Record<string, number>;

  fetchMonsters: () => Promise<void>;
  saveMonster: (monster: Omit<Combatant, "turnOrder">) => Promise<void>;
  updateMonster: (
    name: string,
    patch: Partial<Omit<Combatant, "turnOrder">>,
  ) => Promise<void>;
  deleteMonster: (name: string) => Promise<void>;

  updateCurrentCombat: (combat: CombatState) => void;
};

export const useCombatStore = create<CombatStore>((set, get) => ({
  currentCombat: null,
  loading: false,
  error: null,

  creatures: [],
  creaturesLoading: false,
  creaturesError: null,

  monsters: [],
  monstersLoading: false,
  monstersError: null,

  conditionAppliedAt: {},

  fetchCreatures: async () => {
    set({ creaturesLoading: true, creaturesError: null });
    try {
      const creatures = await CreatureApi.listCreatures();
      set({ creatures, creaturesLoading: false });
    } catch (err) {
      set({
        creaturesError: (err as Error).message,
        creaturesLoading: false,
      });
    }
  },

  fetchMonsters: async () => {
    set({ monstersLoading: true, monstersError: null });
    try {
      const monsters = await MonsterApi.listMonsters();
      set({ monsters, monstersLoading: false });
    } catch (err) {
      set({
        monstersError: (err as Error).message,
        monstersLoading: false,
      });
    }
  },

  saveMonster: async (monster) => {
    try {
      await MonsterApi.createMonster(monster);
      set((state) => ({
        monsters: [...state.monsters, monster as Combatant],
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  updateMonster: async (name, patch) => {
    try {
      // Preserve the original monster's id
      const originalMonster = get().monsters.find((m) => m.name === name);
      const idToPreserve = originalMonster?.id;
      
      await MonsterApi.updateMonster(name, patch);
      set((state) => ({
        monsters: state.monsters.map((m) =>
          m.name === name ? { ...m, ...patch, id: idToPreserve ?? m.id } : m,
        ),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  deleteMonster: async (name) => {
    try {
      await MonsterApi.deleteMonster(name);
      set((state) => ({
        monsters: state.monsters.filter((m) => m.name !== name),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addMonsterToCombat: async (monster) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.addCombatant(id, monster);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  initCombat: async () => {
    if (get().currentCombat) return;
    set({ loading: true, error: null });
    try {
      const combat = await CombatApi.createCombat("Aktueller Kampf");
      set({ currentCombat: combat, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  startCombat: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.startCombat(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  pauseCombat: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.pauseCombat(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  resumeCombat: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.resumeCombat(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  endCombat: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.endCombat(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  nextTurn: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.nextTurn(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  previousTurn: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.previousTurn(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  skipTurn: async () => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.skipTurn(id);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addCombatant: async (combatant) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.addCombatant(id, combatant);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addCombatants: async (combatants) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      for (const combatant of combatants) {
        const combat = await CombatApi.addCombatant(id, combatant);
        set({ currentCombat: combat });
      }
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  removeCombatant: async (combatantId) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      await CombatApi.removeCombatant(id, combatantId);
      set((state) => ({
        currentCombat: state.currentCombat
          ? {
              ...state.currentCombat,
              combatants: state.currentCombat.combatants.filter(
                (c) => c.id !== combatantId,
              ),
            }
          : null,
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  updateCombatant: async (combatantId, patch) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.updateCombatant(id, combatantId, patch);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  changeHp: async (combatantId, change, source) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.changeHp(id, combatantId, change, source);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  setTempHp: async (combatantId, tempHp) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.setTempHp(id, combatantId, tempHp);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  setInitiative: async (combatantId, initiative) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.setInitiative(id, combatantId, initiative);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  applyCondition: async (combatantId, condition) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const currentRound = get().currentCombat?.round ?? 1;
      const combat = await CombatApi.applyCondition(id, combatantId, condition);
      set((state) => ({
        currentCombat: combat,
        conditionAppliedAt: {
          ...state.conditionAppliedAt,
          [condition.id]: currentRound,
        },
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  removeCondition: async (combatantId, conditionId) => {
    const id = get().currentCombat?.id;
    if (!id) return;
    try {
      const combat = await CombatApi.removeCondition(id, combatantId, conditionId);
      set({ currentCombat: combat });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  updateCurrentCombat: (combat) => set({ currentCombat: combat }),
}));
