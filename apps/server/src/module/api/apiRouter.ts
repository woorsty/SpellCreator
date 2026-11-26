import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { mapGermanSpellJsonToSpell } from "./germanSpellsJsonToSpellsMapper";

const router: Router = Router();

export const SPELLS_PATH = path.resolve(process.cwd(), "data/spells.json");

export const MONSTER_IMAGES_PATH = path.resolve(process.cwd(), "data/monsters/images");

// Ensure the image directory exists
try {
  fs.mkdirSync(MONSTER_IMAGES_PATH, { recursive: true });
} catch {
  // directory may already exist
}

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, MONSTER_IMAGES_PATH);
  },
  filename: (_req, file, cb) => {
    const nameParam = _req.params.name;
    const safeName = (Array.isArray(nameParam) ? nameParam[0] : nameParam ?? "monster").replace(/[^a-zA-Z0-9_-]/g, "-");
    const ext = file.originalname.split(".").pop()?.toLowerCase() ?? "png";
    const unique = crypto.randomUUID?.() ?? Date.now().toString();
    cb(null, `${safeName}-${unique}.${ext}`);
  },
});

export const uploadMonsterImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Nur Bilddateien sind erlaubt (JPEG, PNG, GIF, WebP)"));
    }
  },
}).single("image");

function extractImageFilename(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    return url.pathname.split("/").pop() ?? null;
  } catch {
    const parts = imageUrl.split("/");
    return parts[parts.length - 1] || null;
  }
}

function deleteMonsterImage(imageUrl: string | undefined): void {
  if (!imageUrl) return;
  const filename = extractImageFilename(imageUrl);
  if (!filename) return;
  try {
    fs.unlinkSync(path.join(MONSTER_IMAGES_PATH, filename));
  } catch {
    // ignore missing file
  }
}

router.get("/spells", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SPELLS_PATH, "utf-8")) as any[];
  const spells = data.map(mapGermanSpellJsonToSpell);
  res.json(spells);
});

router.get("/spells/:name", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SPELLS_PATH, "utf-8")) as any[];
  const spells = data.map(mapGermanSpellJsonToSpell);
  const spell = spells.find((spell) => spell.name === req.params.name);
  res.json(spell);
});

export const CLASSES_PATH = path.resolve(process.cwd(), "data/classes.json");

router.get("/classes", (req, res) => {
  const data = JSON.parse(fs.readFileSync(CLASSES_PATH, "utf-8"));
  res.json(data);
});

export const BACKGROUNDS_PATH = path.resolve(
  process.cwd(),
  "data/backgrounds.json",
);

router.get("/backgrounds", (req, res) => {
  const data = JSON.parse(fs.readFileSync(BACKGROUNDS_PATH, "utf-8"));
  res.json(data);
});

export const CHARACTERS_PATH = path.resolve(process.cwd(), "data/characters");

router.get("/characters", (req, res) => {
  const characterFiles = fs
    .readdirSync(CHARACTERS_PATH)
    .filter((file) => file.endsWith(".json"));

  const characters = characterFiles.map((file) => {
    const filePath = path.join(CHARACTERS_PATH, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  });

  res.json(characters);
});

export const MONSTERS_PATH = path.resolve(process.cwd(), "data/monsters");
export const CUSTOM_MONSTERS_PATH = path.resolve(process.cwd(), "data/monsters/custom");

function readMonstersFromDir(dir: string, source: "imported" | "custom"): any[] {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return [];
  }
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));
  return files.map((file) => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const monster = JSON.parse(fileContent);
    // source NICHT in Datei schreiben, nur beim Lesen hinzufügen
    return { ...monster, source };
  });
}

