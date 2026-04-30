import { InvocationController } from "./invocationController";

import express from "express";
const router = express.Router();

router.get("/", InvocationController.getAll);
router.get("/add", InvocationController.getAddForm);
router.post("/add", InvocationController.add);
router.post("/edit/:name", InvocationController.edit);
router.get("/edit/:name", InvocationController.getEditForm);

export default router;
