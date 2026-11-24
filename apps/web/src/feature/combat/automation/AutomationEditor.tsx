import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Automation, AutomationPermission } from "@repo/domain";
import { useAutomationStore } from "./AutomationStore";
import { Card } from "../../../component/ui/Card";
import { Button } from "../../../component/ui/Button";
import { Input } from "../../../component/ui/Input";
import { Textarea } from "../../../component/ui/Textarea";
import { Select } from "../../../component/ui/Select";
import { Label } from "../../../component/ui/Label";
import { Badge } from "../../../component/ui/Badge";
import { Separator } from "../../../component/ui/Separator";

const PERMISSION_LABELS: Record<AutomationPermission, string> = {
  "homeassistant:call": "Home Assistant: Dienste aufrufen",
  "homeassistant:read": "Home Assistant: Zustände lesen",
  "audio:play": "Audio: Wiedergabe steuern",
  "http:request": "HTTP-Requests (fetch)",
  "websocket:connect": "WebSocket-Verbindungen",
  "file:read": "Dateien lesen",
  "file:write": "Dateien schreiben",
};

const DEFAULT_CODE = `// Beispiel: Bei Spielzug einer Kreatur mit < 50 % TP eine andere Lampe steuern
if (event.combatant.type === "player") {
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
}
`;

const EVENT_OPTIONS = [
  "combat.turn.started",
  "combat.turn.ended",
  "combat.round.started",
  "combat.round.ended",
  "combat.started",
  "combat.ended",
  "combatant.added",
  "combatant.removed",
  "combatant.hp.changed",
  "combatant.damaged",
  "combatant.healed",
  "combatant.died",
  "condition.applied",
  "condition.removed",
  "condition.expired",
  "encounter.loaded",
  "encounter.saved",
] as const;

