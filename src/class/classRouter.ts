import { ClassController } from "./classController";

const express = require("express");
const router = express.Router();

router.get("/", ClassController.getAll);
router.get("/:name", ClassController.get);
router.get("/:name/add", ClassController.getAddFeatureForm);
router.post("/:name/add", ClassController.addClassFeature);
router.post("/:name/:feature/edit", ClassController.editClassFeature);
router.get("/:name/:feature/edit", ClassController.getEditFeatureForm);
router.get(
  "/:name/:subclass/:feature/edit",
  ClassController.getSubclassEditFeatureForm
);
router.post(
  "/:name/:subclass/:feature/edit",
  ClassController.editSubclassFeature
);
router.post("/:name/:subclass/add", ClassController.addSubclassFeature);
router.get("/:name/:subclass/add", ClassController.getAddSubclassFeatureForm);
router.get("/:name/:subclass", ClassController.getSubclass);

export default router;
