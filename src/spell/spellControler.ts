import { Util as Util } from "../util";
import { Request, Response } from "express";
import { SpellChecker } from "./spellChecker";
import path from "path";
import { JsonFilePath, Spell } from "./spellModel";
import { render } from "ejs";

export class SpellController {
  static async getAll(req: Request, res: Response) {
    const filterStufeVon = req.query.stufeVon as string | undefined;
    const filterStufeBis = req.query.stufeBis as string | undefined;
    const filterKlasse = req.query.klasse as string | undefined;
    const filterSchule = req.query.schule as string | undefined;
    const sortierung = req.query.sortierung as string | undefined;

    const spellData = await Util.readJsonFile<Spell>(JsonFilePath);
    let gefilterteZauber = [...spellData]; // Erstelle eine Kopie zum Filtern

    // Filterlogik für Stufe (Von-Bis Bereich)
    if (filterStufeVon && filterStufeVon !== "") {
      const von = parseInt(filterStufeVon, 10);
      if (filterStufeBis && filterStufeBis !== "") {
        const bis = parseInt(filterStufeBis, 10);
        gefilterteZauber = gefilterteZauber.filter(
          (spell) => spell.Stufe >= von && spell.Stufe <= bis
        );
      } else {
        gefilterteZauber = gefilterteZauber.filter(
          (spell) => spell.Stufe === von
        );
      }
    } else if (filterStufeBis && filterStufeBis !== "") {
      const bis = parseInt(filterStufeBis, 10);
      gefilterteZauber = gefilterteZauber.filter((spell) => spell.Stufe <= bis);
    }

    if (filterSchule) {
      gefilterteZauber = gefilterteZauber.filter(
        (spell) => spell.Schule === filterSchule
      );
    }
    if (filterKlasse) {
      gefilterteZauber = gefilterteZauber.filter((spell) =>
        spell.Klasse.includes(filterKlasse)
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
      renderMarkdown: Util.renderMarkdown,
    });
  }

  static async getSpell(req: Request, res: Response) {
    const spellName = req.params.name;
    const spell = await SpellController.getSpellByName(spellName);

    if (spell) {
      res.render("spells", {
        spells: [spell],
        renderMarkdown: Util.renderMarkdown,
      });
    } else {
      res.status(404).send("Zauber nicht gefunden");
    }
  }

  static async getSpellByName(name: string): Promise<Spell | undefined> {
    const spellData = await Util.readJsonFile<Spell>(JsonFilePath);
    const spell = spellData.find((s) => s.Name === name);

    if (!spell && name) {
      return {
        Name: '"' + name + '" nicht gefunden',
        Stufe: 0,
        Schule: "",
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

    const spellData = await Util.readJsonFile<Spell>(JsonFilePath);
    spellData.push(newSpell);
    await Util.writeJsonFile(spellData, JsonFilePath);
    res.statusCode = 303;
    res.setHeader("Location", "/spell/add");
    res.end();
  }

  static async edit(req: Request, res: Response) {
    const spellName = req.params.name;
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;

    const updatedSpell: Spell = {
      ...rest,
      Name: spellName, // Behalte den Namen bei (könnte aber auch geändert werden)
      Klasse: Klasse.split(",").map((k: string) => k.trim()),
      Konzentration: req.body.Konzentration === "on",
      Ritual: req.body.Ritual === "on",
      Verbal: req.body.Verbal === "on",
      Gestik: req.body.Gestik === "on",
    };

    const spellData = await Util.readJsonFile<Spell>(JsonFilePath);
    const index = spellData.findIndex((spell) => spell.Name === spellName);

    if (index !== -1) {
      spellData[index] = updatedSpell;
      await Util.writeJsonFile(spellData, JsonFilePath);
      res.redirect("/spell"); // Zurück zur Zauberliste
    } else {
      res.status(404).send("Zauber nicht gefunden");
    }
  }

  static async getEditForm(req: Request, res: Response) {
    const spellName = req.params.name;
    const spellData = await Util.readJsonFile<Spell>(JsonFilePath);
    const spellToEdit = spellData.find((spell) => spell.Name === spellName);

    if (spellToEdit) {
      res.render("edit-spell", { spell: spellToEdit });
    } else {
      res.status(404).send("Zauber nicht gefunden");
    }
  }

  static async getAddForm(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, "../../public/add-spell.html"));
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
