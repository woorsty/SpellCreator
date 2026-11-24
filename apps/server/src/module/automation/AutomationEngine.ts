import { EventBus, Automation, AutomationPermission, AutomationExecutionResult, CombatEventType } from "@repo/domain";
import * as vm from "vm";
import * as fs from "fs/promises";
import * as path from "path";

const AUTOMATIONS_PATH = path.resolve(process.cwd(), "data/automations.json");

const DEFAULT_TIMEOUT_MS = 5000;
const MAX_TIMEOUT_MS = 30000;

function now(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface IntegrationAPIs {
  homeAssistant?: {
    callService: (domain: string, service: string, data: Record<string, unknown>) => Promise<unknown>;
    getState: (entityId: string) => Promise<unknown>;
    getStates: () => Promise<Record<string, unknown>>;
  };
  audio?: {
    play: (opts: { source: string; volume?: number; loop?: boolean }) => Promise<void>;
    stop: () => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
  };
  http?: {
    fetch: typeof fetch;
  };
}

export class AutomationEngine {
  private eventBus: EventBus<CombatEventType, unknown> | null = null;
  private automations = new Map<string, Automation>();
  private integrations: IntegrationAPIs = {};
  private readonly defaultTimeoutMs: number;
  private executionHistory: AutomationExecutionResult[] = [];
  private readonly maxHistory = 500;
  private automationsPath: string;

  constructor(
    options: {
      eventBus?: EventBus<CombatEventType, unknown>;
      integrations?: IntegrationAPIs;
      defaultTimeoutMs?: number;
      automationsPath?: string;
    } = {},
  ) {
    if (options.eventBus) this.eventBus = options.eventBus;
    this.integrations = options.integrations ?? {};
    this.defaultTimeoutMs = Math.min(
      options.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS,
      MAX_TIMEOUT_MS,
    );
    this.automationsPath = options.automationsPath ?? AUTOMATIONS_PATH;
  }

  setEventBus(eventBus: EventBus<CombatEventType, unknown>): void {
    this.eventBus = eventBus;
  }

  /* ---------------------------------------------------------------- *
   * Integration registration                                           *
   * ---------------------------------------------------------------- */

  registerIntegration(name: string, api: unknown): void {
    (this.integrations as Record<string, unknown>)[name] = api;
  }

  /* ---------------------------------------------------------------- *
   * Automation CRUD                                                    *
   * ---------------------------------------------------------------- */

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.automationsPath, "utf-8");
      const data = JSON.parse(content) as Automation[];
      for (const a of data) {
        this.automations.set(a.id, a);
      }
    } catch {
      // no automations yet
    }
  }

  async save(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.automationsPath), { recursive: true });
      await fs.writeFile(
        this.automationsPath,
        JSON.stringify([...this.automations.values()], null, 2),
        "utf-8",
      );
    } catch (err) {
      console.error("[AutomationEngine] Failed to persist automations:", err);
    }
  }

  getAutomations(): Automation[] {
    return [...this.automations.values()].sort(
      (a, b) => b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  getAutomation(id: string): Automation | undefined {
    return this.automations.get(id);
  }

  async createAutomation(
    automation: Omit<Automation, "id" | "createdAt" | "updatedAt" | "lastRun" | "lastStatus" | "lastError"> & { id?: string },
  ): Promise<Automation> {
    const id = automation.id ?? generateId();
    const nowStr = now();
    const a: Automation = {
      ...automation,
      id,
      createdAt: nowStr,
      updatedAt: nowStr,
      lastRun: undefined,
      lastStatus: "idle",
      lastError: undefined,
    };
    this.automations.set(id, a);
    await this.save();
    return a;
  }

  async updateAutomation(id: string, patch: Partial<Automation>): Promise<Automation | null> {
    const existing = this.automations.get(id);
    if (!existing) return null;
    const updated: Automation = { ...existing, ...patch, id, updatedAt: now() };
    this.automations.set(id, updated);
    await this.save();
    return updated;
  }

  async deleteAutomation(id: string): Promise<boolean> {
    const ok = this.automations.delete(id);
    if (ok) await this.save();
    return ok;
  }

  async setEnabled(id: string, enabled: boolean): Promise<Automation | null> {
    return this.updateAutomation(id, { enabled });
  }

  /* ---------------------------------------------------------------- *
   * Event handling                                                     *
   * ---------------------------------------------------------------- */

  attach(): void {
    if (!this.eventBus) {
      throw new Error("AutomationEngine: no EventBus attached");
    }
    this.eventBus.subscribe(/.*/ as unknown as RegExp, async (event: string, payload: unknown) => {
      await this.handleEvent(event, payload as Record<string, unknown>);
    });
  }

  async handleEvent(event: string, payload: Record<string, unknown>): Promise<void> {
    const eventType = (event as CombatEventType) ?? "";
    const matching = this.getAutomations().filter(
      (a) =>
        a.enabled &&
        (a.event === eventType || a.event === `custom:${eventType}`),
    );

    if (matching.length === 0) return;

    // Execute all matching automations concurrently but isolated
    await Promise.all(
      matching.map((a) => this.executeAutomation(a, payload)),
    );
  }

  /* ---------------------------------------------------------------- *
   * Script execution (sandboxed)                                       *
   * ---------------------------------------------------------------- */

  async executeAutomation(
    automation: Automation,
    eventPayload: Record<string, unknown>,
  ): Promise<void> {
    if (automation.condition) {
      const cond = this.evaluateCondition(automation.condition, eventPayload);
      if (!cond) {
        return;
      }
    }

    const startedAt = now();
    let status: AutomationExecutionResult["status"] = "success";
    let result: unknown;
    let error: string | undefined;
    let stacktrace: string | undefined;

    const resultWrapper: { value: unknown } = { value: undefined };

    let timedOut = false;
    try {
      await this.runScript(automation, eventPayload, resultWrapper);
      result = resultWrapper.value;
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Script timeout")) {
        timedOut = true;
        status = "timeout";
        error = err.message;
      } else {
        status = "error";
        error = err instanceof Error ? err.message : String(err);
        stacktrace = err instanceof Error ? err.stack : undefined;
      }
      console.error(
        `[AutomationEngine] Automation "${automation.name}" (${automation.id}) failed:`,
        error,
      );
    }

    const finishedAt = now();
    const durationMs =
      new Date(finishedAt).getTime() - new Date(startedAt).getTime();

    const execution: AutomationExecutionResult = {
      automationId: automation.id,
      event: eventPayload.event as CombatEventType,
      startedAt,
      finishedAt,
      status,
      result,
      error,
      stacktrace,
      durationMs,
    };

    this.executionHistory.push(execution);
    if (this.executionHistory.length > this.maxHistory) {
      this.executionHistory = this.executionHistory.slice(-this.maxHistory);
    }

    const updated = await this.updateAutomation(automation.id, {
      lastRun: finishedAt,
      lastStatus: status,
      lastError: error,
    });
    if (!updated) {
      // automation was deleted during execution
    }
  }

  private evaluateCondition(
    condition: string,
    payload: Record<string, unknown>,
  ): boolean {
    try {
      const sandbox = { event: payload, Math, Date, JSON, console };
      const wrapped = `(function(event) { return (${condition}); })`;
      const fn = vm.runInNewContext(wrapped, sandbox, { timeout: 1000 });
      return Boolean(fn(payload));
    } catch (err) {
      console.error("[AutomationEngine] Condition evaluation failed:", err);
      return false;
    }
  }

  private async runScript(
    automation: Automation,
    eventPayload: Record<string, unknown>,
    result: { value: unknown },
  ): Promise<void> {
    const sandbox = this.buildSandbox(automation, eventPayload, result);

    // Wrap user code in an async function so await works
    const wrappedCode = `(async () => { ${automation.code} })();`;

    const context = vm.createContext(sandbox);

    const timeoutMs = Math.min(
      Math.max(automation.timeoutMs ?? this.defaultTimeoutMs, 1000),
      MAX_TIMEOUT_MS,
    );

    try {
      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            reject(new Error(`Script timeout after ${timeoutMs}ms`));
          }
        }, timeoutMs);
        timer.unref?.();

        try {
      const promise = vm.runInContext(wrappedCode, context, {
        timeout: timeoutMs,
      });
      if (promise && typeof (promise as Promise<unknown>).then === "function") {
        (promise as Promise<void>).then(
          () => {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              resolve();
            }
          },
          (err) => {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              reject(err);
            }
          },
        );
      } else {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve();
        }
      }
    } catch (err) {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(err);
      }
    }
      });
    } finally {
      // no-op
    }
  }

  private buildSandbox(
    automation: Automation,
    eventPayload: Record<string, unknown>,
    result: { value: unknown },
  ): Record<string, unknown> {
    const hasPerm = (p: AutomationPermission) =>
      automation.permissions.includes(p);

    const sandbox: Record<string, unknown> = {
      event: eventPayload,
      console: {
        log: (...args: unknown[]) => console.log("[Automation]", ...args),
        error: (...args: unknown[]) => console.error("[Automation]", ...args),
        warn: (...args: unknown[]) => console.warn("[Automation]", ...args),
        info: (...args: unknown[]) => console.info("[Automation]", ...args),
      },
      setTimeout: ((fn: Function, ms: number) =>
        setTimeout(fn as () => void, ms)) as unknown,
      clearTimeout: clearTimeout as unknown,
      // Expose result holder so scripts can return a value
      _setResult: (v: unknown) => {
        result.value = v;
      },
    };

    // Home Assistant API
    if (hasPerm("homeassistant:call") || hasPerm("homeassistant:read")) {
      const ha: Record<string, unknown> = {};
      if (hasPerm("homeassistant:call") && this.integrations.homeAssistant?.callService) {
        ha.callService = this.integrations.homeAssistant.callService.bind(
          this.integrations.homeAssistant,
        );
      }
      if (hasPerm("homeassistant:read") && this.integrations.homeAssistant?.getState) {
        ha.getState = this.integrations.homeAssistant.getState.bind(
          this.integrations.homeAssistant,
        );
      }
      if (hasPerm("homeassistant:read") && this.integrations.homeAssistant?.getStates) {
        ha.getStates = this.integrations.homeAssistant.getStates.bind(
          this.integrations.homeAssistant,
        );
      }
      sandbox.homeAssistant = ha;
    }

    // Audio API
    if (hasPerm("audio:play") && this.integrations.audio) {
      const { play, stop, setVolume } = this.integrations.audio;
      sandbox.audio = {
        play: play ? play.bind(this.integrations.audio) : undefined,
        stop: stop ? stop.bind(this.integrations.audio) : undefined,
        setVolume: setVolume ? setVolume.bind(this.integrations.audio) : undefined,
      };
    }

    // HTTP / fetch
    if (hasPerm("http:request")) {
      sandbox.fetch = fetch.bind(globalThis);
    }

    return sandbox;
  }

  getExecutionHistory(automationId?: string): AutomationExecutionResult[] {
    if (automationId) {
      return this.executionHistory.filter((e) => e.automationId === automationId);
    }
    return [...this.executionHistory].reverse();
  }
}

export const automationEngine = new AutomationEngine();
