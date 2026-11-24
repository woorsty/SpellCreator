# Sammlung direkt nutzbarer Automationsbeispiele

Diese Beispiele können über die Automation-UI (Neue Automation) kopiert und eingefügt werden.
Home-Assistant-bezogene Beispiele benötigen eine konfigurierte HA-Integration
(POST /automation/config/homeassistant).

## 1. Spieler am Zug — Lampe auf Rot

**Name:** Spieler am Zug — Lampe rot  
**Event:** `combat.turn.started`  
**Berechtigungen:** `homeassistant:call`

Bedingung:
```javascript
event.combatant.type === "player"
```

Code:
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

---

## 2. Zustand "Vergiftet" — Sound abspielen

**Name:** Sound bei Vergiftet  
**Event:** `condition.applied`  
**Berechtigungen:** `audio:play`

Bedingung:
```javascript
event.condition.name === "Vergiftet"
```

Code:
```javascript
await audio.play({
  source: "/sounds/poison.mp3",
  volume: 0.8
});
```

---

## 3. Zustand entfernt — eigene Automation

**Name:** Zustand entfernt — Log  
**Event:** `condition.removed`  
**Berechtigungen:** (keine)

Code:
```javascript
console.log(`Zustand ${event.condition.name} von ${event.combatant.name} entfernt`);
_setResult(`condition ${event.condition.name} removed from ${event.combatant.name}`);
```

---

## 4. Spieler < 50 % HP — andere Lichtszene

**Name:** HP-abhängige Lichtszene  
**Event:** `combat.turn.started`  
**Berechtigungen:** `homeassistant:call`

Bedingung:
```javascript
event.combatant.type === "player"
```

Code:
```javascript
const hpPct = event.combatant.hp / event.combatant.maxHp;
if (hpPct < 0.5) {
  await homeAssistant.callService("light", "turn_on", {
    entity_id: "light.dnd_lampe_schwach",
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
```

---

## 5. Kampf startet — Szene "Kampfbeginn"

**Name:** Kampfbeginn — Szene  
**Event:** `combat.started`  
**Berechtigungen:** `homeassistant:call`

Code:
```javascript
await homeAssistant.callService("scene", "turn_on", {
  entity_id: "scene.combat_start",
});
await audio.play({
  source: "/sounds/combat_start.mp3",
  volume: 0.7,
});
```

---

## 6. Kreatur stirbt — Sound + Lampe blinkt

**Name:** Kreatur stirbt  
**Event:** `combatant.died`  
**Berechtigungen:** `homeassistant:call`, `audio:play`

Code:
```javascript
await audio.play({
  source: "/sounds/death.mp3",
  volume: 0.9,
});
await homeAssistant.callService("light", "turn_on", {
  entity_id: "light.dnd_lampe",
  color_name: "red",
  brightness_pct: 100,
  flash: 5,
});
```

---

## 7. Runde beginnt — Hintergrundmusik leiser

**Name:** Runde beginnt — Musik leiser  
**Event:** `combat.round.started`  
**Berechtigungen:** `homeassistant:call`

Code:
```javascript
await homeAssistant.callService("media_player", "volume_set", {
  entity_id: "media_player.lautsprecher",
  volume_level: 0.3,
});
```

---

## 8. Spieler konzentriert sich — Lampe blau

**Name:** Konzentration — blaue Lampe  
**Event:** `concentration.started`  
**Berechtigungen:** `homeassistant:call`

Bedingung:
```javascript
event.combatant.type === "player"
```

Code:
```javascript
await homeAssistant.callService("light", "turn_on", {
  entity_id: "light.dnd_lampe",
  color_name: "blue",
  brightness_pct: 80,
});
```

---

## 9. HTTP-Webhook bei Zugende

**Name:** Webhook bei Zugende  
**Event:** `combat.turn.ended`  
**Berechtigungen:** `http:request`

Code:
```javascript
await fetch("https://mein-server.de/webhook/dnd-turn", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    combatant: event.combatant.name,
    round: event.combat.round,
  }),
});
```

---

## 10. Eigene Integration (Plugin-Beispiel)

Ein Plugin kann eine eigene API exponieren, die dann in Scripts verfügbar ist:

```javascript
// Verfügbar nach Registrierung eines Plugins "discord"
await discord.sendMessage(`${event.combatant.name} ist am Zug!`);
```

Das Plugin selbst wird im Core registriert (z. B. `pluginManager.register(new DiscordPlugin())`) und stellt seine Methoden unter dem Plugin-Namen in der Script-Umgebung bereit.

---

### Hinweis zu Berechtigungen

Jede Automation benötigt die Berechtigungen für die Integrationen, die sie nutzt. Ohne `homeassistant:call` ist `homeAssistant` im Script `undefined`. Ohne `audio:play` ist `audio` nicht verfügbar. Dies verhindert den unkontrollierten Zugriff auf externe Systeme.
