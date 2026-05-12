import { Router } from "express";
import fs from "fs";
import path from "path";
import { mapGermanSpellJsonToSpell } from "./germanSpellsJsonToSpellsMapper";

const router = Router();

export const SPELLS_PATH = path.resolve(
  process.cwd(),
  "../../packages/data/spells.json",
);

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

export const CLASSES_PATH = path.resolve(
  process.cwd(),
  "../../packages/data/classes.json",
);

router.get("/classes", (req, res) => {
  const data = JSON.parse(fs.readFileSync(CLASSES_PATH, "utf-8"));
  res.json(data);
});

export const BACKGROUNDS_PATH = path.resolve(
  process.cwd(),
  "../../packages/data/backgrounds.json",
);

router.get("/backgrounds", (req, res) => {
  const data = JSON.parse(fs.readFileSync(BACKGROUNDS_PATH, "utf-8"));
  res.json(data);
});

export const CHARACTERS_PATH = path.resolve(
  process.cwd(),
  "../../packages/data/characters",
);

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

router.get("/characters/:name", (req, res) => {
  const exists = fs.existsSync(CHARACTERS_PATH + "/" + req.params.name);
  console.log(exists);
  res.json({ exists: exists });
});

router.post("/characters/:name", (req, res) => {
  const character = JSON.stringify(req.body, null, 2);
  fs.writeFileSync(CHARACTERS_PATH + "/" + req.params.name, character);

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
  "../../packages/data/invocation.json",
);

router.get("/invocations", (req, res) => {
  const data = JSON.parse(fs.readFileSync(INVOCATIONS_PATH, "utf-8"));
  res.json(data);
});

export default router;
