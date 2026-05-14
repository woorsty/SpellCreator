import { Services } from "../../services";
import { CharacterController } from "./characterController";
import { Router } from "express";

export const createCharacterRouter = (services: Services) => {
  const router: Router = Router();

  const controller = new CharacterController(services);

  router.get("/", controller.getAll);
  router.get("/new", controller.openNewCharacterSheet);
  router.get("/:name", controller.get);

  return router;
};
