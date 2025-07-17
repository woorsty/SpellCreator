"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function readJsonFile(filePath) {
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        return JSON.parse(fileContent);
    }
    catch (error) {
        console.error("Fehler beim Lesen der JSON-Datei:", error);
        throw error;
    }
}
async function displaySpellData(data) {
    if (data && data.spells) {
        console.log("Daten aus der JSON-Datei:");
        for (const spell of data.spells) {
            console.log("\n--------------------");
            console.log(`Name: ${spell.Name}`);
            console.log(`Stufe: ${spell.Stufe}`);
            console.log(`Schule: ${spell.Schule}`);
            console.log(`Zeitaufwand: ${spell.Zeitaufwand}`);
            console.log(`Reichweite: ${spell.Reichweite}`);
            if (spell.Konzentration !== undefined) {
                console.log(`Konzentration: ${spell.Konzentration}`);
            }
            console.log(`Dauer: ${spell.Dauer}`);
            if (spell.Ritual !== undefined) {
                console.log(`Ritual: ${spell.Ritual}`);
            }
            if (spell.Verbal !== undefined) {
                console.log(`Verbal: ${spell.Verbal}`);
            }
            if (spell.Gestik !== undefined) {
                console.log(`Gestik: ${spell.Gestik}`);
            }
            if (spell.Material) {
                console.log(`Material: ${spell.Material}`);
            }
            console.log(`Text: ${spell.Text.substring(0, 50)}...`); // Nur die ersten 50 Zeichen anzeigen
            console.log(`Klasse: ${spell.Klasse.join(", ")}`);
            if (spell.HöhereLevel) {
                console.log(`Höhere Level: ${spell.HöhereLevel}`);
            }
        }
        console.log("\n--------------------");
    }
    else {
        console.log("Die JSON-Datei enthält keine gültigen Zauberdaten.");
    }
}
async function main() {
    const jsonFilePath = path_1.default.join(__dirname, "../assets/spells.json"); // Pfad zur JSON-Datei
    try {
        const spellData = await readJsonFile(jsonFilePath);
        await displaySpellData(spellData);
    }
    catch (error) {
        // Fehler wurde bereits in readJsonFile behandelt
    }
}
main();
//# sourceMappingURL=index.js.map