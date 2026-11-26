import React, { useState } from "react";
import type { Condition } from "@repo/domain";
import { useCombatStore } from "../combatStore";
import { Dialog } from "../../../component/ui/Dialog";
import { Button } from "../../../component/ui/Button";
import { Input } from "../../../component/ui/Input";
import { Label } from "../../../component/ui/Label";
import { Card } from "../../../component/ui/Card";
import { Separator } from "../../../component/ui/Separator";

type ApplyConditionDialogProps = {
  open: boolean;
  onClose: () => void;
  combatantId: string;
};

const presets: {
  id: string;
  name: string;
  description: string;
  rounds?: number;
  concentration?: boolean;
}[] = [
  {
    id: "burning",
    name: "Brennend",
    description: "Nimmt zu Beginn jeder Runde Feuer-Schaden.",
  },
  {
    id: "prone",
    name: "Liegend",
    description:
      "Angriffe gegen die Kreatur haben Vorteil aus der Nähe, Nachteil aus der Ferne.",
  },
  {
    id: "concentration",
    name: "Konzentration",
    description: "Die Kreatur konzentriert sich auf einen Zauber.",
    concentration: true,
  },
  {
    id: "blinded",
    name: "Geblendet",
    description: "Kann nicht sehen; Angriffswürfe haben Nachteil.",
  },
  {
    id: "deafened",
    name: "Gehörlos",
    description:
      "Kann nicht hören; Wahrnehmung (Hören) automatisch fehlgeschlagen.",
  },
  {
    id: "frightened",
    name: "Verängstigt",
    description:
      "Hat Nachteil bei Angriffswürfen und Fähigkeitsprüfungen, solange die Quelle in Sichtweite ist.",
  },
  {
    id: "paralyzed",
    name: "Gelähmt",
    description:
      "Ist unfähig, sich zu bewegen oder zu handeln. Angriffswürfe haben Vorteil.",
  },
  {
    id: "stunned",
    name: "Betäubt",
    description:
      "Ist unfähig, sich zu bewegen oder zu handeln; Angriffswürfe haben Vorteil.",
  },
  {
    id: "incapacitated",
    name: "Handlungsunfähig",
    description: "Kann keine Aktionen oder Reaktionen ausführen.",
  },
  {
    id: "invisible",
    name: "Unsichtbar",
    description:
      "Kann nicht gesehen werden; Angriffswürfe gegen sie haben Nachteil.",
  },
  {
    id: "restrained",
    name: "Gefesselt",
    description:
      "Geschwindigkeit 0; Angriffswürfe gegen sie haben Vorteil, ihre eigenen haben Nachteil.",
  },
  {
    id: "poisoned",
    name: "Vergiftet",
    description: "Hat Nachteil bei Angriffswürfen und Rettungswürfen.",
  },
];

export function ApplyConditionDialog({
  open,
  onClose,
  combatantId,
}: ApplyConditionDialogProps) {
  const { applyCondition } = useCombatStore();
  const currentRound = useCombatStore((s) => s.currentCombat?.round ?? 1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rounds, setRounds] = useState("");
  const [concentration, setConcentration] = useState(false);
  const [error, setError] = useState("");

  const selectPreset = (preset: (typeof presets)[number]) => {
    setName(preset.name);
    setDescription(preset.description);
    setRounds("");
    setConcentration(!!preset.concentration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Bitte einen Namen angeben.");
      return;
    }

    const roundsValue = rounds.trim() ? parseInt(rounds, 10) : undefined;
    if (
      roundsValue !== undefined &&
      (Number.isNaN(roundsValue) || roundsValue < 0)
    ) {
      setError("Ungültige Rundenanzahl.");
      return;
    }

    const condition: Condition = {
      id: `${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: trimmed,
      description: description,
      rounds: roundsValue,
      concentration,
    };

    applyCondition(combatantId, condition);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} title="Zustand hinzufügen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Vordefinierte Zustände</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {presets.map((p) => (
              <Button
                key={p.id}
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => selectPreset(p)}
                className="text-xs font-serif h-auto min-h-[60px] flex flex-col items-center justify-center gap-1 leading-snug"
              >
                <span className="font-bold">{p.name}</span>
                {p.rounds !== undefined && (
                  <span className="text-[10px] text-text-muted">
                    {p.rounds}r
                  </span>
                )}
                {p.concentration && (
                  <span className="text-[10px] text-primary">
                    Konzentration
                  </span>
                )}
              </Button>
            ))}
          </div>
          <div className="text-xs text-text-muted">
            Klicke einen Zustand, um den Namen vorzufüllen. Runden immer selbst
            eintragen (leer = dauerhaft).
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Vergiftet"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Runden (leer = dauerhaft)</Label>
            <Input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(e.target.value)}
              placeholder="z. B. 3"
            />
          </div>
          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={concentration}
                onChange={(e) => setConcentration(e.target.checked)}
                className="rounded text-primary bg-surface border border-border focus:ring-primary"
              />
              <span className="text-sm text-text">Konzentration</span>
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button type="submit" variant="primary">
            Hinzufügen
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
