import { Router } from "express";
import { ArticleController } from "./articleController";

const router: Router = Router();

const controller = new ArticleController();
router.get("/", controller.getVaults);
router.get("/tree", controller.getFullTree);
router.get("/:vaultId/tree", controller.getVaultTree);
router.get("/*path", controller.getArticle);
router.get("/search", controller.search);
router.post("/", controller.write);
router.put("/", controller.write);

export default router;
