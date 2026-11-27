import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Combatant, Encounter } from "@repo/domain";
import {
  exportEncounter,
  exportEncounters,
  exportMonster,
  exportMonsters,
} from "./export";

function makeCombatant(overrides: Partial<Combatant> = {}): Combatant {
  return {
    id: "c1",
    name: "Goblin",
    type: "monster",
    initiative: 0,
    initiativeBonus: 0,
    hp: 7,
    maxHp: 7,
    tempHp: 0,
    armorClass: 15,
    conditions: [],
    isDead: false,
    isConcentrating: false,
    senses: [],
    turnOrder: 0,
    ...overrides,
  };
}

function makeEncounter(overrides: Partial<Encounter> = {}): Encounter {
  return {
    id: "e1",
    name: "Goblin Ambush",
    combatants: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("combat export utils", () => {
  let anchorClick: ReturnType<typeof vi.spyOn>;
  let createObjectUrl: ReturnType<typeof vi.spyOn>;
  let revokeObjectUrl: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    createObjectUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock");
    revokeObjectUrl = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should_download_single_encounter_with_sanitized_filename_when_exporting_encounter", () => {
    exportEncounter(makeEncounter({ name: "Goblin/Ambush!" }));
    expect(anchorClick).toHaveBeenCalledTimes(1);
    const anchor = anchorClick.mock.instances[0] as HTMLAnchorElement;
    expect(anchor.download).toBe("encounter-goblin_ambush_.json");
    expect(createObjectUrl).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:mock");
  });

  it("should_download_all_encounters_as_json_when_exporting_multiple", () => {
    exportEncounters([makeEncounter(), makeEncounter({ id: "e2" })]);
    const anchor = anchorClick.mock.instances[0] as HTMLAnchorElement;
    expect(anchor.download).toBe("encounters.json");
  });

  it("should_download_single_monster_with_sanitized_filename_when_exporting_monster", () => {
    exportMonster(makeCombatant({ name: "Orc Chief" }));
    const anchor = anchorClick.mock.instances[0] as HTMLAnchorElement;
    expect(anchor.download).toBe("monster-orc_chief.json");
  });

  it("should_download_all_monsters_as_json_when_exporting_multiple", () => {
    exportMonsters([makeCombatant(), makeCombatant({ id: "c2" })]);
    const anchor = anchorClick.mock.instances[0] as HTMLAnchorElement;
    expect(anchor.download).toBe("monsters.json");
  });
});