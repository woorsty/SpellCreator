# D&D Combat Manager — Technische Dokumentation

## 1. Übersicht

Der D&D Combat Manager ist eine vollwertige Kampfverwaltungs-Anwendung für Dungeon Masters, die sich an Improved Initiative orientiert und durch ein universelles Event- und Automationssystem deutlich darüber hinausgeht.

**Architekturprinzipien:** Clean Code, SOLID, Separation of Concerns, Dependency Injection, typsicher (TypeScript), modulare Plugin-Architektur.

## 2. Technologie-Stack

| Schicht | Technologie | Begründung |
|---------|-------------|------------|
| Monorepo | pnpm Workspaces | Shared Code zwischen Server, Web, Domain |
| Domain | TypeScript (Node) | Gemeinsame Modelle, EventBus, Plugin-Interface |
| Server | Express, Node.js | REST API, SSE, Automation-Engine (vm-Sandbox) |
| Web | React 19, Vite, Zustand, Tailwind | Moderne UI, zustandsbasiert, responsiv |
| Scripting | Node.js `vm` Modul | Isolierte Ausführung von Benutzer-JavaScript |
| Tests | vitest | Unit, Integration, Automation, EventBus |

## 3. Architekturübersicht

```
src/
├── domain/               # Shared Domain-Modelle (Events, Combat, Plugin, Automation)
│   ├── model/combat.ts   # CombatState, Combatant, Condition, Automation, Event-Payloads
│   ├── event/EventBus.ts # Typsicherer Event-Bus mit Prioritäten, once, RegExp-Matching
│   └── plugin/Plugin.ts  # Plugin-Interface, PluginContext
├── server/
│   ├── module/combat/    # CombatService (Kampflogik), CombatController, Routes
│   ├── module/automation/# AutomationEngine (vm-Sandbox, Zeitlimits, Fehlerisolation)
│   ├── module/plugin/    # PluginManager (Registrierung, Lebenszyklus, API-Exposition)
│   ├── module/integration/
│   │   ├── homeassistant/# REST + WebSocket API für Home Assistant
│   │   ├── audio/        # SSE-basierte Audio-Steuerung (Client-seitig)
│   │   └── sse/          # SSE-Broadcaster für Server->Client Befehle
│   └── server.ts         # Express App, Integration aller Module
└── web/
    ├── feature/combat/   # CombatManager UI, CombatStore (Zustand), CombatApi
    ├── feature/combat/automation/ # Automation-Listen und Code-Editor UI
    ├── feature/combat/audio/      # Client-seitige Audio-Wiedergabe (SSE)
    └── api/combat-api.ts          # REST-Client für Combat-Endpunkte
```

### Trennlinie Core vs. Erweiterung

- **Core-System:** Kampfverwaltung, Kreaturen, Initiative, Runden, Zustände, Persistenz (JSON).
- **Event-System:** Zentraler EventBus, unabhängig vom Core. Jede Kern-Änderung feuert ein typisiertes Event.
- **Automation-System:** Führt JavaScript-Automationen auf Events aus. Sandboxed, zeitlimitiert, fehlerisoliert.
- **Integrationen:** Home Assistant (REST+WS), Audio (SSE), erweiterbar via Plugins.
- **Plugins:** Registrieren eigene Events, Integrationen und APIs. Unabhängig vom Core.
- **UI:** React-Komponenten, Zustand-Store, Dark-Mode.

## 4. Setup und Installation

### Voraussetzungen
- Node.js 20+
- pnpm

### Installation
```bash
pnpm install
```

### Entwicklung (alle Pakete im Watch-Modus)
```bash
pnpm dev
```
- Server: http://localhost:3000
- Web: http://localhost:5173

### Build
```bash
pnpm build
```

### Tests
```bash
# Alle Tests (Server + Domain)
cd apps/server && npx vitest run
cd ../packages/domain && npx vitest run
```

## 5. Konfiguration

### Home Assistant (Server)

Per REST-Endpunkt konfigurieren:

```http
POST /automation/config/homeassistant
Content-Type: application/json

{
  "baseUrl": "http://homeassistant.local:8123",
  "token": "LANGES_TOKEN",
  "webSocketEnabled": true
}

GET /automation/config/homeassistant/status
```

Die Konfiguration ist für die Automation-Engine verfügbar über das `homeAssistant`-Objekt in Scripts.

## 6. Event-Katalog mit Payload-Schemas

Alle Events haben die Basisstruktur:

```typescript
{
  event: string;           // Event-Typ
  timestamp: string;       // ISO-8601
  combatId?: string;       // Optional: Kampf-ID
  [key: string]: unknown;  // Erweiterbare Zusatzdaten
}
```

