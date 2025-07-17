"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classController_1 = require("./classController");
const express = require("express");
const router = express.Router();
router.get("/", classController_1.ClassController.getAll);
router.get("/:name", classController_1.ClassController.get);
router.get("/:name/add", classController_1.ClassController.getAddForm);
router.post("/:name/add", classController_1.ClassController.add);
router.post("/:name/:feature/edit", classController_1.ClassController.edit);
router.get("/:name/:feature/edit", classController_1.ClassController.getEditForm);
exports.default = router;
//# sourceMappingURL=classRouter.js.map