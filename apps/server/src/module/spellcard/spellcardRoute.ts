import type { Request, Response } from "express";
import { Router } from "express";
const router: Router = Router();
import fs from "fs";
import {
  generateCardPDF,
  generateCardPDFWithBackside,
} from "./spellcardPdfGenerator";
import { CharacterClassId, Spell } from "@repo/domain";
import { SPELLS_PATH } from "../api/apiRouter";

const createSpellcard = (req: Request, res: Response) => {
  const { klasse, stufeVon, stufeBis, sortiertNach } = req.query;
  const spells = JSON.parse(fs.readFileSync(SPELLS_PATH, "utf8")) as Spell[];

  const von = parseInt(stufeVon as string, 10);
  const bis = parseInt(stufeBis as string, 10);

  const filtered = spells.filter((spell) => {
    const stufe = spell.level;
    const matchStufe =
      !isNaN(von) && !isNaN(bis) && stufe >= von && stufe <= bis;
    const matchKlasse =
      !klasse || spell.characterClasses.includes(klasse as CharacterClassId);
    return matchStufe && matchKlasse;
  });

  let sorted = filtered;
  if (sortiertNach === "name") {
    sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortiertNach === "stufe") {
    sorted = filtered.sort((a, b) => a.level - b.level);
  }

  let jsPdf;
  if (req.query.withBackimage) {
    const backImage = fs.readFileSync(
      "src/assets/icons/classes/" + klasse + "_Icon.png",
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
