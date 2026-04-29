"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spell = void 0;
const path_1 = __importDefault(require("path"));
const modelData_1 = require("../util/modelData");
class Spell extends modelData_1.Model {
    constructor(stufe, name, schule, zeitaufwand, reichweite, dauer, text, klasse, konzentration, ritual, verbal, gestik, material, notizen, init) {
        super();
        this.Stufe = stufe;
        this.Name = name;
        this.Schule = schule;
        this.Zeitaufwand = zeitaufwand;
        this.Reichweite = reichweite;
        this.Dauer = dauer;
        this.Text = text;
        this.Klasse = klasse;
        this.Konzentration = konzentration;
        this.Ritual = ritual;
        this.Verbale = verbal;
        this.Gestik = gestik;
        this.Materialien = material;
        this.Notizen = notizen;
        Object.assign(this, init);
    }
    static getTestSpell() {
        return new Spell(1, "Testzauber", "Evokation", "1 Aktion", "60 Fuß", "1 Minute", "Dies ist ein Testzauber, um die Anzeige zu überprüfen.", ["Zauberer"], false, true, false, true, "a feather, a small piece of fleece, and a drop of honey", "Durch Talent");
    }
}
exports.Spell = Spell;
Spell.JsonFilePath = path_1.default.join(__dirname, "../assets/spells.json");
//# sourceMappingURL=spell.js.map