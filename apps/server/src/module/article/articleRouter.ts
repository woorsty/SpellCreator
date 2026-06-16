import { Router } from "express";
import { Services } from "../../services";
import { ArticleController } from "./articleController";

const router: Router = Router();

const controller = new ArticleController();
router.get("/", controller.getVaults);
router.get("/:vaultId/tree", controller.getVaultTree);
router.get("/:vaultId/*path", controller.getArticle);
router.get("/:vaultId/search", controller.search);

export default router;
