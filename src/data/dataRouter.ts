import express, { Request, Response } from "express";
import { DataController } from "./dataControler";
const router = express.Router();

router.get("/monster", DataController.getMonsters);

export default router;
