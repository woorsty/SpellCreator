import { ClassController } from "./classController";

const express = require("express");
const router = express.Router();

router.get("/", ClassController.getAll);
router.get("/:name", ClassController.get);
router.get("/:name/add", ClassController.getAddForm);
router.post("/:name/add", ClassController.add);
router.post("/:name/:feature/edit", ClassController.edit);
router.get("/:name/:feature/edit", ClassController.getEditForm);

export default router;
