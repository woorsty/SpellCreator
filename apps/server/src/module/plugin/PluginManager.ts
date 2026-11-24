import { EventBus, Plugin, PluginDefinition } from "@repo/domain";
import { automationEngine } from "../automation/AutomationEngine";

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private eventBus: EventBus<any, any> | null = null;

  setEventBus(eventBus: EventBus<any, any>): void {
    this.eventBus = eventBus;
  }

  getEventBus(): EventBus<any, any> | null {
    return this.eventBus;
  }

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.definition.name)) {
      throw new Error(`Plugin "${plugin.definition.name}" is already registered`);
    }
    this.plugins.set(plugin.definition.name, plugin);
  }

  unregister(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;
    if (plugin.onUnload) {
      try {
        plugin.onUnload();
      } catch (err) {
        console.error(`[PluginManager] Error unloading plugin "${name}":`, err);
      }
    }
    return this.plugins.delete(name);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAll(): Plugin[] {
    return [...this.plugins.values()];
  }

  getDefinitions(): PluginDefinition[] {
    return this.getAll().map((p) => p.definition);
  }

  async loadAll(): Promise<void> {
    if (!this.eventBus) {
      throw new Error("PluginManager: no EventBus set");
    }
    for (const plugin of this.getAll()) {
      await this.load(plugin.definition.name);
    }
  }

  async load(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) throw new Error(`Plugin "${name}" not found`);
    if (!this.eventBus) throw new Error("PluginManager: no EventBus set");

    const context = this.buildContext(plugin);
    try {
      const result = plugin.onLoad(context);
      if (result instanceof Promise) await result;

      // Expose plugin API as an integration so automation scripts can use it
      const api = plugin.getApi?.();
      if (api && Object.keys(api).length > 0) {
        automationEngine.registerIntegration(plugin.definition.name, api);
      }
    } catch (err) {
      console.error(`[PluginManager] Error loading plugin "${name}":`, err);
      throw err;
    }
  }

  private buildContext(plugin: Plugin): any {
    const registerIntegration = (name: string, api: unknown) => {
      automationEngine.registerIntegration(name, api);
    };
    const getIntegration = (name: string) => {
      // integrations are held by the automation engine; we expose what's registered
      return undefined;
    };
    return {
      eventBus: this.eventBus,
      registerIntegration,
      getIntegration,
      log: (...args: unknown[]) => console.log(`[Plugin:${plugin.definition.name}]`, ...args),
    };
  }
}

export const pluginManager = new PluginManager();
