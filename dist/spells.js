"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellServer = void 0;
const util_1 = require("./util");
const path_1 = __importDefault(require("path"));
class SpellServer {
    static async getAll(req, res) {
        const filterStufeVon = req.query.stufeVon;
        const filterStufeBis = req.query.stufeBis;
        const filterKlasse = req.query.klasse;
        const filterSchule = req.query.schule;
        const sortierung = req.query.sortierung;
        const spellData = await util_1.Util.readJsonFile(this.jsonFilePath);
        let gefilterteZauber = [...spellData.spells]; // Erstelle eine Kopie zum Filtern
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
        const spellData = await util_1.Util.readJsonFile(this.jsonFilePath);
        spellData.spells.push(newSpell);
        await util_1.Util.writeJsonFile(spellData, this.jsonFilePath);
        res.statusCode = 303;
        res.setHeader("Location", "/add");
        res.end();
    }
}
exports.SpellServer = SpellServer;
SpellServer.jsonFilePath = path_1.default.join(__dirname, "../spells.json");
