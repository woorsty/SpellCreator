"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellController = void 0;
const util_1 = require("../util");
const spellChecker_1 = require("./spellChecker");
const path_1 = __importDefault(require("path"));
const spellModel_1 = require("./spellModel");
class SpellController {
    static async getAll(req, res) {
        const filterStufeVon = req.query.stufeVon;
        const filterStufeBis = req.query.stufeBis;
        const filterKlasse = req.query.klasse;
        const filterSchule = req.query.schule;
        const sortierung = req.query.sortierung;
        const spellData = await util_1.Util.readJsonFile(spellModel_1.JsonFilePath);
        let gefilterteZauber = [...spellData]; // Erstelle eine Kopie zum Filtern
        // Filterlogik für Stufe (Von-Bis Bereich)
        if (filterStufeVon && filterStufeVon !== "") {
            const von = parseInt(filterStufeVon, 10);
            if (filterStufeBis && filterStufeBis !== "") {
                const bis = parseInt(filterStufeBis, 10);
                gefilterteZauber = gefilterteZauber.filter((spell) => spell.Stufe >= von && spell.Stufe <= bis);
            }
            else {
                gefilterteZauber = gefilterteZauber.filter((spell) => spell.Stufe === von);
            }
        }
        else if (filterStufeBis && filterStufeBis !== "") {
            const bis = parseInt(filterStufeBis, 10);
            gefilterteZauber = gefilterteZauber.filter((spell) => spell.Stufe <= bis);
        }
        if (filterSchule) {
            gefilterteZauber = gefilterteZauber.filter((spell) => spell.Schule === filterSchule);
        }
        if (filterKlasse) {
            gefilterteZauber = gefilterteZauber.filter((spell) => spell.Klasse.includes(filterKlasse));
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
            renderMarkdown: util_1.Util.renderMarkdown,
        });
    }
    static async getSpell(req, res) {
        const spellName = req.params.name;
        const spell = await SpellController.getSpellByName(spellName);
        if (spell) {
            res.render("spells", {
                spells: [spell],
                renderMarkdown: util_1.Util.renderMarkdown,
            });
        }
        else {
            res.status(404).send("Zauber nicht gefunden");
        }
    }
    static async getSpellByName(name) {
        const spellData = await util_1.Util.readJsonFile(spellModel_1.JsonFilePath);
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
    static async add(req, res) {
        const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;
        const newSpell = {
            ...rest,
            Klasse: Klasse.split(",").map((k) => k.trim()),
            Konzentration: Konzentration === "on",
            Ritual: Ritual === "on",
            Verbal: Verbal === "on",
            Gestik: Gestik === "on",
        };
        const spellData = await util_1.Util.readJsonFile(spellModel_1.JsonFilePath);
        spellData.push(newSpell);
        await util_1.Util.writeJsonFile(spellData, spellModel_1.JsonFilePath);
        res.statusCode = 303;
        res.setHeader("Location", "/add");
        res.end();
    }
    static async edit(req, res) {
        const spellName = req.params.name;
        const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;
        const updatedSpell = {
            ...rest,
            Name: spellName, // Behalte den Namen bei (könnte aber auch geändert werden)
            Klasse: Klasse.split(",").map((k) => k.trim()),
            Konzentration: req.body.Konzentration === "on",
            Ritual: req.body.Ritual === "on",
            Verbal: req.body.Verbal === "on",
            Gestik: req.body.Gestik === "on",
        };
        const spellData = await util_1.Util.readJsonFile(spellModel_1.JsonFilePath);
        const index = spellData.findIndex((spell) => spell.Name === spellName);
        if (index !== -1) {
            spellData[index] = updatedSpell;
            await util_1.Util.writeJsonFile(spellData, spellModel_1.JsonFilePath);
            res.redirect("/spell"); // Zurück zur Zauberliste
        }
        else {
            res.status(404).send("Zauber nicht gefunden");
        }
    }
    static async getEditForm(req, res) {
        const spellName = req.params.name;
        const spellData = await util_1.Util.readJsonFile(spellModel_1.JsonFilePath);
        const spellToEdit = spellData.find((spell) => spell.Name === spellName);
        if (spellToEdit) {
            res.render("edit-spell", { spell: spellToEdit });
        }
        else {
            res.status(404).send("Zauber nicht gefunden");
        }
    }
    static async getAddForm(req, res) {
        res.sendFile(path_1.default.join(__dirname, "../../public/add-spell.html"));
    }
    static async checkSpellData(req, res) {
        const errors = await spellChecker_1.SpellChecker.checkSpellData();
        if (errors.length > 0) {
            res.status(400).json({
                message: "Es wurden Fehler in den Zauberdaten gefunden:",
                errors,
            });
        }
        else {
            res
                .status(200)
                .json({ message: "Alle Zauberdaten scheinen korrekt zu sein." });
        }
    }
}
exports.SpellController = SpellController;
