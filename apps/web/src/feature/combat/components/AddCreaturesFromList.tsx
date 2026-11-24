import React, { useCallback, useMemo, useState } from "react";
import type { CharacterSheet, Combatant } from "@repo/domain";
import { Dialog } from "../../../component/ui/Dialog";
import { Button } from "../../../component/ui/Button";
import { Checkbox } from "../../../component/ui/Checkbox";
import { Card } from "../../../component/ui/Card";
import { Label } from "../../../component/ui/Label";
import { characterSheetToCombatant } from "../utils/creatureToCombatant";

type AddCreaturesFromListProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (combatants: Omit<Combatant, "turnOrder">[]) => void;
  creatures: CharacterSheet[];
  loading: boolean;
};

export function AddCreaturesFromList({
  open,
  onClose,
  onAdd,
  creatures,
  loading,
}: AddCreaturesFromListProps) {
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());

  const allSelected =
    creatures.length > 0 && creatures.every((c) => selectedNames.has(c.name));

  const toggleCreature = useCallback(
    (name: string) => {
      setSelectedNames((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        return next;
      });
    },
    [],
  );

  const toggleAll = useCallback(() => {
    setSelectedNames((prev) => {
      if (allSelected) return new Set();
      return new Set(creatures.map((c) => c.name));
    });
  }, [allSelected, creatures]);

  const selectedCreatures = useMemo(
    () => creatures.filter((c) => selectedNames.has(c.name)),
    [creatures, selectedNames],
  );

  const handleAdd = useCallback(() => {
    if (selectedCreatures.length === 0) return;
    const combatants = selectedCreatures.map((c) =>
      characterSheetToCombatant(c),
    );
    onAdd(combatants);
  }, [onAdd, selectedCreatures]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Spieler zum Kampf hinzufügen">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Spieler auswählen</Label>
          <Button size="sm" onClick={toggleAll}>
            {allSelected ? "Alle abwählen" : "Alle auswählen"}
          </Button>
        </div>

        {loading ? (
          <div className="py-4 text-center text-text-muted">
            Charaktere werden geladen…
          </div>
        ) : creatures.length === 0 ? (
          <div className="py-4 text-center text-text-muted">
            Noch keine Charaktere vorhanden.
          </div>
        ) : (
          <Card variant="elevated" className="max-h-[400px] overflow-y-auto">
            <div className="space-y-1">
              {creatures.map((creature) => (
                <div
                  key={creature.name}
                  className="flex items-center gap-3 p-2 border-b border-border hover:bg-surface-2 transition-colors"
                >
                  <Checkbox
                    checked={selectedNames.has(creature.name)}
                    onChange={() => toggleCreature(creature.name)}
                    aria-label={creature.name}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text">{creature.name}</div>
                    <div className="text-xs text-text-muted">
                      Stufe {creature.level} · {creature.species.id} · TP{" "}
                      {creature.currentHitpoints}/{creature.maxHitpoints}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleAdd}
            disabled={selectedCreatures.length === 0 || loading}
          >
            {selectedCreatures.length === 0
              ? "Keine ausgewählt"
              : `Hinzufügen (${selectedCreatures.length})`}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
