import { Router } from "express";
import { PluginController } from "./pluginController";

export const createPluginRouter = () => {
  const router: Router = Router();
  const controller = new PluginController();

  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/:id/load", controller.load);
  router.post("/:id/unload", controller.unload);
  router.post("/:id/config", controller.setConfig);

  return router;
};
