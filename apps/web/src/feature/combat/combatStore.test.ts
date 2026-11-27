import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CombatState, Encounter } from "@repo/domain";

vi.mock("../../api/combat-api", () => ({
  CombatApi: {
    listEncounters: vi.fn(),
    saveEncounter: vi.fn(),
    getCombat: vi.fn(),
    createCombat: vi.fn(),
    addCombatant: vi.fn(),
    startCombat: vi.fn(),
    pauseCombat: vi.fn(),
  },
}));
vi.mock("../../api/creature-api", () => ({ CreatureApi: { listCreatures: vi.fn() } }));
vi.mock("../../api/monster-api", () => ({ MonsterApi: { listMonsters: vi.fn() } }));

import { CombatApi } from "../../api/combat-api";
import { useCombatStore } from "./combatStore";

function makeEncounter(overrides: Partial<Encounter> = {}): Encounter {
  return {
    id: "e1",
    name: "Ambush",
    combatants: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const STORAGE_KEY = "spellcreator-combat";

function makeCombat(overrides: Partial<CombatState> = {}): CombatState {
  return {
    id: "combat-1",
    name: "Testkampf",
    status: "preparing",
    round: 1,
    currentTurnIndex: 0,
    combatants: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("combatStore persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useCombatStore.setState({ encounters: [], currentCombat: null });
  });

  it("should_save_encounter_to_server_and_store_when_server_succeeds", async () => {
    const encounter = makeEncounter();
    vi.mocked(CombatApi.saveEncounter).mockResolvedValue(encounter);

    await useCombatStore.getState().saveEncounter(encounter);

    expect(CombatApi.saveEncounter).toHaveBeenCalledWith(encounter);
    expect(useCombatStore.getState().encounters).toContainEqual(encounter);
  });

  it("should_persist_encounter_locally_when_server_fails", async () => {
    const encounter = makeEncounter({ id: "local-1" });
    vi.mocked(CombatApi.saveEncounter).mockRejectedValue(new Error("offline"));

    await useCombatStore.getState().saveEncounter(encounter);

    expect(useCombatStore.getState().encounters).toContainEqual(encounter);
    expect(useCombatStore.getState().error).toBe("offline");
  });

  it("should_write_persisted_state_to_localStorage_when_encounter_saved", async () => {
    const encounter = makeEncounter({ id: "persist-1" });
    vi.mocked(CombatApi.saveEncounter).mockResolvedValue(encounter);

    await useCombatStore.getState().saveEncounter(encounter);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.encounters).toContainEqual(encounter);
  });

  it("should_merge_server_and_local_encounters_when_fetching", async () => {
    const serverEncounter = makeEncounter({ id: "server-1" });
    const localEncounter = makeEncounter({ id: "local-1" });
    useCombatStore.setState({ encounters: [localEncounter] });
    vi.mocked(CombatApi.listEncounters).mockResolvedValue([serverEncounter]);

    await useCombatStore.getState().fetchEncounters();

    const ids = useCombatStore.getState().encounters.map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(["server-1", "local-1"]));
  });

  it("should_remove_encounter_from_store_when_deleted", async () => {
    useCombatStore.setState({ encounters: [makeEncounter({ id: "del-1" })] });

    await useCombatStore.getState().deleteEncounter("del-1");

    expect(useCombatStore.getState().encounters).toHaveLength(0);
  });
});

describe("combatStore initCombat recovery", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useCombatStore.setState({ encounters: [], currentCombat: null });
  });

  it("should_keep_existing_combat_when_server_still_has_it", async () => {
    const combat = makeCombat();
    useCombatStore.setState({ currentCombat: combat });
    vi.mocked(CombatApi.getCombat).mockResolvedValue(combat);

    await useCombatStore.getState().initCombat();

    expect(CombatApi.createCombat).not.toHaveBeenCalled();
    expect(useCombatStore.getState().currentCombat).toEqual(combat);
  });

  it("should_recreate_combat_from_persisted_combatants_when_server_lost_it", async () => {
    const combatant = {
      id: "c1",
      name: "Goblin",
      type: "monster" as const,
      initiative: 5,
      initiativeBonus: 0,
      hp: 7,
      maxHp: 7,
      tempHp: 0,
      armorClass: 15,
      conditions: [],
      isDead: false,
      isConcentrating: false,
      senses: [],
    };
    const persisted = makeCombat({ combatants: [combatant as any] });
    useCombatStore.setState({ currentCombat: persisted });
    vi.mocked(CombatApi.getCombat).mockRejectedValue(
      new Error("Combat not found"),
    );
    const recreated = makeCombat({ id: "combat-2", combatants: [combatant as any] });
    vi.mocked(CombatApi.createCombat).mockResolvedValue(recreated);
    vi.mocked(CombatApi.addCombatant).mockResolvedValue(recreated);

    await useCombatStore.getState().initCombat();

    expect(CombatApi.createCombat).toHaveBeenCalledWith(persisted.name);
    expect(CombatApi.addCombatant).toHaveBeenCalledWith(
      recreated.id,
      combatant,
    );
    expect(useCombatStore.getState().currentCombat).toEqual(recreated);
  });

  it("should_create_fresh_combat_when_none_persisted", async () => {
    const combat = makeCombat();
    vi.mocked(CombatApi.createCombat).mockResolvedValue(combat);

    await useCombatStore.getState().initCombat();

    expect(CombatApi.createCombat).toHaveBeenCalledWith("Aktueller Kampf");
    expect(useCombatStore.getState().currentCombat).toEqual(combat);
  });
});