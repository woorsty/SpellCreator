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
    [key: string]: any;
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

const requiredFields = ['Stufe', 'Name', 'Schule', 'Zeitaufwand', 'Reichweite', 'Dauer', 'Text', 'Klasse'];
const validClasses = [
    'Barde',
    'Hexenmeister',
    'Magier',
    'Kleriker',
    'Druide',
    'Krieger',
    'Paladin',
    'Waldläufer',
    'Schurke',
    'Mönch',
    'Zauberer',
    // Füge hier alle weiteren gültigen Klassennamen hinzu
];

const validRanges = [
    'Selbst',
    'Berührung',
    'Besonders',
    'Sicht',
    '1,5 Meter',
    '3 Meter',
    '4,5 Meter',
    '9 Meter',
    '18 Meter',
    '27 Meter',
    '30 Meter',
    '36 Meter',
    '45 Meter',
    '90 Meter',
    '150 Meter',
    '300 Meter',
    '1,6 Kilometer',
    '800 Kilometer',
    'Unbegrenzt',
    // Füge hier alle weiteren gültigen Reichweiten hinzu
];

const validSchools = [
    'Beschwörung',
    'Erkenntnis',
    'Verzauberung',
    'Hervorrufung',
    'Nekromantie',
    'Weissagung',
    'Bann',
    'Illusion',
    'Verwandlung',
    // Füge hier alle weiteren gültigen Schulen hinzu
];

async function checkSpellData(): Promise<string[]> {
    const spellData = await readJsonFile();
    const errors: string[] = [];

    spellData.spells.forEach((spell, index) => {
        requiredFields.forEach(field => {
            if (!spell.hasOwnProperty(field) || spell[field] === null || spell[field] === undefined || (typeof spell[field] === 'string' && spell[field].trim() === '') || (Array.isArray(spell[field]) && spell[field].length === 0)) {
                errors.push(`Zauber "${spell.Name}" (Index ${index}) fehlt das Feld "${field}" oder es ist leer.`);
            }
        });

        const spellStufeNumber = Number(spell.Stufe)
        if (typeof spellStufeNumber !== 'number' || isNaN(spellStufeNumber) || !Number.isInteger(spellStufeNumber) || spellStufeNumber < 0 || spellStufeNumber > 9) {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Stufe ist ungültig (muss eine ganze Zahl zwischen 0 und 9 sein). Ist: ${spell.Stufe}`);
        }
        if (!Array.isArray(spell.Klasse)) {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Klasse ist kein Array.`);
        } else if (spell.Klasse.some(k => typeof k !== 'string' || k.trim() === '')) {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Nicht alle Einträge im Klassen-Array sind gültige Strings.`);
        } else {
            spell.Klasse.forEach(className => {
                if (!validClasses.includes(className)) {
                    errors.push(`Zauber "${spell.Name}" (Index ${index}): Ungültiger Klassenname "${className}". Erlaubte Klassen sind: ${validClasses.join(', ')}`);
                }
            });
        }
        if (spell.Konzentration !== undefined && typeof spell.Konzentration !== 'boolean') {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Konzentration muss ein Boolean sein.`);
        }
        if (spell.Ritual !== undefined && typeof spell.Ritual !== 'boolean') {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Ritual muss ein Boolean sein.`);
        }
        if (spell.Verbal !== undefined && typeof spell.Verbal !== 'boolean') {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Verbal muss ein Boolean sein.`);
        }
        if (spell.Gestik !== undefined && typeof spell.Gestik !== 'boolean') {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Gestik muss ein Boolean sein.`);
        }

        // Validierung der Reichweite
        if (spell.Reichweite && !validRanges.includes(spell.Reichweite)) {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Ungültige Reichweite "${spell.Reichweite}". Erlaubte Reichweiten sind: ${validRanges.join(', ')}`);
        }

        // Validierung der Schule
        if (spell.Schule && !validSchools.includes(spell.Schule)) {
            errors.push(`Zauber "${spell.Name}" (Index ${index}): Ungültige Schule "${spell.Schule}". Erlaubte Schulen sind: ${validSchools.join(', ')}`);
        }
    });

    return errors;
}

app.get('/check-spells', async (req: Request, res: Response) => {
    const errors = await checkSpellData();
    if (errors.length > 0) {
        res.status(400).json({ message: 'Es wurden Fehler in den Zauberdaten gefunden:', errors });
    } else {
        res.status(200).json({ message: 'Alle Zauberdaten scheinen korrekt zu sein.' });
    }
})

app.get('/spells', async (req: Request, res: Response) => {
    const filterStufeVon = req.query.stufeVon as string | undefined;
    const filterStufeBis = req.query.stufeBis as string | undefined;
    const filterKlasse = req.query.klasse as string | undefined;
    const filterSchule = req.query.schule as string | undefined;
    const sortierung = req.query.sortierung as string | undefined;

    const spellData = await readJsonFile();
    let gefilterteZauber = [...spellData.spells]; // Erstelle eine Kopie zum Filtern

    // Filterlogik für Stufe (Von-Bis Bereich)
    if (filterStufeVon && filterStufeVon !== '') {
        const von = parseInt(filterStufeVon, 10);
        if (filterStufeBis && filterStufeBis !== '') {
            const bis = parseInt(filterStufeBis, 10);
            gefilterteZauber = gefilterteZauber.filter(spell => spell.Stufe >= von && spell.Stufe <= bis);
        } else {
            gefilterteZauber = gefilterteZauber.filter(spell => spell.Stufe === von);
        }
    } else if (filterStufeBis && filterStufeBis !== '') {
        const bis = parseInt(filterStufeBis, 10);
        gefilterteZauber = gefilterteZauber.filter(spell => spell.Stufe <= bis);
    }

    if (filterSchule) {
        gefilterteZauber = gefilterteZauber.filter(spell => spell.Schule === filterSchule);
    }
    if (filterKlasse) {
        gefilterteZauber = gefilterteZauber.filter(spell => spell.Klasse.includes(filterKlasse));
    }

    // Sortierlogik
    if (sortierung) {
        switch (sortierung) {
            case 'name_asc':
                gefilterteZauber.sort((a, b) => a.Name.localeCompare(b.Name));
                break;
            case 'name_desc':
                gefilterteZauber.sort((a, b) => b.Name.localeCompare(a.Name));
                break;
            case 'stufe_asc':
                gefilterteZauber.sort((a, b) => a.Stufe - b.Stufe);
                break;
            case 'stufe_desc':
                gefilterteZauber.sort((a, b) => b.Stufe - a.Stufe);
                break;
            case 'schule_asc':
                gefilterteZauber.sort((a, b) => a.Schule.localeCompare(b.Schule));
                break;
            case 'schule_desc':
                gefilterteZauber.sort((a, b) => b.Schule.localeCompare(a.Schule));
                break;
        }
    }

    res.render('spells', {
        spells: gefilterteZauber,
        filterStufeVon: filterStufeVon,
        filterStufeBis: filterStufeBis,
        filterKlasse: filterKlasse,
        filterSchule: filterSchule,
        sortierung: sortierung,
    });
});

app.get('/add', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/form.html'));
})

app.get('/', (req: Request, res: Response) => {
    res.send(
        '<a href="/spells">Anzeigen</a>' +
        '<br/>' +
        '<a href="/add">Hinzufügen</a>' +
        '<br/>' +
        '<a href="/check-spells">Check</a>'
    )
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