import type { Request, Response } from "express";
import { automationEngine } from "./AutomationEngine";
import type { Automation } from "@repo/domain";

export class AutomationController {
  list = async (req: Request, res: Response) => {
    res.json(automationEngine.getAutomations());
  };

  get = async (req: Request, res: Response) => {
    const a = automationEngine.getAutomation(req.params.id as string);
    if (!a) {
      res.status(404).json({ error: "Automation not found" });
      return;
    }
    res.json(a);
  };

  create = async (req: Request, res: Response) => {
    try {
      const a = await automationEngine.createAutomation(
        req.body as Omit<Automation, "id" | "createdAt" | "updatedAt" | "lastRun" | "lastStatus" | "lastError">,
      );
      res.status(201).json(a);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const a = await automationEngine.updateAutomation(req.params.id as string, req.body as Partial<Automation>);
      if (!a) {
        res.status(404).json({ error: "Automation not found" });
        return;
      }
      res.json(a);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  delete = async (req: Request, res: Response) => {
    const ok = await automationEngine.deleteAutomation(req.params.id as string);
    if (!ok) {
      res.status(404).json({ error: "Automation not found" });
      return;
    }
    res.status(204).send();
  };

  setEnabled = async (req: Request, res: Response) => {
    const { enabled } = req.body as { enabled?: boolean };
    if (typeof enabled !== "boolean") {
      res.status(400).json({ error: "enabled is required" });
      return;
    }
    try {
      const a = await automationEngine.setEnabled(req.params.id as string, enabled);
      if (!a) {
        res.status(404).json({ error: "Automation not found" });
        return;
      }
      res.json(a);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  history = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
    const history = automationEngine.getExecutionHistory(id).slice(0, limit);
    res.json(history);
  };
}
