import type { Request, Response } from "express";
import { pluginManager } from "./PluginManager";

export class PluginController {
  list = async (_req: Request, res: Response) => {
    res.json(pluginManager.getDefinitions());
  };

  get = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const p = pluginManager.get(id);
    if (!p) {
      res.status(404).json({ error: "Plugin not found" });
      return;
    }
    res.json({ definition: p.definition, config: p.config });
  };

  load = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      await pluginManager.load(id);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  unload = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const ok = pluginManager.unregister(id);
    if (!ok) {
      res.status(404).json({ error: "Plugin not found" });
      return;
    }
    res.json({ ok: true });
  };

  setConfig = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const p = pluginManager.get(id);
    if (!p) {
      res.status(404).json({ error: "Plugin not found" });
      return;
    }
    try {
      p.setConfig?.(req.body);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}
