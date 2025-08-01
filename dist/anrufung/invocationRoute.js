"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invocationController_1 = require("./invocationController");
const express = require("express");
const router = express.Router();
router.get("/", invocationController_1.InvocationController.getAll);
router.get("/add", invocationController_1.InvocationController.getAddForm);
router.post("/add", invocationController_1.InvocationController.add);
router.post("/edit/:name", invocationController_1.InvocationController.edit);
router.get("/edit/:name", invocationController_1.InvocationController.getEditForm);
exports.default = router;
//# sourceMappingURL=invocationRoute.js.map