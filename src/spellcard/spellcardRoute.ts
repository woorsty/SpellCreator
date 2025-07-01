import express, { Request, Response } from "express";
const router = express.Router();
import fs from "fs";
import { generateCardPDF } from "./spellcardPdfGenerator";

router.get("/", (req, res) => res.render("spellcardFilter"));
router.get("/cards", (req: Request, res: Response) => {
  const { klasse, stufeVon, stufeBis } = req.query;
  const spells = JSON.parse(fs.readFileSync("./spells.json", "utf8"));

  const von = parseInt(stufeVon as string, 10);
  const bis = parseInt(stufeBis as string, 10);

  const filtered = spells.filter(
    (spell: { Stufe: string; Klasse: string | string[] }) => {
      const stufe = parseInt(spell.Stufe, 10);
      const matchStufe =
        !isNaN(von) && !isNaN(bis) && stufe >= von && stufe <= bis;
      const matchKlasse = !klasse || spell.Klasse.includes(klasse as string);
      return matchStufe && matchKlasse;
    }
  );

  const jsPdf = generateCardPDF(filtered);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=spellcards.pdf");
  const buffer = jsPdf.output("arraybuffer");
  res.send(Buffer.from(buffer));
});

export default router;
