import { Services } from "../../services";
import { CharacterController } from "./characterController";

import express from "express";
export const createCharacterRouter = (services: Services) => {
  const router = express.Router();

  const controller = new CharacterController(services);

  router.get("/", controller.getAll);
  router.get("/new", controller.openNewCharacterSheet);
  router.get("/:name", controller.get);

  return router;
};
