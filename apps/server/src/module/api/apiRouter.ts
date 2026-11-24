import { Router } from "express";
import fs from "fs";
import path from "path";
import { mapGermanSpellJsonToSpell } from "./germanSpellsJsonToSpellsMapper";

const router: Router = Router();

export const SPELLS_PATH = path.resolve(process.cwd(), "data/spells.json");

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

router.get("/monsters", (req, res) => {
  try {
    if (!fs.existsSync(MONSTERS_PATH)) {
      fs.mkdirSync(MONSTERS_PATH, { recursive: true });
    }
    const monsterFiles = fs
      .readdirSync(MONSTERS_PATH)
      .filter((file) => file.endsWith(".json"));

    const monsters = monsterFiles.map((file) => {
      const filePath = path.join(MONSTERS_PATH, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContent);
    });

    res.json(monsters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden der Monster" });
  }
});

router.post("/monsters", (req, res) => {
  try {
    if (!fs.existsSync(MONSTERS_PATH)) {
      fs.mkdirSync(MONSTERS_PATH, { recursive: true });
    }
    const monster = req.body;
    if (!monster || !monster.name) {
      res.status(400).json({ error: "Name ist erforderlich" });
      return;
    }
    const fileName = `${monster.name}.json`;
    const filePath = path.join(MONSTERS_PATH, fileName);
    fs.writeFileSync(filePath, JSON.stringify(monster, null, 2));
    res.status(201).json({ ok: true, id: monster.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Speichern des Monsters" });
  }
});

router.get("/monsters/:name", (req, res) => {
  try {
    const filePath = path.join(MONSTERS_PATH, `${req.params.name}.json`);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Monster nicht gefunden" });
      return;
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(fileContent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden des Monsters" });
  }
});

router.put("/monsters/:name", (req, res) => {
  try {
    if (!fs.existsSync(MONSTERS_PATH)) {
      fs.mkdirSync(MONSTERS_PATH, { recursive: true });
    }
    const monster = req.body;
    if (!monster || !monster.name) {
      res.status(400).json({ error: "Name ist erforderlich" });
      return;
    }
    const filePath = path.join(MONSTERS_PATH, `${req.params.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(monster, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Monsters" });
  }
});

router.delete("/monsters/:name", (req, res) => {
  try {
    const filePath = path.join(MONSTERS_PATH, `${req.params.name}.json`);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "Monster nicht gefunden" });
      return;
    }
    fs.unlinkSync(filePath);
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

export default router;