export function AutomationEditor() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    automations,
    selected,
    loading,
    error,
    createAutomation,
    updateAutomation,
  } = useAutomationStore();

  const [name, setName] = useState(selected?.name ?? "");
  const [description, setDescription] = useState(selected?.description ?? "");
  const [event, setEvent] = useState(selected?.event ?? "combat.turn.started");
  const [condition, setCondition] = useState(selected?.condition ?? "");
  const [code, setCode] = useState(selected?.code ?? DEFAULT_CODE);
  const [permissions, setPermissions] = useState<AutomationPermission[]>(
    selected?.permissions ?? [],
  );
  const [enabled, setEnabledLocal] = useState(selected?.enabled ?? false);
  const [errorLocal, setErrorLocal] = useState("");

  const isNew = !id;
  const existing = selected || automations.find((a) => a.id === id);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorLocal("Name ist erforderlich");
      return;
    }
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      event,
      condition: condition.trim() || undefined,
      code,
      permissions,
      enabled,
    };
    try {
      if (isNew) {
        await createAutomation(payload as any);
      } else if (existing) {
        await updateAutomation(existing.id, payload as any);
      }
      navigate("/combat/automations");
    } catch (err) {
      setErrorLocal((err as Error).message);
    }
  };

  const togglePermission = (p: AutomationPermission) => {
    setPermissions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="/combat/automations">← Zurück zu Automationen</a>
          </Button>
          <h1 className="text-2xl font-serif font-bold text-text ml-2">
            {isNew ? "Neue Automation" : "Automation bearbeiten"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Speichern..." : "Speichern"}
        </Button>
      </div>

      {error && (
        <Card variant="outlined" className="p-3 border-red-500/30">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}
      {errorLocal && (
        <Card variant="outlined" className="p-3 border-red-500/30">
          <p className="text-sm text-red-300">{errorLocal}</p>
        </Card>
      )}

      <form onSubmit={handleSave} className="space-y-5 bg-surface p-6 rounded-xl border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="z. B. Spieler am Zug"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnabledLocal(e.target.checked)}
                className="rounded bg-surface border-border text-primary focus:ring-primary"
              />
              Aktiviert
            </label>
          </div>
        </div>

        <div>
          <Label>Beschreibung</Label>
          <Textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={2}
            placeholder="Was bewirkt diese Automation?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Auslösendes Event</Label>
            <Select
              value={event}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(e.target.value as any)}
            >
              {EVENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Bedingung (optional)</Label>
            <Textarea
              value={condition}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCondition(e.target.value)}
              rows={3}
              placeholder="event.combatant.type === 'player'"
            />
            <p className="text-[10px] text-text-muted mt-1">
              Wird vor dem Code ausgewertet. Muss truthy sein, damit der Code läuft.
            </p>
          </div>
        </div>

        <div>
          <Label>Code (JavaScript, async/await unterstützt)</Label>
          <div className="relative">
            <textarea
              value={code}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
              rows={16}
              className="w-full px-3 py-2.5 rounded bg-[#0d1117] border border-gray-700 text-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none font-mono text-sm leading-relaxed resize-y"
              spellCheck={false}
            />
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            Verfügbare Objekte:{" "}
            <code className="text-primary">event</code>,{" "}
            <code className="text-primary">homeAssistant</code>,{" "}
            <code className="text-primary">audio</code>,{" "}
            <code className="text-primary">fetch</code>,{" "}
            <code className="text-primary">console</code>,{" "}
            <code className="text-primary">setTimeout</code>
          </p>
        </div>

        <div>
          <Label className="flex items-center justify-between">
            Berechtigungen
            <Badge variant="info" className="text-[10px] px-2 py-1">
              {permissions.length} gewählt
            </Badge>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => togglePermission(key as AutomationPermission)}
                className={`text-left px-3 py-2 rounded text-xs border transition-colors ${
                  permissions.includes(key as AutomationPermission)
                    ? "bg-primary/10 text-primary border-primary/50"
                    : "bg-transparent text-text-muted border-border hover:border-text-muted/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Separator />
        <div className="pt-2">
          <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wider font-medium">
            Beispiele
          </p>
          <button
            type="button"
            onClick={() => {
              setName("Lampe rot bei Spielzug");
              setDescription("Schaltet die D&D-Lampe auf Rot, wenn ein Spieler am Zug ist.");
              setEvent("combat.turn.started");
              setCondition("event.combatant.type === 'player'");
              setCode(`await homeAssistant.callService("light", "turn_on", {
  entity_id: "light.dnd_lampe",
  color_name: "red",
  brightness_pct: 100,
});`);
              setPermissions(["homeassistant:call"]);
            }}
            className="text-xs text-primary hover:text-primary/80 underline block mb-1"
          >
            › Lampe rot bei Spielzug
          </button>
          <button
            type="button"
            onClick={() => {
              setName("Sound bei Vergiftet");
              setDescription("Spielt einen Sound, wenn eine Kreatur vergiftet wird.");
              setEvent("condition.applied");
              setCondition('event.condition.name === "Vergiftet"');
              setCode(`await audio.play({
  source: "/sounds/poison.mp3",
  volume: 0.8,
});`);
              setPermissions(["audio:play"]);
            }}
            className="text-xs text-primary hover:text-primary/80 underline block"
          >
            › Sound bei Zustand "Vergiftet"
          </button>
        </div>
      </form>

      <Card variant="elevated" className="p-5">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          API-Referenz (auszugsweise)
        </h3>
        <div className="space-y-1 text-xs text-text-muted font-mono">
          <div>await homeAssistant.callService(domain, service, data)</div>
          <div>await homeAssistant.getState(entity_id)</div>
          <div>await homeAssistant.getStates()</div>
          <div>{`await audio.play({ source, volume, loop })`}</div>
          <div>await audio.stop()</div>
          <div>await audio.setVolume(volume)</div>
          <div>await fetch(url, options)</div>
          <div>console.log(...) / console.error(...)</div>
          <div>setTimeout(fn, ms) / clearTimeout(id)</div>
        </div>
      </Card>
    </div>
  );
}
