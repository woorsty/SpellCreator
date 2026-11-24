import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventBus } from "@repo/domain";
import type { Automation, AutomationPermission, CombatEventType } from "@repo/domain";
import { AutomationEngine } from "./AutomationEngine";
import * as fs from "fs/promises";
import * as path from "path";
import os from "os";

const TEST_DIR = path.resolve(os.tmpdir(), `dnd-auto-test-${Date.now()}`);
const AUTOMATIONS_PATH = path.resolve(TEST_DIR, "automations.json");

const makeAutomation = (overrides: Partial<Automation> = {}): Automation => ({
  id: "test-auto",
  name: "Test",
  description: undefined,
  enabled: true,
  event: "combat.turn.started",
  condition: undefined,
  code: "",
  lastRun: undefined,
  lastStatus: "idle",
  lastError: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  permissions: [],
  ...overrides,
});

describe("AutomationEngine", () => {
  let engine: AutomationEngine;
  let bus: EventBus<CombatEventType, unknown>;
  let haCalls: Array<{ domain: string; service: string; data: unknown }> = [];

  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    bus = new EventBus<CombatEventType, unknown>();
    engine = new AutomationEngine({ eventBus: bus, automationsPath: AUTOMATIONS_PATH });
    haCalls = [];
    engine.registerIntegration("homeAssistant", {
      callService: vi.fn(async (_domain: string, _service: string, _data: unknown) => {
        haCalls.push({ domain: _domain, service: _service, data: _data });
        return { ok: true };
      }),
    } as any);
    engine.registerIntegration("audio", {
      play: vi.fn(async () => {}),
    } as any);
    void engine.load();
    engine.attach();
  });

  afterEach(async () => {
    try {
      await fs.rm(TEST_DIR, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  const basePayload = {
    combat: { id: "c1", round: 1 },
    combatant: { id: "x", name: "Gandalf", type: "player", hp: 42, maxHp: 60, initiative: 18, conditions: [] },
  };

  it("should register and retrieve automation", async () => {
    const auto = makeAutomation({ code: "console.log('hi');" });
    await engine.createAutomation(auto);
    expect(engine.getAutomations().length).toBe(1);
    expect(engine.getAutomation("test-auto")).toBeDefined();
  });

  it("should execute automation directly via executeAutomation", async () => {
    const auto = makeAutomation({ code: `_setResult("ok");`, permissions: [] });
    await engine.createAutomation(auto);
    const stored = engine.getAutomation("test-auto")!;
    await engine.executeAutomation(stored, { event: "combat.turn.started" });
    const history = engine.getExecutionHistory("test-auto");
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe("success");
    expect(history[0].result).toBe("ok");
  });

  it("should handle event directly via handleEvent", async () => {
    const auto = makeAutomation({ code: `_setResult("ok");`, permissions: [] });
    await engine.createAutomation(auto);
    await engine.handleEvent("combat.turn.started", basePayload);
    const history = engine.getExecutionHistory("test-auto");
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe("success");
    expect(history[0].result).toBe("ok");
  });

  it("should execute a simple script and return a result", async () => {
    const auto = makeAutomation({ code: `_setResult(1 + 2);` });
    await engine.createAutomation(auto);

    await bus.emit("combat.turn.started", basePayload);

    const history = engine.getExecutionHistory("test-auto");
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe("success");
    expect(history[0].result).toBe(3);
  });

  it("should execute automation script on matching event with homeAssistant", async () => {
    const auto = makeAutomation({
      code: `await homeAssistant.callService("light", "turn_on", { entity_id: "light.a" });`,
      permissions: ["homeassistant:call"],
    });
    await engine.createAutomation(auto);

    await bus.emit("combat.turn.started", basePayload);

    expect(haCalls).toHaveLength(1);
    expect(haCalls[0]).toEqual({ domain: "light", service: "turn_on", data: { entity_id: "light.a" } });
  });

  it("should not execute disabled automation", async () => {
    const auto = makeAutomation({
      code: `await homeAssistant.callService("light", "turn_on", {});`,
      permissions: ["homeassistant:call"],
      enabled: false,
    });
    await engine.createAutomation(auto);

    await bus.emit("combat.turn.started", basePayload);

    expect(haCalls).toHaveLength(0);
  });

  it("should not execute automation for non-matching event", async () => {
    const auto = makeAutomation({
      code: `await homeAssistant.callService("light", "turn_on", {});`,
      permissions: ["homeassistant:call"],
    });
    await engine.createAutomation(auto);

    await bus.emit("combat.ended", { combat: { id: "c1", round: 1 } });

    expect(haCalls).toHaveLength(0);
  });

  it("should evaluate condition and skip when falsy", async () => {
    const auto = makeAutomation({
      condition: "event.combatant.type === 'player'",
      code: `await homeAssistant.callService("light", "turn_on", {});`,
      permissions: ["homeassistant:call"],
    });
    await engine.createAutomation(auto);

    await bus.emit("combat.turn.started", {
      ...basePayload,
      combatant: { ...basePayload.combatant, type: "monster" },
    });

    expect(haCalls).toHaveLength(0);

    await bus.emit("combat.turn.started", basePayload);

    expect(haCalls).toHaveLength(1);
  });

  it("should isolate errors: failing automation does not block others", async () => {
    const failing = makeAutomation({
      id: "fail",
      name: "Failing",
      code: `throw new Error("script error");`,
      permissions: [],
    });
    const succeeding = makeAutomation({
      id: "ok",
      name: "Succeeding",
      code: `await homeAssistant.callService("light", "turn_on", {});`,
      permissions: ["homeassistant:call"],
    });
    await engine.createAutomation(failing);
    await engine.createAutomation(succeeding);

    await bus.emit("combat.turn.started", basePayload);

    expect(haCalls).toHaveLength(1);
  });

  it("should enforce timeout on long-running scripts", async () => {
    const auto = makeAutomation({
      code: `await new Promise(resolve => setTimeout(resolve, 10000));`,
      permissions: [],
      timeoutMs: 100,
    });
    await engine.createAutomation(auto);

    const start = Date.now();
    await bus.emit("combat.turn.started", basePayload);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5000);
    const history = engine.getExecutionHistory("test-auto");
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].status).toBe("timeout");
  });

  it("should expose audio integration with audio:play permission", async () => {
    const play = vi.fn(async () => {});
    engine.registerIntegration("audio", { play } as any);
    const auto = makeAutomation({
      code: `await audio.play({ source: "/sounds/x.mp3", volume: 0.8 });`,
      permissions: ["audio:play"],
    });
    await engine.createAutomation(auto);

    await bus.emit("combat.turn.started", basePayload);

    expect(play).toHaveBeenCalledWith({ source: "/sounds/x.mp3", volume: 0.8 });
  });

  it("should not expose homeAssistant without homeassistant:call permission", async () => {
    const auto = makeAutomation({
      code: `if (homeAssistant === undefined) { _setResult("noHA"); } else { _setResult("hasHA"); }`,
      permissions: [],
    });
    await engine.createAutomation(auto);

    await bus.emit("combat.turn.started", basePayload);

    expect(haCalls).toHaveLength(0);
  });
});
