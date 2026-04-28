import { CharacterController } from "./characterController";

const express = require("express");
const router = express.Router();

router.get("/", CharacterController.getAll);
router.get("/:name", CharacterController.get);

export default router;
