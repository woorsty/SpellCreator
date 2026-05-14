import { DataController } from "./dataControler";
import { Router } from "express";
const router: Router = Router();

router.get("/monster", DataController.getMonsters);

export default router;
