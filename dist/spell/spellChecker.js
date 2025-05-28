"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellChecker = void 0;
const util_1 = require("../util");
const spellModel_1 = require("./spellModel");
const requiredFields = [
    "Stufe",
    "Name",
    "Schule",
    "Zeitaufwand",
    "Reichweite",
    "Dauer",
    "Text",
    "Klasse",
];
const validClasses = [
    "Barde",
    "Hexenmeister",
    "Magier",
    "Kleriker",
    "Druide",
    "Krieger",
    "Paladin",
    "Waldläufer",
    "Schurke",
    "Mönch",
    "Zauberer",
    // Füge hier alle weiteren gültigen Klassennamen hinzu
];
const validRanges = [
    "Selbst",
    "Berührung",
    "Besonders",
    "Sicht",
    "1,5 Meter",
    "3 Meter",
    "4,5 Meter",
    "9 Meter",
    "18 Meter",
    "27 Meter",
    "30 Meter",
    "36 Meter",
    "45 Meter",
    "90 Meter",
    "150 Meter",
    "300 Meter",
    "1,6 Kilometer",
    "800 Kilometer",
    "Unbegrenzt",
    // Füge hier alle weiteren gültigen Reichweiten hinzu
];
const validSchools = [
    "Beschwörung",
    "Erkenntnis",
    "Verzauberung",
    "Hervorrufung",
    "Nekromantie",
    "Weissagung",
    "Bann",
    "Illusion",
    "Verwandlung",
    // Füge hier alle weiteren gültigen Schulen hinzu
];
class SpellChecker {
    static async checkSpellData() {
        const spellData = await util_1.Util.readJsonFile(spellModel_1.JsonFilePath);
        const errors = [];
        spellData.forEach((spell, index) => {
            requiredFields.forEach((field) => {
                if (!spell.hasOwnProperty(field) ||
                    spell[field] === null ||
                    spell[field] === undefined ||
                    (typeof spell[field] === "string" && spell[field].trim() === "") ||
                    (Array.isArray(spell[field]) && spell[field].length === 0)) {
                    errors.push(`Zauber "${spell.Name}" (Index ${index}) fehlt das Feld "${field}" oder es ist leer.`);
                }
            });
            const spellStufeNumber = Number(spell.Stufe);
            if (typeof spellStufeNumber !== "number" ||
                isNaN(spellStufeNumber) ||
                !Number.isInteger(spellStufeNumber) ||
                spellStufeNumber < 0 ||
                spellStufeNumber > 9) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Stufe ist ungültig (muss eine ganze Zahl zwischen 0 und 9 sein). Ist: ${spell.Stufe}`);
            }
            if (!Array.isArray(spell.Klasse)) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Klasse ist kein Array.`);
            }
            else if (spell.Klasse.some((k) => typeof k !== "string" || k.trim() === "")) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Nicht alle Einträge im Klassen-Array sind gültige Strings.`);
            }
            else {
                spell.Klasse.forEach((className) => {
                    if (!validClasses.includes(className)) {
                        errors.push(`Zauber "${spell.Name}" (Index ${index}): Ungültiger Klassenname "${className}". Erlaubte Klassen sind: ${validClasses.join(", ")}`);
                    }
                });
            }
            if (spell.Konzentration !== undefined &&
                typeof spell.Konzentration !== "boolean") {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Konzentration muss ein Boolean sein.`);
            }
            if (spell.Konzentration && !spell.Dauer.startsWith("Bis zu")) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Dauer muss mit 'Bis zu' anfangen, wenn Konzentration true ist`);
            }
            if (spell.Ritual !== undefined && typeof spell.Ritual !== "boolean") {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Ritual muss ein Boolean sein.`);
            }
            if (spell.Verbal !== undefined && typeof spell.Verbal !== "boolean") {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Verbal muss ein Boolean sein.`);
            }
            if (spell.Gestik !== undefined && typeof spell.Gestik !== "boolean") {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Gestik muss ein Boolean sein.`);
            }
            // Validierung der Reichweite
            if (spell.Reichweite && !validRanges.includes(spell.Reichweite)) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Ungültige Reichweite "${spell.Reichweite}". Erlaubte Reichweiten sind: ${validRanges.join(", ")}`);
            }
            // Validierung der Schule
            if (spell.Schule && !validSchools.includes(spell.Schule)) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}): Ungültige Schule "${spell.Schule}". Erlaubte Schulen sind: ${validSchools.join(", ")}`);
            }
        });
        return errors;
    }
}
exports.SpellChecker = SpellChecker;
