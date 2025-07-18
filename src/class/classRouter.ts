import { ClassController } from "./classController";

const express = require("express");
const router = express.Router();

router.get("/", ClassController.getAll);
router.get("/:name", ClassController.get);
router.get("/:name/add", ClassController.getAddFeatureForm);
router.post("/:name/add", ClassController.addFeature);
router.post("/:name/:feature/edit", ClassController.editFeature);
router.get("/:name/:feature/edit", ClassController.getEditFeatureForm);
router.post(
  "/:name/:subclass/:feature/edit",
  ClassController.editSubclassFeature
);
router.post("/:name/:subclass/add", ClassController.addSubclassFeature);
router.get("/:name/:subclass/add", ClassController.getAddSubclassFeatureForm);

export default router;
