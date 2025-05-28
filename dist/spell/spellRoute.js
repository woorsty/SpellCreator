"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spellControler_1 = require("./spellControler");
const express = require("express");
const router = express.Router();
// GET /api/spell/
router.get("/", spellControler_1.SpellController.getAll);
router.get("/add", spellControler_1.SpellController.getAddForm);
router.post("/add", spellControler_1.SpellController.add);
router.post("/edit/:name", spellControler_1.SpellController.edit);
router.get("/edit/:name", spellControler_1.SpellController.getEditForm);
router.get("/check", spellControler_1.SpellController.checkSpellData);
router.get("/:name", spellControler_1.SpellController.getSpell);
exports.default = router;