### Initiative und Kampf

| Event | Payload-Zusatz |
|-------|---------------|
| `combat.started` | `{ combat: { id, round } }` |
| `combat.ended` | `{ combat: { id, round } }` |
| `combat.paused` | `{ combat: { id, round } }` |
| `combat.resumed` | `{ combat: { id, round } }` |
| `combat.round.started` | `{ combat: { id, round } }` |
| `combat.round.ended` | `{ combat: { id, round } }` |
| `combat.turn.started` | `{ combat: { id, round }, combatant: {...}, previousCombatant?: { id, name } }` |
| `combat.turn.ended` | `{ combat: { id, round }, combatant: {...} }` |
| `combat.initiative.changed` | `{ combat: { id, round }, combatant: {...}, initiative: number }` |
| `combat.active_combatant.changed` | `{ combat: { id, round }, combatant: {...} }` |

### Kreaturen

| Event | Payload-Zusatz |
|-------|---------------|
| `combatant.added` | `{ combat: {...}, combatant: {...} }` |
| `combatant.removed` | `{ combat: {...}, combatant: {...} }` |
| `combatant.updated` | `{ combat: {...}, combatant: {...} }` |
| `combatant.hp.changed` | `{ combat: {...}, combatant: {...}, previousHp, change, source? }` |
| `combatant.damaged` | `{ combat: {...}, combatant: {...}, damage, source? }` |
| `combatant.healed` | `{ combat: {...}, combatant: {...}, healing, source? }` |
| `combatant.died` | `{ combat: {...}, combatant: { id, name, type } }` |
| `combatant.recovered` | `{ combat: {...}, combatant: {...} }` |
| `combatant.initiative.changed` | `{ combat: {...}, combatant: {...}, initiative }` |

### Zustände und Effekte

| Event | Payload-Zusatz |
|-------|---------------|
| `condition.applied` | `{ combat: {...}, combatant: { id, name }, condition }` |
| `condition.removed` | `{ combat: {...}, combatant: { id, name }, condition }` |
| `condition.expired` | `{ combat: {...}, combatant: { id, name }, condition }` |
| `condition.updated` | `{ combat: {...}, combatant: { id, name }, condition }` |
| `effect.applied` | `{ combat: {...}, combatant: {...}, effect }` |
| `effect.removed` | `{ combat: {...}, combatant: {...}, effect }` |
| `effect.expired` | `{ combat: {...}, combatant: {...}, effect }` |
| `concentration.started` | `{ combat: {...}, combatant: { id, name }, condition }` |
| `concentration.ended` | `{ combat: {...}, combatant: { id, name }, condition }` |

### Weitere

| Event | Payload-Zusatz |
|-------|---------------|
| `action.executed` | `{ combat: {...}, combatant: {...}, action: string }` |
| `resource.changed` | `{ combat: {...}, combatant: {...}, resource, value }` |
| `encounter.loaded` | `{ encounter }` |
| `encounter.saved` | `{ encounter }` |
| `custom:<name>` | Beliebig |

### Beispiel: combat.turn.started

```json
{
  "event": "combat.turn.started",
  "timestamp": "2026-11-23T01:00:00Z",
  "combat": { "id": "combat-123", "round": 4 },
  "combatant": {
    "id": "character-456",
    "name": "Gandalf",
    "type": "player",
    "hp": 42,
    "maxHp": 60,
    "initiative": 18,
    "conditions": ["blessed"]
  },
  "previousCombatant": { "id": "character-789", "name": "Aragorn" }
}
```

## 7. Script-API-Referenz

In Automationen steht folgende globale Umgebung zur Verfügung:

### Globale Objekte

| Objekt | Beschreibung |
|--------|-------------|
| `event` | Das vollständige Event-Objekt (siehe Event-Katalog) |
| `console` | `log`, `error`, `warn`, `info` |
| `setTimeout` / `clearTimeout` | Timer (innerhalb des Sandbox-Timeouts) |
| `_setResult(value)` | Setzt das Automation-Ergebnis (History) |

### Integrationen (nur mit entsprechender Berechtigung)

| Objekt | Berechtigung | Methoden |
|--------|-------------|----------|
| `homeAssistant` | `homeassistant:call` / `homeassistant:read` | `callService(domain, service, data)`, `getState(entityId)`, `getStates()` |
| `audio` | `audio:play` | `play({ source, volume?, loop? })`, `stop()`, `setVolume(volume)` |
| `fetch` | `http:request` | Native `fetch` für HTTP-Requests |

### Beispiel-Automation

**Name:** Spieler am Zug — Lampe rot

