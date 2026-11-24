import type { Request, Response } from "express";
import { CombatService } from "./combatService";
import type { Combatant, Condition, Encounter } from "@repo/domain";

function isCombatant(value: unknown): value is Omit<Combatant, "turnOrder"> {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return typeof o.name === "string" && o.name.length > 0;
}

function isCondition(value: unknown): value is Condition {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.name === "string";
}

export class CombatController {
  constructor(private combatService: CombatService) {}

  listCombats = async (req: Request, res: Response) => {
    const combats = await this.combatService.listCombats();
    res.json(combats);
  };

  createCombat = async (req: Request, res: Response) => {
    const { name } = req.body as { name?: string };
    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const combat = await this.combatService.createCombat(name);
    res.status(201).json(combat);
  };

  getCombat = async (req: Request, res: Response) => {
    const combat = await this.combatService.getCombat(req.params.id as string);
    if (!combat) {
      res.status(404).json({ error: "Combat not found" });
      return;
    }
    res.json(combat);
  };

  deleteCombat = async (req: Request, res: Response) => {
    const ok = await this.combatService.deleteCombat(req.params.id as string);
    if (!ok) {
      res.status(404).json({ error: "Combat not found" });
      return;
    }
    res.status(204).send();
  };

  startCombat = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.startCombat(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  pauseCombat = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.pauseCombat(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  resumeCombat = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.resumeCombat(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  endCombat = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.endCombat(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  nextTurn = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.nextTurn(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  previousTurn = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.previousTurn(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  skipTurn = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.skipTurn(req.params.id as string);
      res.json(combat);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  addCombatant = async (req: Request, res: Response) => {
    if (!isCombatant(req.body)) {
      res.status(400).json({ error: "Invalid combatant data" });
      return;
    }
    try {
      const combatant = req.body as Omit<Combatant, "turnOrder">;
      const combat = await this.combatService.addCombatant(req.params.id as string, combatant);
      res.status(201).json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  removeCombatant = async (req: Request, res: Response) => {
    try {
      await this.combatService.removeCombatant(req.params.id as string, req.params.combatantId as string);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  updateCombatant = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.updateCombatant(
        req.params.id as string,
        req.params.combatantId as string,
        req.body as Partial<Omit<Combatant, "id" | "turnOrder">>,
      );
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  changeHp = async (req: Request, res: Response) => {
    const { change, source } = req.body as { change?: number; source?: string };
    if (typeof change !== "number") {
      res.status(400).json({ error: "change is required" });
      return;
    }
    try {
      const combat = await this.combatService.changeHp(
        req.params.id as string,
        req.params.combatantId as string,
        change,
        source,
      );
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  setTempHp = async (req: Request, res: Response) => {
    const { tempHp } = req.body as { tempHp?: number };
    if (typeof tempHp !== "number") {
      res.status(400).json({ error: "tempHp is required" });
      return;
    }
    try {
      const combat = await this.combatService.setTempHp(
        req.params.id as string,
        req.params.combatantId as string,
        tempHp,
      );
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  setInitiative = async (req: Request, res: Response) => {
    const { initiative } = req.body as { initiative?: number };
    if (typeof initiative !== "number") {
      res.status(400).json({ error: "initiative is required" });
      return;
    }
    try {
      const combat = await this.combatService.setInitiative(
        req.params.id as string,
        req.params.combatantId as string,
        initiative,
      );
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  applyCondition = async (req: Request, res: Response) => {
    if (!isCondition(req.body)) {
      res.status(400).json({ error: "Invalid condition data" });
      return;
    }
    try {
      const combat = await this.combatService.applyCondition(
        req.params.id as string,
        req.params.combatantId as string,
        req.body as Condition,
      );
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  removeCondition = async (req: Request, res: Response) => {
    try {
      const combat = await this.combatService.removeCondition(
        req.params.id as string,
        req.params.combatantId as string,
        req.params.conditionId as string,
      );
      res.json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  listEncounters = async (req: Request, res: Response) => {
    const encounters = await this.combatService.listEncounters();
    res.json(encounters);
  };

  saveEncounter = async (req: Request, res: Response) => {
    try {
      const encounter = await this.combatService.saveEncounter(req.body as Encounter);
      res.status(201).json(encounter);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  loadEncounter = async (req: Request, res: Response) => {
    try {
      const encounter = await this.combatService.loadEncounter(req.params.id as string);
      if (!encounter) {
        res.status(404).json({ error: "Encounter not found" });
        return;
      }
      res.json(encounter);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  loadEncounterIntoCombat = async (req: Request, res: Response) => {
    try {
      const { name } = req.body as { name?: string };
      const combat = await this.combatService.loadEncounterIntoCombat(req.params.id as string, name);
      res.status(201).json(combat);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  };
}
