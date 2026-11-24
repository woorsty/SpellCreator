import fs from "fs";
import path from "path";
import https from "https";

const CSV_PATH = path.resolve(process.cwd(), "Monster – D3.csv");
const GITHUB_URL = "https://raw.githubusercontent.com/adkinn/srd-5.2.1/main/data/monsters.json";
const MONSTERS_DIR = path.resolve(process.cwd(), "apps/server/data/monsters");
const LOG_FILE = path.resolve(process.cwd(), "apps/server/scripts/import-monsters.log");

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + "\n");
}

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Erste Zeile ist Titel, zweite Zeile ist Header
  const headerLine = lines[1];
  const headers = headerLine.split(";").map((h) => h.trim());

  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    // Einfache Semikolon-Trennung (ohne Escaping für Komplexität)
    const values = line.split(";");
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] ? values[j].trim() : "";
    }
    rows.push(row);
  }

  return rows;
}

function abilityToModifier(score) {
  return Math.floor((score - 10) / 2);
}

function buildCombatant(englishMonster) {
  const sb = englishMonster.stat_block_json || {};
  const abilities = sb.ability_scores || {};
  const senses = sb.senses || {};
  const skills = sb.skills || {};
  const languages = sb.languages || [];

  const sensesList = [];
  if (senses.darkvision) sensesList.push(`Dunkelsicht ${senses.darkvision} ft.`);
  if (senses.blindsight) sensesList.push(`Blindsicht ${senses.blindsight} ft.`);
  if (senses.tremorsense) sensesList.push(`Bebenserfassung ${senses.tremorsense} ft.`);
  if (senses.truesight) sensesList.push(`Wahres Sehen ${senses.truesight} ft.`);
  if (senses.passive_perception) sensesList.push(`Passive Wahrnehmung ${senses.passive_perception}`);

  const damageResistances = sb.damage_resistances || [];
  const damageImmunities = sb.damage_immunities || [];
  const damageVulnerabilities = sb.damage_vulnerabilities || [];
  const conditionImmunities = sb.condition_immunities || [];

  const traits = sb.traits || [];
  const traitDescriptions = traits.map((t) => `${t.name}: ${t.description}`).join(" ");

  const actions = (sb.actions || []).map((a) => ({
    name: a.name,
    description: a.description,
  }));

  const skillList = [];
  for (const [skillName, bonus] of Object.entries(skills)) {
    skillList.push({ name: skillName, bonus: bonus });
  }

  const languageList = Array.isArray(languages) ? languages : [String(languages)];

  const speed = sb.speed || {};
  let movementRate = 9;
  if (speed.walk) movementRate = speed.walk;
  else {
    const values = Object.values(speed).filter((v) => typeof v === "number");
    if (values.length > 0) movementRate = Math.max(...values);
  }

  return {
    id: crypto.randomUUID?.() ?? `m-${Date.now()}`,
    name: englishMonster.name, // Englisch ist führend
    type: "npc",
    initiative: null,
    initiativeBonus: englishMonster.initiative_modifier != null ? englishMonster.initiative_modifier : 0,
    hp: englishMonster.hp_max,
    maxHp: englishMonster.hp_max,
    tempHp: 0,
    armorClass: englishMonster.armor_class,
    conditions: [],
    isDead: false,
    isConcentrating: false,
    source: "SRD 5.2.1 (adkinn/srd-5.2.1)",
    description: "",
    imported: true, // Importierte Monster kennzeichnen
    strength: abilities.str || 10,
    dexterity: abilities.dex || 10,
    constitution: abilities.con || 10,
    intelligence: abilities.int || 10,
    wisdom: abilities.wis || 10,
    charisma: abilities.cha || 10,
    savingThrowStrength: abilityToModifier(abilities.str || 10),
    savingThrowDexterity: abilityToModifier(abilities.dex || 10),
    savingThrowConstitution: abilityToModifier(abilities.con || 10),
    savingThrowIntelligence: abilityToModifier(abilities.int || 10),
    savingThrowWisdom: abilityToModifier(abilities.wis || 10),
    savingThrowCharisma: abilityToModifier(abilities.cha || 10),
    skills: skillList,
    senses: sensesList,
    damageVulnerabilities,
    damageResistances,
    damageImmunities,
    conditionImmunities,
    languages: languageList,
    challengeRating: englishMonster.cr,
    movementRate,
    actions,
    bonusActions: [],
    legendaryActions: [],
    mythicActions: [],
  };
}

async function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function main() {
  log("Starte Import von CSV (Übersetzungen) + GitHub (englische Werte)...");

  if (!fs.existsSync(MONSTERS_DIR)) {
    fs.mkdirSync(MONSTERS_DIR, { recursive: true });
    log(`Verzeichnis erstellt: ${MONSTERS_DIR}`);
  }

  // Bestehende Monster löschen
  const existingFiles = fs.readdirSync(MONSTERS_DIR).filter((f) => f.endsWith(".json"));
  for (const f of existingFiles) {
    fs.unlinkSync(path.join(MONSTERS_DIR, f));
  }
  log(`Bestehende Dateien gelöscht: ${existingFiles.length}`);

  // 1. CSV parsen für Übersetzungen (DE → EN)
  const csvRows = parseCsv(CSV_PATH);
  log(`CSV-Zeilen gelesen: ${csvRows.length}`);

  // Übersetzungstabelle: DE Name → EN Name
  const deToEn = new Map();
  const enToDe = new Map();

  for (const row of csvRows) {
    const deName = row["Name"];
    const enName = row["Name(en)"];
    if (deName && enName) {
      deToEn.set(deName, enName);
      enToDe.set(enName, deName);
    }
  }

  log(`Übersetzungen aus CSV: ${deToEn.size}`);

  // 2. Englische Vollwerte von GitHub laden
  const githubText = await fetchText(GITHUB_URL);
  const githubData = JSON.parse(githubText);
  const englishMonsters = githubData.monsters;
  log(`Englische Monster von GitHub: ${englishMonsters.length}`);

  // 3. Kombinieren und speichern
  let imported = 0;
  let skipped = 0;

  for (const eng of englishMonsters) {
    const enName = eng.name;
    const deName = enToDe.get(enName);

    if (!deName) {
      skipped++;
      log(`  [-] ${enName} (HG ${eng.cr}) - keine deutsche Übersetzung`);
      continue;
    }

    const combatant = buildCombatant(eng);
    // germanName NICHT in JSON speichern - kommt aus i18n (monsterTranslations)

    const safeName = enName.replace(/[/\\?%*:|"<>]/g, "-");
    const fileName = `${safeName}.json`;
    const filePath = path.join(MONSTERS_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(combatant, null, 2));

    imported++;
    log(`  [+] ${deName} (englisch: ${enName}, HG ${eng.cr})`);
  }

  // Übersetzungsdatei als TypeScript-Modul schreiben (EN → DE)
  const localesDir = path.resolve(process.cwd(), "apps/web/src/locales/de");
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  const entries = Array.from(enToDe.entries())
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");
  const tsContent = `export const monsterTranslations = {\n${entries}\n};\n`;
  fs.writeFileSync(
    path.join(localesDir, "monsters.ts"),
    tsContent,
  );
  log(`Übersetzungsdatei geschrieben: ${enToDe.size} Einträge`);

  log(`\n=== Import abgeschlossen ===`);
  log(`Mit deutscher Übersetzung: ${imported}`);
  log(`Ohne deutsche Übersetzung: ${skipped}`);
  log(`Gesamt in Datenbank: ${imported}`);
}

main().catch((err) => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
