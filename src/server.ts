import express, { Request, Response } from 'express';
import * as fs from 'fs/promises';
import path from 'path';
import bodyParser from 'body-parser';
import ejs from 'ejs';

interface Spell {
    Stufe: number;
    Name: string;
    Schule: string;
    Zeitaufwand: string;
    Reichweite: string;
    Konzentration?: boolean;
    Dauer: string;
    Ritual?: boolean;
    Verbal?: boolean;
    Gestik?: boolean;
    Material?: string | null;
    Text: string;
    Klasse: string[];
    HöhereLevel?: string | null;
}

interface SpellData {
    spells: Spell[];
}

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')); // Pfad zum 'views'-Ordner

const jsonFilePath = path.join(__dirname, '../spells.json');

async function readJsonFile(): Promise<SpellData> {
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
        return JSON.parse(fileContent) as SpellData;
    } catch (error) {
        console.error('Fehler beim Lesen der JSON-Datei:', error);
        return { spells: [] };
    }
}

async function writeJsonFile(data: SpellData): Promise<void> {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(jsonFilePath, jsonData, 'utf-8');
        console.log('JSON-Datei erfolgreich aktualisiert.');
    } catch (error) {
        console.error('Fehler beim Schreiben der JSON-Datei:', error);
    }
}

app.get('/spells', async (req: Request, res: Response) => {
    const spellData = await readJsonFile();
    res.render('spells', { spells: spellData.spells });
});

app.get('/add', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/form.html'));
})

app.get('/edit/:name', async (req: Request, res: Response) => {
    const spellName = req.params.name;
    const spellData = await readJsonFile();
    const spellToEdit = spellData.spells.find(spell => spell.Name === spellName);

    if (spellToEdit) {
        res.render('edit-spell', { spell: spellToEdit });
    } else {
        res.status(404).send('Zauber nicht gefunden');
    }
})

app.post('/edit/:name', async (req: Request, res: Response) => {
    const spellName = req.params.name;
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;

    const updatedSpell: Spell = {
        ...rest,
        Name: spellName, // Behalte den Namen bei (könnte aber auch geändert werden)
        Klasse: Klasse.split(',').map((k: string) => k.trim()),
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
    } else {
        res.status(404).send('Zauber nicht gefunden');
    }
});

app.post('/add-spell', async (req: Request, res: Response) => {
    const { Klasse, Konzentration, Ritual, Verbal, Gestik, ...rest } = req.body;

    const newSpell: Spell = {
        ...rest,
        Klasse: Klasse.split(',').map((k: string) => k.trim()),
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