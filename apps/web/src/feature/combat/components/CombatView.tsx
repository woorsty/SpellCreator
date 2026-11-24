import React, { useEffect, useState } from "react";
import type { CombatState, Combatant, Condition } from "@repo/domain";
import { useCombatStore } from "../combatStore";
import { CombatantCard } from "./CombatantCard";
import { AddCombatantForm } from "./AddCombatantForm";
import { AddCreaturesFromList } from "./AddCreaturesFromList";
import { MonsterManager } from "./MonsterManager";
import { Button } from "../../../component/ui/Button";
import { Card } from "../../../component/ui/Card";
import { Badge } from "../../../component/ui/Badge";
import { Input } from "../../../component/ui/Input";

export function CombatView({ combat }: { combat: CombatState }) {
  const {
    nextTurn,
    previousTurn,
    skipTurn,
    startCombat,
    pauseCombat,
    resumeCombat,
    endCombat,
    addCombatant,
    addCombatants,
    fetchCreatures,
    creatures,
    creaturesLoading,
    addMonsterToCombat,
    fetchMonsters,
    monsters,
    monstersLoading,
    applyCondition,
  } = useCombatStore();

  const sorted = [...combat.combatants].sort(
    (a, b) => b.initiative - a.initiative || b.turnOrder - a.turnOrder,
  );
  const active = sorted[combat.currentTurnIndex ?? 0];

  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreaturesList, setShowCreaturesList] = useState(false);
  const [showMonsterManager, setShowMonsterManager] = useState(false);

  const handleAddCombatant = (combatant: Omit<Combatant, "turnOrder">) => {
    addCombatant(combatant);
    setShowAddForm(false);
  };

  const handleAddCreatures = (combatants: Omit<Combatant, "turnOrder">[]) => {
    addCombatants(combatants);
    setShowCreaturesList(false);
  };

  React.useEffect(() => {
    fetchCreatures();
    fetchMonsters();
  }, [fetchCreatures, fetchMonsters]);

  const handleApplyCondition = (combatantId: string) => {
    const name = window.prompt("Name des Zustands:");
    if (!name) return;
    const rounds = window.prompt("Runden (leer=dauerhaft):");
    applyCondition(combatantId, {
      id: `${name}-${Date.now()}`,
      name,
      rounds: rounds ? parseInt(rounds, 10) : undefined,
    });
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    preparing: { label: "Vorbereitung", color: "text-primary" },
    active: { label: "Aktiv", color: "text-success animate-glow" },
    paused: { label: "Pausiert", color: "text-warning" },
    ended: { label: "Beendet", color: "text-text-muted" },
  };
  const status = statusConfig[combat.status] ?? statusConfig.preparing;

  return (
    <div className="space-y-5">
      {/* Kampf-Header */}
      <Card variant="elevated" className="pt-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-text">
                {combat.name}
              </h1>
              <Badge
                variant={
                  combat.status === "active"
                    ? "success"
                    : combat.status === "paused"
                    ? "warning"
                    : combat.status === "ended"
                    ? "default"
                    : "primary"
                }
                className="px-3 py-1 text-xs font-bold"
              >
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <span>Runde {combat.round}</span>
              <span className="w-px h-3 bg-border mx-1"></span>
              <span>
                {active ? `Am Zug: {active.name}` : "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-end lg:justify-start">
            {combat.status === "preparing" && (
              <Button
                onClick={startCombat}
                className="w-full lg:w-auto lg:px-6"
              >
                Kampf starten
              </Button>
            )}
            {combat.status === "active" && (
              <>
                <Button onClick={pauseCombat} variant="secondary" size="sm" className="w-full lg:w-auto">
                  Pausieren
                </Button>
                <Button onClick={endCombat} variant="danger" size="sm" className="w-full lg:w-auto">
                  Beenden
                </Button>
              </>
            )}
            {combat.status === "paused" && (
              <Button onClick={resumeCombat} variant="success" size="sm" className="w-full lg:w-auto">
                Fortsetzen
              </Button>
            )}
            {combat.status === "ended" && (
              <Button variant="secondary" size="sm" disabled className="w-full lg:w-auto opacity-50 cursor-not-allowed">
                Beendet
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Steuerung */}
      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={previousTurn}
          disabled={combat.status !== "active"}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          ← Vorheriger Zug
        </Button>
        <Button
          onClick={nextTurn}
          disabled={combat.status !== "active"}
          className="flex-1"
        >
          Nächster Zug →
        </Button>
        <Button
          onClick={skipTurn}
          disabled={combat.status !== "active"}
          variant="secondary"
          size="sm"
        >
          Überspringen
        </Button>
        <Button
          onClick={() => setShowAddForm((prev) => !prev)}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          {showAddForm ? "Formular schließen" : "+ Kreatur"}
        </Button>
        <Button
          onClick={() => setShowCreaturesList((prev) => !prev)}
          variant="secondary"
          size="sm"
          className="flex-1"
          disabled={creaturesLoading}
        >
          {creaturesLoading ? "Lade Charaktere..." : "Spieler hinzufügen"}
        </Button>
        <Button
          onClick={() => setShowMonsterManager((prev) => !prev)}
          variant="secondary"
          size="sm"
          className="flex-1"
          disabled={monstersLoading}
        >
          {monstersLoading ? "Lade Kreaturen..." : "Kreaturen verwalten"}
        </Button>
      </div>

      {showAddForm && (
        <AddCombatantForm
          open={true}
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddCombatant}
        />
      )}

      {showCreaturesList && (
        <AddCreaturesFromList
          open={true}
          onClose={() => setShowCreaturesList(false)}
          onAdd={handleAddCreatures}
          creatures={creatures}
          loading={creaturesLoading}
        />
      )}

      {showMonsterManager && (
        <MonsterManager
          open={true}
          onClose={() => setShowMonsterManager(false)}
        />
      )}

      {/* Initiativleiste (horizontal) */}
      <div className="relative">
        <div
          className="flex gap-2 overflow-x-auto pb-6 border-b border-border scrollbar-hide custom-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {sorted.length === 0 && (
            <div className="flex items-center justify-center py-20 text-text-muted text-sm">
              Keine Kreaturen im Kampf. Füge eine Kreatur hinzu.
            </div>
          )}
          {sorted.map((c) => (
            <CombatantCard
              key={c.id}
              combatant={c}
              isActive={c.id === active?.id}
              isDead={c.isDead}
            />
          ))}
        </div>
        {/* Scroll-Indikatoren */}
        {sorted.length > 0 && (
          <>
            <button
              className="absolute left-0 top-0 bottom-0 flex items-center pl-2 bg-gradient-to-r from-bg via-bg to-transparent hover:from-bg/80 transition-colors"
              onClick={() => {}}
            />
            <button
              className="absolute right-0 top-0 bottom-0 flex items-center pr-2 bg-gradient-to-l from-bg via-bg to-transparent hover:from-bg/80 transition-colors"
              onClick={() => {}}
            />
          </>
        )}
      </div>

      <div className="pt-2 text-xs text-text-muted">
        Tastatur: N = nächster Zug, P = vorheriger Zug, Leertaste = Pause/Fortsetzen
      </div>
    </div>
  );
}