router.get("/monsters", (req, res) => {
  try {
    const imported = readMonstersFromDir(MONSTERS_PATH, "imported");
    const custom = readMonstersFromDir(CUSTOM_MONSTERS_PATH, "custom");
    res.json([...imported, ...custom]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden der Monster" });
  }
});

function findMonsterFile(name: string): { filePath: string; source: "imported" | "custom" } | null {
  const importedPath = path.join(MONSTERS_PATH, `${name}.json`);
  if (fs.existsSync(importedPath)) {
    return { filePath: importedPath, source: "imported" };
  }
  const customPath = path.join(CUSTOM_MONSTERS_PATH, `${name}.json`);
  if (fs.existsSync(customPath)) {
    return { filePath: customPath, source: "custom" };
  }
  return null;
}

router.post("/monsters", (req, res) => {
  try {
    if (!fs.existsSync(CUSTOM_MONSTERS_PATH)) {
      fs.mkdirSync(CUSTOM_MONSTERS_PATH, { recursive: true });
    }
    const monster = req.body;
    if (!monster || !monster.name) {
      res.status(400).json({ error: "Name ist erforderlich" });
      return;
    }
    // source Feld entfernen bevor gespeichert wird
    const { source, ...monsterToSave } = monster;
    const fileName = `${monsterToSave.name}.json`;
    const filePath = path.join(CUSTOM_MONSTERS_PATH, fileName);
    fs.writeFileSync(filePath, JSON.stringify(monsterToSave, null, 2));
    res.status(201).json({ ok: true, id: monsterToSave.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Speichern des Monsters" });
  }
});

router.get("/monsters/:name", (req, res) => {
  try {
    const found = findMonsterFile(req.params.name);
    if (!found) {
      res.status(404).json({ error: "Monster nicht gefunden" });
      return;
    }
    const fileContent = fs.readFileSync(found.filePath, "utf-8");
    const monster = JSON.parse(fileContent);
    res.json({ ...monster, source: found.source });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden des Monsters" });
  }
});

// Bild für ein Monster hochladen (nur benutzerdefinierte Monster)
router.post("/monsters/:name/image", uploadMonsterImage, (req, res) => {
  try {
    const nameParam = req.params.name;
    const name = Array.isArray(nameParam) ? nameParam[0] : nameParam;
    const found = findMonsterFile(name);
    if (!req.file) {
      res.status(400).json({ error: "Keine Bilddatei hochgeladen" });
      return;
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/monster-images/${req.file.filename}`;
    // Wenn das Monster bereits existiert, imageUrl im JSON speichern
    if (found) {
      if (found.source !== "custom") {
        res
          .status(403)
          .json({ error: "Bilder können nur für benutzerdefinierte Monster hochgeladen werden" });
        return;
      }
      try {
        const fileContent = fs.readFileSync(found.filePath, "utf-8");
        const monster = JSON.parse(fileContent);
        if (monster.imageUrl && monster.imageUrl !== url) {
          deleteMonsterImage(monster.imageUrl);
        }
        monster.imageUrl = url;
        fs.writeFileSync(found.filePath, JSON.stringify(monster, null, 2));
      } catch {
        // ignore write errors, URL is still returned
      }
    }
    res.json({ ok: true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Hochladen des Bildes" });
  }
});

// Bild eines Monsters löschen
router.delete("/monsters/:name/image", (req, res) => {
  try {
    const found = findMonsterFile(req.params.name);
    if (!found) {
      res.status(404).json({ error: "Monster nicht gefunden" });
      return;
    }
    if (found.source !== "custom") {
      res.status(403).json({ error: "Bilder können nur bei benutzerdefinierten Monstern gelöscht werden" });
      return;
    }
    try {
      const fileContent = fs.readFileSync(found.filePath, "utf-8");
      const monster = JSON.parse(fileContent);
      deleteMonsterImage(monster.imageUrl);
    } catch {
      // ignore read errors
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Löschen des Bildes" });
  }
});

router.put("/monsters/:name", (req, res) => {
  try {
    const found = findMonsterFile(req.params.name);
    if (!found) {
      res.status(404).json({ error: "Monster nicht gefunden" });
      return;
    }
    const monster = req.body;
    if (!monster || !monster.name) {
      res.status(400).json({ error: "Name ist erforderlich" });
      return;
    }
    // Altes Bild löschen, falls die imageUrl sich geändert hat
    let oldImageUrl: string | undefined;
    if (found.source === "custom") {
      try {
        const oldContent = fs.readFileSync(found.filePath, "utf-8");
        const oldMonster = JSON.parse(oldContent);
        oldImageUrl = oldMonster.imageUrl;
      } catch {
        // ignore read errors
      }
    }
    // source Feld entfernen bevor gespeichert wird
    const { source, ...monsterToSave } = monster;
    fs.writeFileSync(found.filePath, JSON.stringify(monsterToSave, null, 2));
    if (oldImageUrl && oldImageUrl !== monsterToSave.imageUrl) {
      deleteMonsterImage(oldImageUrl);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Monsters" });
  }
});

router.delete("/monsters/:name", (req, res) => {
  try {
    const found = findMonsterFile(req.params.name);
    if (!found) {
      res.status(404).json({ error: "Monster nicht gefunden" });
      return;
    }
    // Zugehöriges Bild löschen (nur bei benutzerdefinierten Monstern)
    if (found.source === "custom") {
      try {
        const fileContent = fs.readFileSync(found.filePath, "utf-8");
        const monster = JSON.parse(fileContent);
        deleteMonsterImage(monster.imageUrl);
      } catch {
        // ignore read errors
      }
    }
    fs.unlinkSync(found.filePath);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Löschen des Monsters" });
  }
});

router.head("/characters/:name", (req, res) => {
  try {
    const filePath = path.join(CHARACTERS_PATH, `${req.params.name}.json`);

    const exists = fs.existsSync(filePath);

    return res
      .status(200)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ exists }));
  } catch (err) {
    console.error(err);

    // WICHTIG: trotzdem gültiges JSON zurückgeben
    return res
      .status(200)
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ exists: false }));
  }
});
router.get("/characters/:name", (req, res) => {
  const characterData = fs.readFileSync(
    CHARACTERS_PATH + "/" + req.params.name + ".json",
    "utf-8",
  );
  res.json(JSON.parse(characterData));
});

router.post("/characters/:name", (req, res) => {
  const character = JSON.stringify(req.body, null, 2);
  fs.writeFileSync(
    CHARACTERS_PATH + "/" + req.params.name + ".json",
    character,
  );

  res.json({ ok: true });
});

router.get("/characters/:id", (req, res) => {
  const { id } = req.params;

  const characterFiles = fs
    .readdirSync(CHARACTERS_PATH)
    .filter((file) => file.endsWith(".json"));

  const characters = characterFiles.map((file) => {
    const filePath = path.join(CHARACTERS_PATH, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  });

  res.json(characters.find((char) => char.id === id) || null);
});

export const INVOCATIONS_PATH = path.resolve(
  process.cwd(),
  "data/invocation.json",
);

router.get("/invocations", (req, res) => {
  const data = JSON.parse(fs.readFileSync(INVOCATIONS_PATH, "utf-8"));
  res.json(data);
});

// Error handler for multer upload errors
router.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: any, _req: any, res: any, _next: any) => {
    res.status(400).json({ error: err.message || "Fehler bei der Bildverarbeitung" });
  },
);

export default router;
