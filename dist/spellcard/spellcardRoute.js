"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const fs_1 = __importDefault(require("fs"));
const spellcardPdfGenerator_1 = require("./spellcardPdfGenerator");
router.get("/", (req, res) => res.render("spellcardFilter"));
router.get("/cards", (req, res) => {
    const { klasse, stufeVon, stufeBis, sortiertNach } = req.query;
    const spells = JSON.parse(fs_1.default.readFileSync("./assets/spells.json", "utf8"));
    const von = parseInt(stufeVon, 10);
    const bis = parseInt(stufeBis, 10);
    const filtered = spells.filter((spell) => {
        const stufe = spell.Stufe;
        const matchStufe = !isNaN(von) && !isNaN(bis) && stufe >= von && stufe <= bis;
        const matchKlasse = !klasse || spell.Klasse.includes(klasse);
        return matchStufe && matchKlasse;
    });
    let sorted = filtered;
    if (sortiertNach === "name") {
        sorted = filtered.sort((a, b) => a.Name.localeCompare(b.Name));
    }
    if (sortiertNach === "stufe") {
        sorted = filtered.sort((a, b) => a.Stufe - b.Stufe);
    }
    const jsPdf = (0, spellcardPdfGenerator_1.generateCardPDF)(sorted);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=spellcards.pdf");
    const buffer = jsPdf.output("arraybuffer");
    res.send(Buffer.from(buffer));
});
exports.default = router;
//# sourceMappingURL=spellcardRoute.js.map