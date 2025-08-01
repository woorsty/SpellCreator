import express, { Request, Response } from "express";
const router = express.Router();
import fs from "fs";
import { generateCardPDF } from "./spellcardPdfGenerator";
import { Spell } from "../spell/spellModel";

router.get("/", (req, res) => res.render("spellcardFilter"));
router.get("/cards", (req: Request, res: Response) => {
  const { klasse, stufeVon, stufeBis, sortiertNach } = req.query;
  const spells = JSON.parse(
    fs.readFileSync("./assets/spells.json", "utf8")
  ) as Spell[];

  const von = parseInt(stufeVon as string, 10);
  const bis = parseInt(stufeBis as string, 10);

  const filtered = spells.filter((spell) => {
    const stufe = spell.Stufe;
    const matchStufe =
      !isNaN(von) && !isNaN(bis) && stufe >= von && stufe <= bis;
    const matchKlasse = !klasse || spell.Klasse.includes(klasse as string);
    return matchStufe && matchKlasse;
  });

  let sorted = filtered;
  if (sortiertNach === "name") {
    sorted = filtered.sort((a, b) => a.Name.localeCompare(b.Name));
  }
  if (sortiertNach === "stufe") {
    sorted = filtered.sort((a, b) => a.Stufe - b.Stufe);
  }

  const jsPdf = generateCardPDF(sorted);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=spellcards.pdf");
  const buffer = jsPdf.output("arraybuffer");
  res.send(Buffer.from(buffer));
});

export default router;
