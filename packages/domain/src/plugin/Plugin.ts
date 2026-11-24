import type { EventBus } from "../event";
import type { AutomationPermission, CombatEventType } from "../model/combat";

export interface PluginContext {
  eventBus: EventBus<CombatEventType, unknown>;
  registerIntegration: (name: string, api: unknown) => void;
  getIntegration: (name: string) => unknown | undefined;
  log: (...args: unknown[]) => void;
}

export interface PluginApi {
  [key: string]: unknown;
}

export interface PluginConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object";
    required?: boolean;
    description?: string;
    default?: unknown;
  };
}

export interface PluginDefinition {
  name: string;
  version: string;
  description?: string;
  permissions?: AutomationPermission[];
  configSchema?: PluginConfigSchema;
}

export interface Plugin {
  readonly definition: PluginDefinition;
  config: Record<string, unknown>;

  onLoad(context: PluginContext): void | Promise<void>;
  onUnload?(): void | Promise<void>;
  getApi?(): PluginApi;
  getConfigSchema?(): PluginConfigSchema | undefined;
  setConfig?(config: Record<string, unknown>): void;
}
