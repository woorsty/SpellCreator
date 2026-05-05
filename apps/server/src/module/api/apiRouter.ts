import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

export const SPELLS_PATH = path.resolve(
  process.cwd(),
  "../../packages/data/spells.json",
);

router.get("/spells", (req, res) => {
  const data = JSON.parse(fs.readFileSync(SPELLS_PATH, "utf-8"));
  res.json(data);
});

export const CLASSES_PATH = path.resolve(
  process.cwd(),
  "../../packages/data/classes.json",
);

router.get("/classes", (req, res) => {
  const data = JSON.parse(fs.readFileSync(CLASSES_PATH, "utf-8"));
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
