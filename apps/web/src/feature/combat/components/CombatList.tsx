import React, { useEffect } from "react";
import type { CombatState } from "@repo/domain";
import { useCombatStore } from "../combatStore";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../component/ui/Card";
import { Button } from "../../../component/ui/Button";
import { Badge } from "../../../component/ui/Badge";

export function CombatList() {
  const { combats, fetchCombats, createCombat, deleteCombat } = useCombatStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCombats();
  }, []);

  const handleCreate = () => {
    const name = window.prompt("Name des Kampfes:");
    if (name) createCombat(name);
  };

  const openCombat = (combat: CombatState) => {
    navigate(`/combat/${combat.id}`);
  };

  const statusConfig: Record<string, { label: string; variant: "primary" | "success" | "warning" | "default" }> = {
    active: { label: "Aktiv", variant: "success" },
    paused: { label: "Pausiert", variant: "warning" },
    ended: { label: "Beendet", variant: "default" },
    preparing: { label: "Bereit", variant: "primary" },
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text dnd-gradient-text">
            Kampfverwaltung
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Erstelle und verwalte Begegnungen für deine D&D-Sessions.
          </p>
        </div>
        <Button onClick={handleCreate} className="px-6 py-3 text-sm">
          + Neuer Kampf
        </Button>
      </div>

      {combats.length === 0 && (
        <Card variant="elevated" className="text-center py-20">
          <div className="text-4xl mb-4 text-text-muted">⚔️</div>
          <h3 className="text-lg font-medium text-text mb-2">Noch keine Kämpfe</h3>
          <p className="text-text-muted text-sm max-w-xs mx-auto">
            Erstelle einen neuen Kampf, um deine Begegnung zu verwalten.
          </p>
          <Button
            onClick={handleCreate}
            className="mt-4"
          >
            Erster Kampf erstellen
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combats.map((combat) => {
          const status = statusConfig[combat.status] ?? statusConfig.preparing;
          return (
            <Card
              key={combat.id}
              variant="elevated"
              className="cursor-pointer group hover:border-primary/50 transition-all duration-200"
              onClick={() => openCombat(combat)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-serif font-semibold text-text group-hover:text-primary">
                  {combat.name}
                </h3>
                <Badge variant={status.variant} className="px-2 py-0.5 text-[10px]">
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                <span>Runde {combat.round}</span>
                <span className="w-px h-3 bg-border mx-1"></span>
                <span>{combat.combatants.length} Kreaturen</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCombat(combat);
                  }}
                >
                  Öffnen
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Kampf wirklich löschen?")) {
                      void deleteCombat(combat.id);
                    }
                  }}
                  className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded"
                >
                  🗑️
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
