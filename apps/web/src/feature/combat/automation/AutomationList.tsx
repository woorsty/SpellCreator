import React from "react";
import { useAutomationStore } from "./AutomationStore";
import { Card } from "../../../component/ui/Card";
import { Button } from "../../../component/ui/Button";
import { Badge } from "../../../component/ui/Badge";
import { Input } from "../../../component/ui/Input";
import { Separator } from "../../../component/ui/Separator";

const EVENT_LABELS: Record<string, string> = {
  "combat.turn.started": "Zug beginnt",
  "combat.turn.ended": "Zug endet",
  "combat.round.started": "Runde beginnt",
  "combat.round.ended": "Runde endet",
  "combat.started": "Kampf startet",
  "combat.ended": "Kampf endet",
  "combat.paused": "Kampf pausiert",
  "combat.resumed": "Kampf fortgesetzt",
  "combatant.added": "Kreatur hinzugefügt",
  "combatant.removed": "Kreatur entfernt",
  "combatant.hp.changed": "TP verändert",
  "combatant.damaged": "Schaden",
  "combatant.healed": "Heilung",
  "combatant.died": "Kreatur stirbt",
  "condition.applied": "Zustand hinzugefügt",
  "condition.removed": "Zustand entfernt",
  "condition.expired": "Zustand abgelaufen",
  "encounter.loaded": "Begegnung geladen",
  "encounter.saved": "Begegnung gespeichert",
};

export function AutomationList() {
  const {
    automations,
    setEnabled,
    deleteAutomation,
    selectAutomation,
    fetchAutomations,
    haConfigured,
    fetchHAStatus,
  } = useAutomationStore();

  const handleToggle = (id: string, enabled: boolean) => {
    void setEnabled(id, enabled);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text dnd-gradient-text">
            Automationen
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Erstelle eigene JavaScript-Automationen auf Combat-Events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchHAStatus}
            variant="secondary"
            size="sm"
            className={`px-3 py-2 text-xs ${
              haConfigured
                ? "bg-success/10 text-success border-success/30"
                : "bg-surface-2 text-text-muted border-border"
            }`}
          >
            {haConfigured ? "Home Assistant verbunden" : "Home Assistant"}
          </Button>
          <Button asChild className="ml-2">
            <a href="/combat/automations/new">
              + Automation
            </a>
          </Button>
        </div>
      </div>

      {!haConfigured && (
        <Card variant="outlined" className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-warning">⚠️</span>
            <div>
              <p className="text-sm text-text mt-1">
                Home Assistant ist noch nicht konfiguriert. Smart-Home-Automationen benötigen eine URL und ein Token.
              </p>
            </div>
          </div>
        </Card>
      )}

      {automations.length === 0 && (
        <Card variant="elevated" className="text-center py-16">
          <div className="text-4xl mb-4 text-text-muted">🤖</div>
          <h3 className="text-lg font-medium text-text mb-2">Noch keine Automationen</h3>
          <p className="text-text-muted text-sm max-w-xs mx-auto mb-4">
            Erstelle eine Automation, um auf Kampf-Events zu reagieren.
          </p>
          <Button asChild>
            <a href="/combat/automations/new">Erste Automation erstellen</a>
          </Button>
        </Card>
      )}

      <Separator />

      <div className="space-y-2">
        {automations.map((a) => (
          <Card
            key={a.id}
            variant="elevated"
            className="cursor-pointer group hover:border-primary/50 transition-all duration-200"
            onClick={() => void selectAutomation(a.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-semibold text-text group-hover:text-primary">
                  {a.name}
                </h3>
                <Badge
                  variant={a.enabled ? "success" : "default"}
                  className="px-2 py-0.5 text-[10px]"
                >
                  {a.enabled ? "Aktiv" : "Inaktiv"}
                </Badge>
              </div>
              <span className="text-xs text-text-muted truncate max-w-xs">
                {a.event}
              </span>
            </div>
            {a.description && (
              <p className="text-sm text-text-muted mb-3">{a.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{EVENT_LABELS[a.event] ?? a.event}</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleToggle(a.id, !a.enabled);
                  }}
                  className="p-1.5 rounded text-text-muted hover:text-white hover:bg-surface-2 transition-colors"
                  title={a.enabled ? "Deaktivieren" : "Aktivieren"}
                >
                  {a.enabled ? "🔕" : "🔔"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Automation wirklich löschen?")) {
                      void deleteAutomation(a.id);
                    }
                  }}
                  className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                  title="Löschen"
                >
                  🗑️
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
