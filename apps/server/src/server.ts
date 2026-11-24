import express from "express";
import type { Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import spellRoutes from "./module/spell/spellRoute";
import invocationRoutes from "./module/anrufung/invocationRoute";
import spellCardRoutes from "./module/spellcard/spellcardRoute";
import classRoutes from "./module/class/classRouter";
import dataRoutes from "./module/data/dataRouter";
import mapRoutes from "./module/map/mapRouter";
import apiRouter from "./module/api/apiRouter";
import { services } from "./services";
import cors from "cors";
import articleRouter from "./module/article/articleRouter";
import { createCombatRouter } from "./module/combat/combatRouter";
import { combatService } from "./module/combat/combatService";
import { automationEngine } from "./module/automation/AutomationEngine";
import { createAutomationRouter } from "./module/automation/automationRouter";
import { homeAssistantService } from "./module/integration/homeassistant/HomeAssistantService";
import { audioIntegration } from "./module/integration/audio/AudioIntegration";
import { sseBroadcaster } from "./module/integration/sse/SseBroadcaster";
import { pluginManager } from "./module/plugin/PluginManager";
import { createPluginRouter } from "./module/plugin/pluginRouter";

const app = express();
const port = 3000;
app.locals.services = services;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

app.get("/", (req: Request, res: Response) => {
  const isDev = process.env.NODE_ENV !== "production";

  const baseUrl = isDev ? "http://localhost" : "http://api-rieke.duckdns.org";
  const appUrl = isDev
    ? "http://localhost:5173"
    : "http://dndapp-rieke.duckdns.org";

  res.render("index", { baseUrl, appUrl });
});

app.use(express.json());
app.use("/spell", spellRoutes);
app.use("/invocation", invocationRoutes);
app.use("/spellcard", spellCardRoutes);
app.use("/class", classRoutes);
app.use("/data", dataRoutes);
app.use("/api", apiRouter);
app.use("/article", articleRouter);
app.use("/combat", createCombatRouter());
app.use("/automation", createAutomationRouter());
app.use("/plugin", createPluginRouter());

// Wire Automation Engine to the Combat Event Bus
automationEngine.setEventBus(combatService.getEventBus());
void automationEngine.load();
automationEngine.attach();

// Wire Plugin Manager to the Combat Event Bus and load plugins
pluginManager.setEventBus(combatService.getEventBus());
void pluginManager.loadAll();

// Register integrations for automation scripts
automationEngine.registerIntegration("homeAssistant", homeAssistantService);
automationEngine.registerIntegration("audio", audioIntegration);

// Home Assistant configuration
app.post("/automation/config/homeassistant", (req, res) => {
  try {
    const { baseUrl, token, webSocketEnabled } = req.body as {
      baseUrl?: string;
      token?: string;
      webSocketEnabled?: boolean;
    };
    if (!baseUrl || !token) {
      res.status(400).json({ error: "baseUrl and token are required" });
      return;
    }
    homeAssistantService.configure({ baseUrl, token, webSocketEnabled });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/automation/config/homeassistant/status", (req, res) => {
  res.json({ configured: homeAssistantService.isConfigured() });
});

// SSE stream for client-directed automation commands (e.g. audio)
app.get("/automation/stream", (req, res) => {
  const id = sseBroadcaster.addClient(res);
  res.on("close", () => sseBroadcaster.removeClient(id));
});

app.get("/character", (req: Request, res: Response) => {
  res.redirect(`http://${req.hostname}:5173/character`);
});

app.use(
  "/map-tiles",
  express.static(path.join(process.cwd(), "assets/toril_tiles")),
);

app.use("/map", mapRoutes);

app.listen(port, "::", () => {
  console.log(`Server läuft auf http://0.0.0.0:${port}`);
});
