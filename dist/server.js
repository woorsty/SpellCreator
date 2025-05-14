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
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views')); // Pfad zum 'views'-Ordner
const jsonFilePath = path_1.default.join(__dirname, '../spells.json');
async function readJsonFile() {
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    catch (error) {
        console.error('Fehler beim Lesen der JSON-Datei:', error);
        return { spells: [] };
    }
}
async function writeJsonFile(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(jsonFilePath, jsonData, 'utf-8');
        console.log('JSON-Datei erfolgreich aktualisiert.');
    }
    catch (error) {
        console.error('Fehler beim Schreiben der JSON-Datei:', error);
    }
}
app.get('/spells', async (req, res) => {
    const spellData = await readJsonFile();
    res.render('spells', { spells: spellData.spells });
});
app.get('/add', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/form.html'));
});
app.get('/edit/:name', async (req, res) => {
    const spellName = req.params.name;
    const spellData = await readJsonFile();
    const spellToEdit = spellData.spells.find(spell => spell.Name === spellName);
    if (spellToEdit) {
        res.render('edit-spell', { spell: spellToEdit });
    }
    else {
        res.status(404).send('Zauber nicht gefunden');
    }
});
app.post('/edit/:name', async (req, res) => {
    const spellName = req.params.name;
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;
    const updatedSpell = {
        ...rest,
        Name: spellName, // Behalte den Namen bei (könnte aber auch geändert werden)
        Klasse: Klasse.split(',').map((k) => k.trim()),
        Konzentration: req.body.Konzentration === 'on',
        Ritual: req.body.Ritual === 'on',
        Verbal: req.body.Verbal === 'on',
        Gestik: req.body.Gestik === 'on',
    };
    const spellData = await readJsonFile();
    const index = spellData.spells.findIndex(spell => spell.Name === spellName);
    if (index !== -1) {
        spellData.spells[index] = updatedSpell;
        await writeJsonFile(spellData);
        res.redirect('/spells'); // Zurück zur Zauberliste
    }
    else {
        res.status(404).send('Zauber nicht gefunden');
    }
});
app.post('/add-spell', async (req, res) => {
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;
    const newSpell = {
        ...rest,
        Klasse: Klasse.split(',').map((k) => k.trim()),
        Konzentration: Konzentration === 'on',
        Ritual: Ritual === 'on',
        Verbal: Verbal === 'on',
        Gestik: Gestik === 'on',
    };
    const spellData = await readJsonFile();
    spellData.spells.push(newSpell);
    await writeJsonFile(spellData);
    res.statusCode = 303;
    res.setHeader('Location', '/add');
    res.end();
});
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
