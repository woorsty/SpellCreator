import type { Request, Response } from "express";
import { Router } from "express";
const router: Router = Router();
import fs from "fs";
import {
  generateCardPDF,
  generateCardPDFWithBackside,
  ICON_PATH,
} from "./spellcardPdfGenerator";
import { CharacterClassId } from "@repo/domain";
import { SPELLS_PATH } from "../api/apiRouter";
import { RawSpell } from "../api/germanSpellsJsonToSpellsMapper";

const createSpellcard = (req: Request, res: Response) => {
  const { klasse, stufeVon, stufeBis, sortiertNach } = req.query;
  const spells = JSON.parse(fs.readFileSync(SPELLS_PATH, "utf8")) as RawSpell[];

  const von = parseInt(stufeVon as string, 10);
  const bis = parseInt(stufeBis as string, 10);

  const filtered = spells.filter((spell) => {
    const stufe = spell.Stufe;
    const matchStufe =
      !isNaN(von) && !isNaN(bis) && stufe >= von && stufe <= bis;
    const matchKlasse =
      !klasse || spell.Klasse.includes(klasse as CharacterClassId);
    return matchStufe && matchKlasse;
  });

  let sorted = filtered;
  if (sortiertNach === "name") {
    sorted = filtered.sort((a, b) => a.Name.localeCompare(b.Name));
  }
  if (sortiertNach === "stufe") {
    sorted = filtered.sort((a, b) => a.Stufe - b.Stufe);
  }

  let jsPdf;
  if (req.query.withBackimage) {
    const backImage = fs.readFileSync(
      ICON_PATH + "/classes/" + klasse + "_Icon.png",
    );
    jsPdf = generateCardPDFWithBackside(sorted, backImage);
  } else {
    jsPdf = generateCardPDF(sorted);
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + klasse + "_" + stufeVon + "-" + stufeBis + ".pdf",
  );
  const buffer = jsPdf.output("arraybuffer");
  res.send(Buffer.from(buffer));
};

router.get("/", (req, res) => res.render("spellcardFilter"));
router.get("/cards", createSpellcard);

export default router;
