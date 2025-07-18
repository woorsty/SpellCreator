"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classController_1 = require("./classController");
const express = require("express");
const router = express.Router();
router.get("/", classController_1.ClassController.getAll);
router.get("/:name", classController_1.ClassController.get);
router.get("/:name/add", classController_1.ClassController.getAddFeatureForm);
router.post("/:name/add", classController_1.ClassController.addFeature);
router.post("/:name/:feature/edit", classController_1.ClassController.editFeature);
router.get("/:name/:feature/edit", classController_1.ClassController.getEditFeatureForm);
router.post("/:name/:subclass/:feature/edit", classController_1.ClassController.editSubclassFeature);
router.post("/:name/:subclass/add", classController_1.ClassController.addSubclassFeature);
router.get("/:name/:subclass/add", classController_1.ClassController.getAddSubclassFeatureForm);
exports.default = router;
//# sourceMappingURL=classRouter.js.map