**Event:** `combat.turn.started`

**Bedingung:**
```javascript
event.combatant.type === "player"
```

**Code:**
```javascript
await homeAssistant.callService(
  "light",
  "turn_on",
  {
    entity_id: "light.dnd_lampe",
    color_name: "red",
    brightness_pct: 100
  }
);
```

**Komplex: HP-abhängige Lichtszene**
```javascript
if (event.combatant.type === "player") {
  const hpPct = event.combatant.hp / event.combatant.maxHp;
  if (hpPct < 0.5) {
    await homeAssistant.callService("light", "turn_on", {
      entity_id: "light.dnd_lampe",
      color_name: "orange",
      brightness_pct: 60,
    });
  } else {
    await homeAssistant.callService("light", "turn_on", {
      entity_id: "light.dnd_lampe",
      color_name: "green",
      brightness_pct: 100,
    });
  }
}
```

### Sound bei Zustand "Vergiftet"
**Event:** `condition.applied`

**Bedingung:**
```javascript
event.condition.name === "Vergiftet"
```

**Code:**
```javascript
await audio.play({
  source: "/sounds/poison.mp3",
  volume: 0.8
});
```

## 8. Plugin-Entwicklung

Plugins sind eigenständige Module, die ohne Core-Änderungen neue Funktionalität hinzufügen.

### Plugin-Interface (TypeScript)

```typescript
interface Plugin {
  readonly definition: {
    name: string;
    version: string;
    description?: string;
    permissions?: AutomationPermission[];
    configSchema?: PluginConfigSchema;
  };
  config: Record<string, unknown>;

  onLoad(context: PluginContext): void | Promise<void>;
  onUnload?(): void | Promise<void>;
  getApi?(): PluginApi;
  getConfigSchema?(): PluginConfigSchema | undefined;
  setConfig?(config: Record<string, unknown>): void;
}
```

### PluginContext

| Property | Typ | Beschreibung |
|----------|-----|-------------|
| `eventBus` | `EventBus` | Zum Registrieren von Event-Handlern |
| `registerIntegration(name, api)` | Funktion | Macht eine API für Automation-Scripts verfügbar |
| `log(...args)` | Funktion | Protokollierung |

### Beispiel: Discord-Plugin

```typescript
import { Plugin } from "@repo/domain";

export class DiscordPlugin implements Plugin {
  readonly definition = {
    name: "discord",
    version: "1.0.0",
    description: "Sendet Kampf-Events an Discord",
    permissions: ["http:request"],
  };
  config = {};

  async onLoad(context) {
    context.eventBus.subscribe("combat.turn.started", async (_, payload) => {
      const c = payload.combatant as any;
      await fetch("https://discord.com/api/webhooks/...", {
        method: "POST",
        body: JSON.stringify({ content: `${c.name} ist am Zug!` }),
      });
    });
  }

  getApi() {
    return {
      sendMessage: (content: string) => fetch("...", { method: "POST", body: JSON.stringify({ content }) }),
    };
  }
}
```

Registrierung auf dem Server:
```typescript
pluginManager.register(new DiscordPlugin());
await pluginManager.load("discord");
```

Das Plugin-API steht dann in Automation-Scripts unter `discord.sendMessage(...)` zur Verfügung (mit entsprechender Berechtigung).

## 9. Home-Assistant-Integration

### Unterstützte Funktionen
- REST API: `callService`, `getState`, `getStates`
- WebSocket API: `subscribe_events`, `call_service`, automatischer Reconnect
- Steuerung von Lampen, Steckdosen, Szenen
- Abruf von Sensorwerten und Gerätestatus

### Nutzung aus Scripts
```javascript
await homeAssistant.callService("light", "turn_on", {
  entity_id: "light.wohnzimmer",
  rgb_color: [255, 0, 0],
  brightness_pct: 100,
});

const state = await homeAssistant.getState("sensor.temperatur");
```

## 10. Audio-Integration

### Unterstützte Funktionen
- Lokale und URL-basierte Audiodateien
- Soundeffekte und Hintergrundmusik
- Lautstärkesteuerung
- Wiedergabe stoppen / fortsetzen
- Mehrere Audioquellen (sequenziell)

### Nutzung aus Scripts
```javascript
await audio.play({
  source: "/sounds/turn-start.mp3",
  volume: 0.8
});

await audio.setVolume(0.5);
await audio.stop();
```

Die Audio-Befehle werden vom Server per SSE an den Client übertragen und dort im Browser abgespielt.

## 11. Sicherheit und Sandbox

