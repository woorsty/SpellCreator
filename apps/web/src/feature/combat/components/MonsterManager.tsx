import React, { useCallback, useState } from "react";
import type { Combatant } from "@repo/domain";
import { useCombatStore } from "../combatStore";
import { AddCombatantForm } from "./AddCombatantForm";
import { Button } from "../../../component/ui/Button";
import { Card } from "../../../component/ui/Card";
import { Label } from "../../../component/ui/Label";
import { Input } from "../../../component/ui/Input";
import { monsterTranslations } from "../../../locales/de/monsters";

const monsterTranslationsMap: Record<string, string> = monsterTranslations;

function getMonsterName(monster: Combatant): string {
  return monsterTranslationsMap[monster.name] || monster.name;
}

function getApiName(monster: Combatant): string {
  return monster.name; // Englisch ist führend für API
}

function isImported(monster: Combatant): boolean {
  return monster.imported === true;
}

type MonsterManagerProps = {
  open: boolean;
  onClose: () => void;
};

export function MonsterManager({ open, onClose }: MonsterManagerProps) {
  const {
    monsters,
    monstersLoading,
    fetchMonsters,
    saveMonster,
    updateMonster,
    deleteMonster,
    addMonsterToCombat,
  } = useCombatStore();

  const [showForm, setShowForm] = useState(false);
  const [editingMonster, setEditingMonster] = useState<Combatant | undefined>(
    undefined,
  );
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    fetchMonsters();
  }, [fetchMonsters]);

  const filteredMonsters = monsters.filter((m) => {
    const search = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(search) ||
      getMonsterName(m).toLowerCase().includes(search)
    );
  });

  const handleAddMonster = () => {
    setEditingMonster(undefined);
    setShowForm(true);
  };

  const handleEditMonster = (monster: Combatant) => {
    setEditingMonster(monster);
    setShowForm(true);
  };

  const handleSaveMonster = (monster: Omit<Combatant, "turnOrder">) => {
    if (editingMonster) {
      updateMonster(getApiName(editingMonster), monster);
    } else {
      saveMonster(monster);
    }
    setShowForm(false);
    setEditingMonster(undefined);
  };

  const handleAddToCombat = (monster: Combatant) => {
    addMonsterToCombat(monster);
  };

  const handleCopyMonster = (monster: Combatant) => {
    // Create a copy without the imported flag and with a new ID
    const copy: Omit<Combatant, "turnOrder"> = {
      ...monster,
      id: crypto.randomUUID?.() ?? `c-${Date.now()}`,
      imported: false,
      name: `${monster.name} (Kopie)`,
    };
    saveMonster(copy);
  };

  const handleDeleteMonster = (monster: Combatant) => {
    const name = getApiName(monster);
    if (window.confirm(`Kreatur "${name}" wirklich löschen?`)) {
      deleteMonster(name);
    }
  };

  if (!open) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-text">
            Kreaturen verwalten
          </h2>
          <p className="text-text-muted text-sm">
            Gespeicherte Kreaturen dauerhaft verwalten und zum Kampf hinzufügen.
          </p>
        </div>
        <Button onClick={handleAddMonster} variant="primary">
          + Neue Kreatur
        </Button>
      </div>

      {showForm && (
        <AddCombatantForm
          open={true}
          monster={editingMonster}
          onClose={() => setShowForm(false)}
          onAdd={(combatant) => {
            // Also save to monster list when creating new
            if (!editingMonster) {
              saveMonster(combatant);
            }
            addMonsterToCombat(combatant);
            setShowForm(false);
            setEditingMonster(undefined);
          }}
          onSave={handleSaveMonster}
        />
      )}

      <div className="space-y-2">
        <Label>Suche</Label>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Name suchen..."
          className="w-full max-w-md"
        />
      </div>

      {monstersLoading ? (
        <div className="py-8 text-center text-text-muted">
          Kreaturen werden geladen…
        </div>
      ) : filteredMonsters.length === 0 ? (
        <div className="py-8 text-center text-text-muted">
          Keine Kreaturen gefunden.
        </div>
      ) : (
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-border">
                  <th className="p-3 text-text font-medium">Name</th>
                  <th className="p-3 text-text font-medium">TP</th>
                  <th className="p-3 text-text font-medium">AC</th>
                  <th className="p-3 text-text font-medium">INI</th>
                  <th className="p-3 text-text font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonsters.map((monster) => {
                  const displayName = getMonsterName(monster);
                  const imported = isImported(monster);
                  return (
                    <tr
                      key={monster.id}
                      className="border-b border-border hover:bg-surface-2 transition-colors group"
                    >
                      <td className="p-3 font-medium text-text">
                        {displayName}
                        {getMonsterName(monster) !== monster.name && (
                          <span className="text-text-muted text-xs ml-1">
                            ({monster.name})
                          </span>
                        )}
                        {imported && (
                          <span className="text-text-muted text-xs ml-1">
                            (importiert)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-text-muted">
                        {monster.hp} / {monster.maxHp}
                      </td>
                      <td className="p-3 text-text-muted">{monster.armorClass}</td>
                      <td className="p-3 text-text-muted">
                        {monster.initiative}
                      </td>
                      <td className="p-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddToCombat(monster)}
                        >
                          Zum Kampf
                        </Button>
                        {imported ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCopyMonster(monster)}
                          >
                            Kopieren
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditMonster(monster)}
                          >
                            Bearbeiten
                          </Button>
                        )}
                        {!imported && (
                          <button
                            onClick={() => handleDeleteMonster(monster)}
                            className="p-1.5 text-text-muted hover:text-red-400"
                            aria-label={`Kreatur ${displayName} löschen`}
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
