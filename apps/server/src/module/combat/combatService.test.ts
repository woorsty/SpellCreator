import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CombatService } from "./combatService";
import type { Condition } from "@repo/domain";
import * as path from "path";
import * as fs from "fs/promises";
import os from "os";

const ORIGINAL_CWD = process.cwd();
const TEST_DIR = path.resolve(os.tmpdir(), `dnd-combat-test-${Date.now()}`);

function nowIso(): string {
  return new Date().toISOString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("CombatService", () => {
  let service: CombatService;
  let combatId: string;

  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    process.chdir(TEST_DIR);
    service = new CombatService();
    const combat = await service.createCombat("Testkampf");
    combatId = combat.id;
  });

  afterEach(async () => {
    process.chdir(ORIGINAL_CWD);
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  async function addNamedCombatant(name: string, initiative: number, type: "player" | "npc" | "monster" = "npc") {
    const id = `c-${name}-${Date.now()}`;
    const c = await service.addCombatant(combatId, {
      id,
      name,
      type,
      initiative,
      initiativeBonus: 0,
      hp: 10,
      maxHp: 10,
      tempHp: 0,
      armorClass: 10,
      conditions: [],
      isDead: false,
      isConcentrating: false,
      senses: [],
    });
    return c.combatants.find((x) => x.id === id)!.id;
  }

  it("should create and retrieve a combat", async () => {
    const c = await service.getCombat(combatId);
    expect(c).not.toBeNull();
    expect(c!.name).toBe("Testkampf");
    expect(c!.status).toBe("preparing");
    expect(c!.round).toBe(1);
  });

  it("should add a combatant and sort by initiative", async () => {
    await addNamedCombatant("Gandalf", 15, "player");
    await addNamedCombatant("Orc", 20, "monster");

    const c = await service.getCombat(combatId);
    const sorted = c!.combatants;
    expect(sorted[0].name).toBe("Orc");
    expect(sorted[1].name).toBe("Gandalf");
  });

  it("should advance turns and rounds correctly", async () => {
    await addNamedCombatant("A", 10, "player");
    await addNamedCombatant("B", 5, "monster");

    await service.startCombat(combatId);
    let c = await service.getCombat(combatId);
    expect(c!.status).toBe("active");
    expect(c!.round).toBe(1);

    await service.nextTurn(combatId);
    c = await service.getCombat(combatId);
    expect(c!.currentTurnIndex).toBe(1);

    await service.nextTurn(combatId);
    c = await service.getCombat(combatId);
    expect(c!.currentTurnIndex).toBe(0);
    expect(c!.round).toBe(2);
  });

  it("should change hp, damage, heal, and mark death", async () => {
    const targetId = await addNamedCombatant("Target", 10, "npc");

    await service.changeHp(combatId, targetId, -5);
    let c = await service.getCombat(combatId);
    const t = c!.combatants.find((x) => x.id === targetId)!;
    expect(t.hp).toBe(5);

    await service.changeHp(combatId, targetId, -10);
    c = await service.getCombat(combatId);
    const t2 = c!.combatants.find((x) => x.id === targetId)!;
    expect(t2.hp).toBe(0);
    expect(t2.isDead).toBe(true);

    await service.changeHp(combatId, targetId, 20);
    c = await service.getCombat(combatId);
    const t3 = c!.combatants.find((x) => x.id === targetId)!;
    expect(t3.hp).toBe(10);
    expect(t3.isDead).toBe(false);
  });

  it("should apply and remove conditions", async () => {
    const targetId = await addNamedCombatant("Target", 10, "npc");

    const cond: Condition = {
      id: "poison-1",
      name: "Vergiftet",
      description: "Nimm Schaden",
      rounds: 3,
      concentration: false,
    };
    await service.applyCondition(combatId, targetId, cond);
    let c = await service.getCombat(combatId);
    const t = c!.combatants.find((x) => x.id === targetId)!;
    expect(t.conditions.length).toBe(1);
    expect(t.conditions[0].name).toBe("Vergiftet");

    await service.removeCondition(combatId, targetId, "poison-1");
    c = await service.getCombat(combatId);
    const t2 = c!.combatants.find((x) => x.id === targetId)!;
    expect(t2.conditions.length).toBe(0);
  });

  it("should set initiative and re-sort", async () => {
    await addNamedCombatant("Low", 5, "player");
    await addNamedCombatant("High", 20, "monster");

    const c1 = await service.getCombat(combatId);
    const lowId = c1!.combatants.find((x) => x.name === "Low")!.id;

    await service.setInitiative(combatId, lowId, 25);
    const c = await service.getCombat(combatId);
    const low = c!.combatants.find((x) => x.id === lowId)!;
    const high = c!.combatants.find((x) => x.name === "High")!;
    expect(low.initiative).toBe(25);
    expect(c!.combatants[0].id).toBe(low.id);
    expect(c!.combatants[c!.combatants.length - 1].id).toBe(high.id);
  });

  it("should start, pause, resume, and end combat", async () => {
    await service.startCombat(combatId);
    let c = await service.getCombat(combatId);
    expect(c!.status).toBe("active");

    await service.pauseCombat(combatId);
    c = await service.getCombat(combatId);
    expect(c!.status).toBe("paused");

    await service.resumeCombat(combatId);
    c = await service.getCombat(combatId);
    expect(c!.status).toBe("active");

    await service.endCombat(combatId);
    c = await service.getCombat(combatId);
    expect(c!.status).toBe("ended");
  });

  it("should persist combat and combatants between service instances (session restart)", async () => {
    const targetId = await addNamedCombatant("Goblin", 12, "monster");
    await service.changeHp(combatId, targetId, -4);
    await service.saveEncounter({
      id: "enc-1",
      name: "Test-Begegnung",
      combatants: [
        {
          id: "enc-c-1",
          name: "Orc",
          type: "monster",
          initiative: 15,
          initiativeBonus: 2,
          hp: 20,
          maxHp: 20,
          tempHp: 0,
          armorClass: 13,
          conditions: [],
          isDead: false,
          isConcentrating: false,
          senses: [],
        },
      ],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });

    // Give debounced saves time to flush to disk, then simulate a new session
    await sleep(700);
    const service2 = new CombatService();
    const loaded = await service2.getCombat(combatId);
    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe("Testkampf");
    const goblin = loaded!.combatants.find((x) => x.id === targetId)!;
    expect(goblin.hp).toBe(6);
    expect(goblin.isDead).toBe(false);

    const encounters2 = await service2.listEncounters();
    expect(encounters2.some((e) => e.id === "enc-1")).toBe(true);
    expect(encounters2.find((e) => e.id === "enc-1")!.combatants[0].name).toBe("Orc");
  });
});