- Scripts laufen in einer isolierten `vm`-Kontext-Umgebung
- Kein direkter Zugriff auf den internen Server-Prozess
- Berechtigungen sind pro Automation explizit konfigurierbar
- `homeassistant:call`, `homeassistant:read`, `audio:play`, `http:request`, `websocket:connect`, `file:read`, `file:write`
- Timeouts (konfigurierbar, Default 5s, Max 30s) verhindern blockierende Scripts
- Fehlerhafte Scripts stoppen nicht andere Automationen (Fehlerisolation)
- Execution-History mit Status, Error, Stacktrace und Duration

## 12. Fehlerdiagnose

| Symptom | Ursache | Lösung |
|---------|---------|--------|
| Automation wird nicht ausgeführt | Event passt nicht, Automation deaktiviert, fehlende Berechtigung | Event-Typ prüfen, `enabled: true`, `permissions` ergänzen |
| Script timeout | Endlosschleife, langsamer externer Aufruf | Timeout erhöhen, Code optimieren |
| Home Assistant Fehler | Falsche URL/Token, WebSocket nicht verbunden | `/automation/config/homeassistant/status` prüfen |
| Audio spielt nicht | Client-SSE nicht verbunden, Browser blockiert Autoplay | Seite neu laden, einmalig interagieren |
| Combatant nicht gefunden | Falsche ID (Name statt UUID) | Kampfanten-ID aus dem Kampf-Objekt verwenden |

### Logs
Alle Automation-Fehler werden mit Stacktrace in die Server-Konsole und in die Execution-History geschrieben. History-Endpunkt:

```http
GET /automation/:id/history?limit=50
```

## 13. Definition of Done (Szenarien)

| Szenario | Status |
|----------|--------|
| Spielerzug → Home Assistant Lampe einschalten + Farbe | Implementiert (Event `combat.turn.started` + Script) |
| Zustand "Vergiftet" → Sound abspielen | Implementiert (Event `condition.applied` + `audio.play`) |
| Zustand entfernt → eigene Automation | Implementiert (Event `condition.removed`) |
| Spieler < 50 % HP → andere Lichtszene | Implementiert (Bedingung + verzweigtes Script) |
| Neue Integration ohne Core-Änderung | Implementiert (Plugin-Architektur) |
| Fehlerhafte Automation blockiert nicht andere | Implementiert (Fehlerisolation pro Automation) |

## 14. Pfade (REST API)

### Kampf
```
GET    /combat                     # Liste
POST   /combat                     # Erstellen
GET    /combat/:id                 # Einzelner Kampf
DELETE /combat/:id                 # Löschen
POST   /combat/:id/start           # Starten
POST   /combat/:id/pause           # Pausieren
POST   /combat/:id/resume          # Fortsetzen
POST   /combat/:id/end             # Beenden
POST   /combat/:id/next            # Nächster Zug
POST   /combat/:id/previous        # Vorheriger Zug
POST   /combat/:id/skip            # Zug überspringen
POST   /combat/:id/combatants      # Kreatur hinzufügen
DELETE /combat/:id/combatants/:cid # Entfernen
PATCH  /combat/:id/combatants/:cid # Aktualisieren
POST   /combat/:id/combatants/:cid/hp   # TP ändern
POST   /combat/:id/combatants/:cid/temphp # Temp TP
POST   /combat/:id/combatants/:cid/initiative # Initiative
POST   /combat/:id/combatants/:cid/conditions # Zustand anwenden
DELETE /combat/:id/combatants/:cid/conditions/:condId # Zustand entfernen
```

### Begegnungen
```
GET    /combat/encounters          # Liste
POST   /combat/encounters          # Speichern
GET    /combat/encounters/:id      # Laden
POST   /combat/encounters/:id/load # In Kampf laden
```

### Automationen
```
GET    /automation                 # Liste
POST   /automation                 # Erstellen
GET    /automation/:id             # Einzelne
PATCH  /automation/:id             # Aktualisieren
DELETE /automation/:id             # Löschen
POST   /automation/:id/enabled     # Aktivieren/Deaktivieren
GET    /automation/:id/history     # Ausführungsverlauf
POST   /automation/config/homeassistant # HA konfigurieren
GET    /automation/config/homeassistant/status # HA Status
GET    /automation/stream          # SSE-Stream (Audio-Befehle)
```

### Plugins
```
GET    /plugin                     # Liste
GET    /plugin/:id                 # Einzelnes Plugin
POST   /plugin/:id/load            # Laden
POST   /plugin/:id/unload          # Entladen
POST   /plugin/:id/config          # Konfiguration
```

---

*Dokumentation entspricht dem Implementierungsstand des D&D Combat Manager mit Event- und Automation-System.*
