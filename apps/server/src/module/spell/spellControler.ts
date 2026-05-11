import type { Request, Response } from "express";
import { SpellChecker } from "./spellChecker";
import { CharacterClassId } from "@domain";
import { JsonService } from "@domain";
import { MarkdownService } from "@domain";
import { SPELLS_PATH } from "../api/apiRouter";
import { RawSpell } from "../api/germanSpellsJsonToSpellsMapper";

export class SpellController {
  static async getAll(req: Request, res: Response) {
    const filterStufeVon = req.query.stufeVon as string | undefined;
    const filterStufeBis = req.query.stufeBis as string | undefined;
    const filterKlasse = req.query.klasse as CharacterClassId | undefined;
    const filterSchule = req.query.schule as string | undefined;
    const sortierung = req.query.sortierung as string | undefined;

    const spellData = await JsonService.readJsonFile<RawSpell>(SPELLS_PATH);
    let gefilterteZauber = [...spellData]; // Erstelle eine Kopie zum Filtern

    // Filterlogik für Stufe (Von-Bis Bereich)
    if (filterStufeVon && filterStufeVon !== "") {
      const von = parseInt(filterStufeVon, 10);
      if (filterStufeBis && filterStufeBis !== "") {
        const bis = parseInt(filterStufeBis, 10);
        gefilterteZauber = gefilterteZauber.filter(
          (spell) => spell.Stufe >= von && spell.Stufe <= bis,
        );
      } else {
        gefilterteZauber = gefilterteZauber.filter(
          (spell) => spell.Stufe === von,
        );
      }
    } else if (filterStufeBis && filterStufeBis !== "") {
      const bis = parseInt(filterStufeBis, 10);
      gefilterteZauber = gefilterteZauber.filter((spell) => spell.Stufe <= bis);
    }

    if (filterSchule) {
      gefilterteZauber = gefilterteZauber.filter(
        (spell) => spell.Schule === filterSchule,
      );
    }
    if (filterKlasse) {
      gefilterteZauber = gefilterteZauber.filter((spell) =>
        spell.Klasse.includes(filterKlasse),
      );
    }

    // Sortierlogik
    if (sortierung) {
      switch (sortierung) {
        case "name_asc":
          gefilterteZauber.sort((a, b) => a.Name.localeCompare(b.Name));
          break;
        case "name_desc":
          gefilterteZauber.sort((a, b) => b.Name.localeCompare(a.Name));
          break;
        case "stufe_asc":
          gefilterteZauber.sort((a, b) => a.Stufe - b.Stufe);
          break;
        case "stufe_desc":
          gefilterteZauber.sort((a, b) => b.Stufe - a.Stufe);
          break;
        case "schule_asc":
          gefilterteZauber.sort((a, b) => a.Schule.localeCompare(b.Schule));
          break;
        case "schule_desc":
          gefilterteZauber.sort((a, b) => b.Schule.localeCompare(a.Schule));
          break;
      }
    }

    res.render("spells", {
      spells: gefilterteZauber,
      filterStufeVon: filterStufeVon,
      filterStufeBis: filterStufeBis,
      filterKlasse: filterKlasse,
      filterSchule: filterSchule,
      sortierung: sortierung,
      renderMarkdown: MarkdownService.renderMarkdown,
    });
  }

  static async getSpell(req: Request, res: Response) {
    const spellName = req.params.name as string;
    const spell = await SpellController.getSpellByName(spellName);

    if (spell) {
      res.render("spells", {
        spells: [spell],
        renderMarkdown: MarkdownService.renderMarkdown,
      });
    } else {
      res.status(404).send("Zauber nicht gefunden");
    }
  }

  static async getSpellByName(name: string): Promise<RawSpell | undefined> {
    const spellData = await JsonService.readJsonFile<RawSpell>(SPELLS_PATH);
    const spell = spellData.find((s) => s.Name === name);

    if (!spell && name) {
      console.error("Spell", name, "not found");
      return undefined;
    }

    return spell;
  }

  static async add(req: Request, res: Response) {
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } =
      req.body as any;

    const newSpell: RawSpell = {
      ...rest,
      Klasse: Klasse.split(",").map((k: string) => k.trim()),
      Konzentration: Konzentration === "on",
      Ritual: Ritual === "on",
      Verbal: Verbal === "on",
      Gestik: Gestik === "on",
    };

    const spellData = await JsonService.readJsonFile<RawSpell>(SPELLS_PATH);
    spellData.push(newSpell);
    await JsonService.writeJsonFile(spellData, SPELLS_PATH);
    res.statusCode = 303;
    res.setHeader("Location", "/spell/add");
    res.end();
  }

  static async edit(req: Request, res: Response) {
    const spellName = req.params.name as string;
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;

    const updatedSpell: RawSpell = {
      ...rest,
      name: spellName, // Behalte den Namen bei (könnte aber auch geändert werden)
      Klasse: Klasse.split(",").map((k: string) => k.trim()),
      Konzentration: req.body.Konzentration === "on",
      Ritual: req.body.Ritual === "on",
      Verbal: req.body.Verbal === "on",
      Gestik: req.body.Gestik === "on",
    };

    const spellData = await JsonService.readJsonFile<RawSpell>(SPELLS_PATH);
    const index = spellData.findIndex((spell) => spell.Name === spellName);

    if (index !== -1) {
      spellData[index] = updatedSpell;
      await JsonService.writeJsonFile(spellData, SPELLS_PATH);
      res.redirect("/spell"); // Zurück zur Zauberliste
    } else {
      res.status(404).send("Zauber nicht gefunden");
    }
  }

  static async getEditForm(req: Request, res: Response) {
    const spellName = req.params.name as string;
    const spellData = await JsonService.readJsonFile<RawSpell>(SPELLS_PATH);
    const spellToEdit = spellData.find((spell) => spell.Name === spellName);

    if (spellToEdit) {
      res.render("edit-spell", { spell: spellToEdit });
    } else {
      res.status(404).send("Zauber nicht gefunden");
    }
  }

  static async getAddForm(req: Request, res: Response) {
    res.render("add-spell.ejs");
  }

  static async checkSpellData(req: Request, res: Response) {
    const errors = await SpellChecker.checkSpellData();
    if (errors.length > 0) {
      res.status(400).json({
        message: "Es wurden Fehler in den Zauberdaten gefunden:",
        errors,
      });
    } else {
      res
        .status(200)
        .json({ message: "Alle Zauberdaten scheinen korrekt zu sein." });
    }
  }
}
