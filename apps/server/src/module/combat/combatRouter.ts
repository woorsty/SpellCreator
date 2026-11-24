import { Router } from "express";
import { combatService, CombatService } from "./combatService";
import { CombatController } from "./combatController";

export const createCombatRouter = () => {
  const router: Router = Router();
  const controller = new CombatController(combatService);

  // Combat CRUD
  router.get("/", controller.listCombats);
  router.post("/", controller.createCombat);
  router.get("/:id", controller.getCombat);
  router.delete("/:id", controller.deleteCombat);

  // Combat lifecycle
  router.post("/:id/start", controller.startCombat);
  router.post("/:id/pause", controller.pauseCombat);
  router.post("/:id/resume", controller.resumeCombat);
  router.post("/:id/end", controller.endCombat);

  // Turn management
  router.post("/:id/next", controller.nextTurn);
  router.post("/:id/previous", controller.previousTurn);
  router.post("/:id/skip", controller.skipTurn);

  // Combatants
  router.post("/:id/combatants", controller.addCombatant);
  router.delete("/:id/combatants/:combatantId", controller.removeCombatant);
  router.patch("/:id/combatants/:combatantId", controller.updateCombatant);
  router.post("/:id/combatants/:combatantId/hp", controller.changeHp);
  router.post("/:id/combatants/:combatantId/temphp", controller.setTempHp);
  router.post("/:id/combatants/:combatantId/initiative", controller.setInitiative);

  // Conditions
  router.post("/:id/combatants/:combatantId/conditions", controller.applyCondition);
  router.delete("/:id/combatants/:combatantId/conditions/:conditionId", controller.removeCondition);

  // Encounters
  router.get("/encounters", controller.listEncounters);
  router.post("/encounters", controller.saveEncounter);
  router.get("/encounters/:id", controller.loadEncounter);
  router.post("/encounters/:id/load", controller.loadEncounterIntoCombat);

  return router;
};

export { CombatService };
