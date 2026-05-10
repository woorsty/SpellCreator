import type { Request, Response } from "express";
import { SpellChecker } from "./spellChecker";
import { Spell } from "@domain";
import { JsonService } from "@domain";
import { MarkdownService } from "@domain";
import { SPELLS_PATH } from "../api/apiRouter";

export class SpellController {
  static async getAll(req: Request, res: Response) {
    const filterStufeVon = req.query.stufeVon as string | undefined;
    const filterStufeBis = req.query.stufeBis as string | undefined;
    const filterKlasse = req.query.klasse as string | undefined;
    const filterSchule = req.query.schule as string | undefined;
    const sortierung = req.query.sortierung as string | undefined;

    const spellData = await JsonService.readJsonFile<Spell>(SPELLS_PATH);
    let gefilterteZauber = [...spellData]; // Erstelle eine Kopie zum Filtern

    // Filterlogik für Stufe (Von-Bis Bereich)
    if (filterStufeVon && filterStufeVon !== "") {
      const von = parseInt(filterStufeVon, 10);
      if (filterStufeBis && filterStufeBis !== "") {
        const bis = parseInt(filterStufeBis, 10);
        gefilterteZauber = gefilterteZauber.filter(
          (spell) => spell.level >= von && spell.level <= bis,
        );
      } else {
        gefilterteZauber = gefilterteZauber.filter(
          (spell) => spell.level === von,
        );
      }
    } else if (filterStufeBis && filterStufeBis !== "") {
      const bis = parseInt(filterStufeBis, 10);
      gefilterteZauber = gefilterteZauber.filter((spell) => spell.level <= bis);
    }

    if (filterSchule) {
      gefilterteZauber = gefilterteZauber.filter(
        (spell) => spell.school === filterSchule,
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
          gefilterteZauber.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_desc":
          gefilterteZauber.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "stufe_asc":
          gefilterteZauber.sort((a, b) => a.level - b.level);
          break;
        case "stufe_desc":
          gefilterteZauber.sort((a, b) => b.level - a.level);
          break;
        case "schule_asc":
          gefilterteZauber.sort((a, b) => a.school.localeCompare(b.school));
          break;
        case "schule_desc":
          gefilterteZauber.sort((a, b) => b.school.localeCompare(a.school));
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

  static async getSpellByName(name: string): Promise<Spell | undefined> {
    const spellData = await JsonService.readJsonFile<Spell>(SPELLS_PATH);
    const spell = spellData.find((s) => s.name === name);

    if (!spell && name) {
      return {
        name: '"' + name + '" nicht gefunden',
        level: 0,
        school: "",
        Zeitaufwand: "",
        Reichweite: "",
        Dauer: "",
        Klasse: [],
        Text: "",
      };
    }

    return spell;
  }

  static async add(req: Request, res: Response) {
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } =
      req.body as any;

    const newSpell: Spell = {
      ...rest,
      Klasse: Klasse.split(",").map((k: string) => k.trim()),
      Konzentration: Konzentration === "on",
      Ritual: Ritual === "on",
      Verbal: Verbal === "on",
      Gestik: Gestik === "on",
    };

    const spellData = await JsonService.readJsonFile<Spell>(SPELLS_PATH);
    spellData.push(newSpell);
    await JsonService.writeJsonFile(spellData, SPELLS_PATH);
    res.statusCode = 303;
    res.setHeader("Location", "/spell/add");
    res.end();
  }

  static async edit(req: Request, res: Response) {
    const spellName = req.params.name as string;
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;

    const updatedSpell: Spell = {
      ...rest,
      name: spellName, // Behalte den Namen bei (könnte aber auch geändert werden)
      Klasse: Klasse.split(",").map((k: string) => k.trim()),
      Konzentration: req.body.Konzentration === "on",
      Ritual: req.body.Ritual === "on",
      Verbal: req.body.Verbal === "on",
      Gestik: req.body.Gestik === "on",
    };

    const spellData = await JsonService.readJsonFile<Spell>(SPELLS_PATH);
    const index = spellData.findIndex((spell) => spell.name === spellName);

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
    const spellData = await JsonService.readJsonFile<Spell>(SPELLS_PATH);
    const spellToEdit = spellData.find((spell) => spell.name === spellName);

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
