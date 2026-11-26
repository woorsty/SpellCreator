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
  return monster.source === "imported";
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

  const handleAddToCombat = async (monster: Combatant) => {
    const combatant: Omit<Combatant, "turnOrder"> = {
      ...monster,
      id: crypto?.randomUUID?.() ?? `c-${Date.now()}`,
    };
    await addMonsterToCombat(combatant);
  };

  const handleCopyMonster = (monster: Combatant) => {
    // Create a copy with a new ID and custom source
    const copy: Omit<Combatant, "turnOrder"> = {
      ...monster,
      id: crypto?.randomUUID?.() ?? `c-${Date.now()}`,
      source: "custom",
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
          <h2 className="text-xl font-serif font-bold text-text">Kreaturen</h2>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface p-4 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddCombatantForm
              open={true}
              monster={editingMonster}
              onClose={() => setShowForm(false)}
              onAdd={(combatant) => {
                if (!editingMonster) {
                  saveMonster(combatant);
                  addMonsterToCombat(combatant);
                }
                setShowForm(false);
                setEditingMonster(undefined);
              }}
              onSave={handleSaveMonster}
            />
          </div>
        </div>
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
          <table className="w-full text-left border-collapse">
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
                      {monster.imageUrl && (
                        <img
                          src={monster.imageUrl}
                          alt={displayName}
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                      )}
                      {displayName}
                      {getMonsterName(monster) !== monster.name && (
                        <span className="text-text-muted text-xs ml-1">
                          ({monster.name})
                        </span>
                      )}
                    </td>
                    <td className="p-3 flex flex-col gap-2 w-12">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToCombat(monster)}
                      >
                        +
                      </Button>
                      {imported ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCopyMonster(monster)}
                        >
                          🐑
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditMonster(monster)}
                        >
                          ✏️
                        </Button>
                      )}
                      {!imported && (
                        <Button
                          onClick={() => handleDeleteMonster(monster)}
                          className="p-1.5 text-text-muted hover:text-red-400"
                          aria-label={`Kreatur ${displayName} löschen`}
                          variant="secondary"
                        >
                          🗑️
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
