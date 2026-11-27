import React, { useEffect, useState } from "react";
import type { CombatState, Combatant, Condition } from "@repo/domain";
import { useCombatStore } from "../combatStore";
import { CombatantCard } from "./CombatantCard";
import { AddCombatantForm } from "./AddCombatantForm";
import { AddCreaturesFromList } from "./AddCreaturesFromList";
import { ApplyConditionDialog } from "./ApplyConditionDialog";

import { Button } from "../../../component/ui/Button";
import { MonsterManager } from "./MonsterManager";
import { characterSheetToCombatant } from "../utils/creatureToCombatant";
import { exportEncounter, exportEncounters } from "../utils/export";
import { parseImprovedInitiative } from "../utils/improvedInitiativeImport";
import { FolderGroups } from "./FolderGroups";
import { Card } from "../../../component/ui/Card";
import { Badge } from "../../../component/ui/Badge";
import { Dialog } from "../../../component/ui/Dialog";
import { Input } from "../../../component/ui/Input";

function attributeModifier(score: number | undefined): string {
  if (score === undefined) return "–";
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
}

export function CombatView({ combat }: { combat: CombatState }) {
  const {
    nextTurn,
    previousTurn,
    skipTurn,
    startCombat,
    pauseCombat,
    resumeCombat,
    setInitiative,

    addCombatant,
    addCombatants,
    fetchCreatures,
    creatures,
    creaturesLoading,
    addMonsterToCombat,
    fetchMonsters,
    monsters,
    monstersLoading,
    encounters,
    fetchEncounters,
    saveEncounter,
    importBundle,
  } = useCombatStore();

  const sorted = [...(combat.combatants ?? [])].sort(
    (a, b) => b.initiative - a.initiative || b.turnOrder - a.turnOrder,
  );
  const active = sorted[combat.currentTurnIndex ?? 0];
  const [selectedId, setSelectedId] = useState<string | undefined>(active?.id);

  const [showAddForm, setShowAddForm] = useState(false);
const [showSaveEncounter, setShowSaveEncounter] = useState(false);
const [saveName, setSaveName] = useState("");
const [saveFolder, setSaveFolder] = useState("");
const [savePlayers, setSavePlayers] = useState(false);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [showInitDialog, setShowInitDialog] = useState(false);
  const [initValues, setInitValues] = useState<Record<string, number>>({});

  const openStartDialog = () => {
    const vals: Record<string, number> = {};
    combat.combatants.forEach((c) => {
      const dexMod = Math.floor(((c.dexterity ?? 10) - 10) / 2);
      vals[c.id] =
        Math.floor(Math.random() * 20) +
        1 +
        (c.initiative ?? 0) +
        (c.initiativeModifier ?? 0) +
        dexMod;
    });
    setInitValues(vals);
    setShowInitDialog(true);
  };

  const confirmStart = async () => {
    for (const c of combat.combatants) {
      await setInitiative(c.id, initValues[c.id]);
    }
    setShowInitDialog(false);
    await startCombat();
  };
  const [leftTab, setLeftTab] = useState<
    "creatures" | "players" | "encounters"
  >("creatures");
  const [showCreaturesList, setShowCreaturesList] = useState(false);
  const [showConditionDialog, setShowConditionDialog] = useState<{
    open: boolean;
    combatantId: string | undefined;
  }>({ open: false, combatantId: undefined });

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
    fetchEncounters();
  }, [fetchCreatures, fetchMonsters, fetchEncounters]);

  const handleApplyCondition = (combatantId: string) => {
    setShowConditionDialog({ open: true, combatantId });
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const bundle = parseImprovedInitiative(JSON.parse(text));
      await importBundle(bundle);
      const parts = [
        `${bundle.monsters.length} Monster`,
        `${bundle.players.length} Spieler`,
        `${bundle.encounters.length} Encounters`,
      ];
      alert(`Import abgeschlossen: ${parts.join(", ")}`);
    } catch (err) {
      alert("Import fehlgeschlagen: " + (err as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    preparing: { label: "Vorbereitung", color: "text-primary" },
    active: { label: "Aktiv", color: "text-success animate-glow" },
    paused: { label: "Pausiert", color: "text-warning" },
  };
  const status = statusConfig[combat.status] ?? statusConfig.preparing;

  const selected = sorted.find((c) => c.id === selectedId) ?? active;

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <Card variant="elevated" className="shrink-0">
        <div className="flex items-center justify-between gap-4 p-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-serif font-bold text-text">
              {combat.name}
            </h1>
            <Badge
              variant={
                combat.status === "active"
                  ? "success"
                  : combat.status === "paused"
                    ? "warning"
                    : "default"
              }
              className="px-2 py-0.5 text-xs font-bold"
            >
              {status.label}
            </Badge>
            <span className="text-text-muted text-sm font-serif">
              Runde {combat.round}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {combat.status === "preparing" && (
              <Button onClick={openStartDialog} size="sm">
                Kampf starten
              </Button>
            )}
            {combat.status === "active" && (
              <Button onClick={pauseCombat} variant="secondary" size="sm">
                Pausieren
              </Button>
            )}
            {combat.status === "paused" && (
              <Button onClick={resumeCombat} variant="success" size="sm">
                Fortsetzen
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-1 min-h-0">
        {/* Left: tabs */}
        <div className="w-[28rem] shrink-0 border-r border-border flex flex-col">
          <div className="flex border-b border-border">
            {(["creatures", "players", "encounters"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setLeftTab(t)}
                className={`flex-1 text-xs py-2 ${leftTab === t ? "border-b-2 border-primary text-primary" : "text-text-muted"}`}
              >
                {t === "creatures"
                  ? "Kreaturen"
                  : t === "players"
                    ? "Spieler"
                    : "Encounters"}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {leftTab === "creatures" && (
              <MonsterManager open onClose={() => {}} />
            )}
            {leftTab === "players" && (
              <div className="space-y-2">
                {creatures.length === 0 ? (
                  <div className="py-6 text-center text-text-muted text-sm">
                    Keine Spieler vorhanden.
                  </div>
                ) : (
                  <FolderGroups
                    items={creatures}
                    getFolder={(c) => c.folder}
                    getId={(c) => c.name}
                    renderItem={(c) => (
                      <button
                        onClick={() =>
                          addCombatant(characterSheetToCombatant(c, true))
                        }
                        className="w-full text-left p-2 rounded bg-surface-2 text-sm"
                      >
                        {c.name}
                      </button>
                    )}
                  />
                )}
              </div>
            )}
            {leftTab === "encounters" && (
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSaveName(combat.name);
                    setSaveFolder("");
                    setSavePlayers(false);
                    setShowSaveEncounter(true);
                  }}
                >
                  Aktuellen Kampf speichern
                </Button>
                <input
                  ref={importInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportFile}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  disabled={importing}
                  onClick={() => importInputRef.current?.click()}
                >
                  {importing ? "Importiere…" : "Importieren (Improved Initiative)"}
                </Button>
                {encounters.length > 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => exportEncounters(encounters)}
                  >
                    Alle Encounters exportieren
                  </Button>
                )}
                <FolderGroups
                  items={encounters}
                  getFolder={(e) => e.folder}
                  getId={(e) => e.id}
                  renderItem={(e) => (
                    <div className="flex items-center gap-1 bg-surface-2 rounded">
                      <button
                        onClick={async () => {
                          await addCombatants(e.combatants);
                        }}
                        className="flex-1 text-left p-2 text-sm"
                      >
                        {e.name}
                      </button>
                      <button
                        onClick={() => exportEncounter(e)}
                        title="Encounter exportieren"
                        aria-label={`Encounter ${e.name} exportieren`}
                        className="p-2 text-text-muted hover:text-text text-sm"
                      >
                        ⬇️
                      </button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
          <div className="shrink-0 p-3 border-t border-border">
            <Button
              size="sm"
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              + Kreatur
            </Button>
          </div>
        </div>

        {/* Center: Initiative list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex gap-2 mb-2">
            <Button
              onClick={previousTurn}
              disabled={combat.status !== "active"}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              ←
            </Button>
            <Button
              onClick={nextTurn}
              disabled={combat.status !== "active"}
              size="sm"
              className="flex-1"
            >
              →
            </Button>
          </div>
          {sorted.length === 0 && (
            <div className="py-10 text-center text-text-muted text-sm">
              Keine Kreaturen im Kampf.
            </div>
          )}
          {sorted.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className="cursor-pointer"
            >
              <CombatantCard
                combatant={c}
                isActive={c.id === active?.id}
                isDead={c.isDead}
              />
            </div>
          ))}
        </div>

        {/* Right: Details */}
        <div className="w-80 shrink-0 border-l border-border p-3 overflow-y-auto">
          <h3 className="font-serif font-semibold text-text mb-2">Details</h3>
          {selected ? (
            <div className="text-sm space-y-2">
              <div className="text-lg font-serif font-bold text-text">
                {selected.name}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-2 rounded p-2">
                  <div className="text-xs text-text-muted">TP</div>
                  <div className="font-medium text-text">
                    {selected.hp}/{selected.maxHp}
                  </div>
                </div>
                <div className="bg-surface-2 rounded p-2">
                  <div className="text-xs text-text-muted">AC</div>
                  <div className="font-medium text-text">
                    {selected.armorClass}
                  </div>
                </div>
                <div className="bg-surface-2 rounded p-2">
                  <div className="text-xs text-text-muted">INI</div>
                  <div className="font-medium text-text">
                    {selected.initiative}
                  </div>
                </div>
                <div className="bg-surface-2 rounded p-2">
                  <div className="text-xs text-text-muted">Bewegung</div>
                  <div className="font-medium text-text">
                    {selected.movementRate} m
                  </div>
                </div>
                <div className="bg-surface-2 rounded p-2">
                  <div className="text-xs text-text-muted">HG</div>
                  <div className="font-medium text-text">
                    {selected.challengeRating}
                  </div>
                </div>
              </div>
              <div className="bg-surface-2 rounded p-2">
                <div className="text-xs text-text-muted mb-1">Attribute</div>
                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  {[
                    { label: "STR", value: selected.strength },
                    { label: "GES", value: selected.dexterity },
                    { label: "KON", value: selected.constitution },
                    { label: "INT", value: selected.intelligence },
                    { label: "WEI", value: selected.wisdom },
                    { label: "CHA", value: selected.charisma },
                  ].map((attr) => (
                    <div key={attr.label} className="bg-surface-2 rounded p-2">
                      <div className="text-text-muted">{attr.label}</div>
                      <div className="font-medium text-text">
                        {attr.value ?? "–"}
                      </div>
                      <div className="text-text-muted text-[10px]">
                        Mod: {attributeModifier(attr.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selected.senses?.length ? (
                <div>
                  <span className="font-medium text-text">Sinne:</span>{" "}
                  {selected.senses.join(", ")}
                </div>
              ) : null}
              {selected.languages?.length ? (
                <div>
                  <span className="font-medium text-text">Sprachen:</span>{" "}
                  {selected.languages.join(", ")}
                </div>
              ) : null}
              {selected.damageResistances?.length ? (
                <div>
                  <span className="font-medium text-text">Resistenzen:</span>{" "}
                  {selected.damageResistances.join(", ")}
                </div>
              ) : null}
              {selected.damageImmunities?.length ? (
                <div>
                  <span className="font-medium text-text">Immunitäten:</span>{" "}
                  {selected.damageImmunities.join(", ")}
                </div>
              ) : null}
              {selected.conditionImmunities?.length ? (
                <div>
                  <span className="font-medium text-text">
                    Status-Immunitäten:
                  </span>{" "}
                  {selected.conditionImmunities.join(", ")}
                </div>
              ) : null}
              {selected.traits?.length ? (
                <div className="mt-2">
                  <div className="font-medium text-text mb-1">Merkmale</div>
                  {selected.traits.map((t, i) => (
                    <div key={i} className="mb-2 p-2 bg-surface-2 rounded">
                      <span className="font-medium text-text">{t.name}</span>
                      <div className="text-text-muted">{t.description}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {selected.actions?.length ? (
                <div className="mt-2">
                  <div className="font-medium text-text mb-1">Aktionen</div>
                  {selected.actions.map((a, i) => (
                    <div key={i} className="mb-2 p-2 bg-surface-2 rounded">
                      <span className="font-medium text-text">{a.name}</span>
                      <div className="text-text-muted">{a.description}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-text-muted text-sm">Keine Auswahl</div>
          )}
        </div>
      </div>

      {showInitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold mb-3">Initiative würfeln</h3>
            {combat.combatants.map((c) => (
              <div key={c.id} className="flex items-center gap-2 mb-2">
                <span className="flex-1 text-sm">{c.name}</span>
                <Input
                  type="number"
                  value={initValues[c.id] ?? 0}
                  onChange={(e) =>
                    setInitValues((v) => ({
                      ...v,
                      [c.id]: Number(e.target.value),
                    }))
                  }
                  className="w-20"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <Button onClick={confirmStart} size="sm">
                Starten
              </Button>
              <Button
                onClick={() => setShowInitDialog(false)}
                variant="secondary"
                size="sm"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      )}
      {showAddForm && (
        <AddCombatantForm
          open
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddCombatant}
        />
      )}
      {showCreaturesList && (
        <AddCreaturesFromList
          open
          onClose={() => setShowCreaturesList(false)}
          onAdd={handleAddCreatures}
          creatures={creatures}
          loading={creaturesLoading}
        />
      )}
      {showSaveEncounter && (
        <Dialog open={showSaveEncounter} onClose={() => setShowSaveEncounter(false)} title="Begegnung speichern">
          <div className="space-y-3">
            <Input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Name" />
            <Input value={saveFolder} onChange={(e) => setSaveFolder(e.target.value)} placeholder="Ordner (optional)" list="folder-list" />
            <datalist id="folder-list">
              {[...new Set(encounters.map((e) => e.folder).filter(Boolean))].map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={savePlayers} onChange={(e) => setSavePlayers(e.target.checked)} />
              Spieler ebenfalls speichern
            </label>
            <Button
              className="w-full"
              onClick={async () => {
                if (!saveName.trim()) return;
                try {
                  const combatants = savePlayers
                    ? combat.combatants
                    : combat.combatants.filter((c) => c.type !== "player");
                  const now = new Date().toISOString();
                  await saveEncounter({
                    id: crypto.randomUUID(),
                    name: saveName.trim(),
                    folder: saveFolder.trim() || undefined,
                    combatants,
                    updatedAt: now,
                    createdAt: now,
                  });
                  setShowSaveEncounter(false);
                } catch (e) {
                  alert("Speichern fehlgeschlagen: " + (e as Error).message);
                }
              }}
            >
              Speichern
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
