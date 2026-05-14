import express from "express";
import type { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import spellRoutes from "./module/spell/spellRoute";
import invocationRoutes from "./module/anrufung/invocationRoute";
import spellCardRoutes from "./module/spellcard/spellcardRoute";
import classRoutes from "./module/class/classRouter";
import dataRoutes from "./module/data/dataRouter";
import { createCharacterRouter } from "./module/character/characterRouter";
import apiRouter from "./module/api/apiRouter";
import { services } from "./services";
import cors from "cors";

const app = express();
const port = 3000;
app.locals.services = services;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.use(express.json());
app.use("/spell", spellRoutes);
app.use("/invocation", invocationRoutes);
app.use("/spellcard", spellCardRoutes);
app.use("/class", classRoutes);
app.use("/data", dataRoutes);
app.use("/character", createCharacterRouter(services));
app.use("/api", apiRouter);

app.listen(port, "::", () => {
  console.log(`Server läuft auf http://0.0.0.0:${port}`);
});
