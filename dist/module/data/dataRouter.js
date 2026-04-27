"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataControler_1 = require("./dataControler");
const router = express_1.default.Router();
router.get("/monster", dataControler_1.DataController.getMonsters);
exports.default = router;
//# sourceMappingURL=dataRouter.js.map