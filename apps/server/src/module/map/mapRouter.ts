import { Router } from "express";
import { MapController } from "./mapController";

const router: Router = Router();

router.get("/point", (req, res) => MapController.get(req, res, "point"));
router.get("/line", (req, res) => MapController.get(req, res, "line"));
router.get("/polygon", (req, res) => MapController.get(req, res, "polygon"));

router.post("/point", (req, res) => MapController.add(req, res, "point"));
router.post("/line", (req, res) => MapController.add(req, res, "line"));
router.post("/polygon", (req, res) => MapController.add(req, res, "polygon"));

router.delete("/point/:id", (req, res) =>
  MapController.remove(req, res, "point"),
);
router.delete("/line/:id", (req, res) =>
  MapController.remove(req, res, "line"),
);
router.delete("/polygon/:id", (req, res) =>
  MapController.remove(req, res, "polygon"),
);

router.put("/point/:id", (req, res) => MapController.update(req, res, "point"));
router.put("/line/:id", (req, res) => MapController.update(req, res, "line"));
router.put("/polygon/:id", (req, res) =>
  MapController.update(req, res, "polygon"),
);

export default router;
