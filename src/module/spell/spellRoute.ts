import { SpellController } from "./spellControler";
const express = require("express");
const router = express.Router();

// GET /api/spell/

router.get("/", SpellController.getAll);
router.get("/add", SpellController.getAddForm);
router.post("/add", SpellController.add);
router.post("/edit/:name", SpellController.edit);
router.get("/edit/:name", SpellController.getEditForm);
router.get("/check", SpellController.checkSpellData);
router.get("/:name", SpellController.getSpell);

export default router;
