import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import supertest from "supertest";
import apiRouter from "./apiRouter";
import * as fs from "fs/promises";
import * as path from "path";

const CUSTOM_DIR = path.resolve(process.cwd(), "data/monsters/custom");
const IMAGES_DIR = path.resolve(process.cwd(), "data/monsters/images");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", apiRouter);
  return app;
}

async function cleanupDirs() {
  for (const dir of [CUSTOM_DIR, IMAGES_DIR]) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const files = await fs.readdir(dir);
      for (const file of files) {
        await fs.unlink(path.join(dir, file));
      }
    } catch {
      // ignore
    }
  }
}

async function createCustomMonster(app: ReturnType<typeof createApp>, name: string) {
  const agent = supertest(app);
  await agent
    .post("/api/monsters")
    .send({ name, type: "npc", hp: 10, maxHp: 10, armorClass: 10 })
    .expect(201);
}

describe("Monster image upload API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(async () => {
    await cleanupDirs();
    app = createApp();
  });

  afterEach(async () => {
    await cleanupDirs();
  });

  it("should upload an image for a custom monster and return a URL", async () => {
    const name = "Testgoblin";
    await createCustomMonster(app, name);

    const imageBuffer = Buffer.from("fake-png-data");
    const response = await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .attach("image", imageBuffer, "test.png")
      .expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.url).toContain("/monster-images/");
    expect(response.body.url).toContain(name);

    const files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);
    expect(files[0]).toMatch(/^Testgoblin-[0-9a-f-]+\.png$/);
  });

  it("should upload an image and return a URL even for a not-yet-saved monster", async () => {
    const imageBuffer = Buffer.from("fake-png-data");
    const response = await supertest(app)
      .post("/api/monsters/NotSavedYet/image")
      .attach("image", imageBuffer, "test.png")
      .expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.url).toContain("/monster-images/");

    const files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);
  });

  it("should return 403 for an imported monster", async () => {
    const importedDir = path.resolve(process.cwd(), "data/monsters");
    await fs.mkdir(importedDir, { recursive: true });
    await fs.writeFile(
      path.join(importedDir, "Testimported.json"),
      JSON.stringify({ name: "Testimported", type: "npc", hp: 10 }),
    );

    const imageBuffer = Buffer.from("fake-png-data");
    await supertest(app)
      .post("/api/monsters/Testimported/image")
      .attach("image", imageBuffer, "test.png")
      .expect(403);
  });

  it("should return 400 when no file is attached", async () => {
    const name = "Testgoblin";
    await createCustomMonster(app, name);
    await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .expect(400);
  });

  it("should delete the image when the monster is deleted", async () => {
    const name = "Testgoblin";
    await createCustomMonster(app, name);

    const imageBuffer = Buffer.from("fake-png-data");
    await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .attach("image", imageBuffer, "test.png")
      .expect(200);

    let files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);

    await supertest(app).delete(`/api/monsters/${name}`).expect(200);

    files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(0);

    const customFiles = await fs.readdir(CUSTOM_DIR);
    expect(customFiles.length).toBe(0);
  });

  it("should delete the old image when replacing via PUT", async () => {
    const name = "Testgoblin";
    await createCustomMonster(app, name);

    const imageBuffer1 = Buffer.from("fake-png-data-1");
    const res1 = await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .attach("image", imageBuffer1, "test1.png")
      .expect(200);

    let files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);

    const imageBuffer2 = Buffer.from("fake-png-data-2");
    await supertest(app)
      .put(`/api/monsters/${name}`)
      .send({ name, type: "npc", hp: 10, maxHp: 10, armorClass: 10, imageUrl: res1.body.url })
      .expect(200);

    // Same image URL, should not delete
    files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);

    const imageBuffer3 = Buffer.from("fake-png-data-3");
    const res3 = await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .attach("image", imageBuffer3, "test3.png")
      .expect(200);

    // Upload ersetzt altes Bild, also nur noch eine Datei
    files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);

    // Update mit neuer imageUrl - nichts mehr zu löschen (gleich wie hochgeladen)
    await supertest(app)
      .put(`/api/monsters/${name}`)
      .send({ name, type: "npc", hp: 10, maxHp: 10, armorClass: 10, imageUrl: res3.body.url })
      .expect(200);

    files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);
    expect(files[0]).not.toContain("test1");
  });

  it("should delete image via DELETE /image endpoint", async () => {
    const name = "Testgoblin";
    await createCustomMonster(app, name);

    const imageBuffer = Buffer.from("fake-png-data");
    await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .attach("image", imageBuffer, "test.png")
      .expect(200);

    let files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(1);

    await supertest(app).delete(`/api/monsters/${name}/image`).expect(200);

    files = await fs.readdir(IMAGES_DIR);
    expect(files.length).toBe(0);
  });

  it("should reject non-image file types", async () => {
    const name = "Testgoblin";
    await createCustomMonster(app, name);

    const textBuffer = Buffer.from("not an image");
    await supertest(app)
      .post(`/api/monsters/${name}/image`)
      .attach("image", textBuffer, "test.txt")
      .expect(400);
  });
});
