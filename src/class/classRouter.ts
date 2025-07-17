import { ClassController } from "./classController";

const express = require("express");
const router = express.Router();

router.get("/", ClassController.getAll);
router.get("/:name", ClassController.get);
router.get("/add", ClassController.getAddForm);
router.post("/add", ClassController.add);
router.post("/:name/edit", ClassController.edit);
router.get("/:name/edit", ClassController.getEditForm);

export default router;
