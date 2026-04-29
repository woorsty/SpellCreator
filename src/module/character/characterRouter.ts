import { CharacterController } from "./characterController";

const express = require("express");
const router = express.Router();

router.get("/", CharacterController.getAll);
router.get("/new", CharacterController.openNewCharacterSheet);
router.get("/detail/:name", CharacterController.get);

export default router;
