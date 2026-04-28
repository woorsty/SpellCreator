"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const characterController_1 = require("./characterController");
const express = require("express");
const router = express.Router();
router.get("/", characterController_1.CharacterController.getAll);
router.get("/:name", characterController_1.CharacterController.get);
exports.default = router;
//# sourceMappingURL=characterRouter.js.map