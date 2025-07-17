import * as fs from "fs/promises";
import path from "path";

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

async function readJsonFile(filePath: string): Promise<SpellData> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as SpellData;
  } catch (error) {
    console.error("Fehler beim Lesen der JSON-Datei:", error);
    throw error;
  }
}

async function displaySpellData(data: SpellData): Promise<void> {
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
  } else {
    console.log("Die JSON-Datei enthält keine gültigen Zauberdaten.");
  }
}

async function main(): Promise<void> {
  const jsonFilePath = path.join(__dirname, "../assets/spells.json"); // Pfad zur JSON-Datei

  try {
    const spellData = await readJsonFile(jsonFilePath);
    await displaySpellData(spellData);
  } catch (error) {
    // Fehler wurde bereits in readJsonFile behandelt
  }
}

main();
