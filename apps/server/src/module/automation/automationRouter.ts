import { Router } from "express";
import { AutomationController } from "./automationController";

export const createAutomationRouter = () => {
  const router: Router = Router();
  const controller = new AutomationController();

  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);
  router.post("/:id/enabled", controller.setEnabled);
  router.get("/:id/history", controller.history);

  return router;
};
