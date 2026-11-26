import React, { useState } from "react";
import type { Combatant, Condition } from "@repo/domain";
import { useCombatStore } from "../combatStore";
import { ConditionBadge } from "./ConditionBadge";
import { HPBar } from "./HPBar";
import { Badge } from "../../../component/ui/Badge";
import { Button } from "../../../component/ui/Button";
import { ApplyConditionDialog } from "./ApplyConditionDialog";

type CombatantCardProps = {
  combatant: Combatant;
  isActive: boolean;
  isDead: boolean;
};

const typeColors: Record<string, { bg: string; text: string; border: string }> =
  {
    player: {
      bg: "bg-blue-500/10",
      text: "text-blue-300",
      border: "border-blue-500/30",
    },
    npc: {
      bg: "bg-purple-500/10",
      text: "text-purple-300",
      border: "border-purple-500/30",
    },
    monster: {
      bg: "bg-red-500/10",
      text: "text-red-300",
      border: "border-red-500/30",
    },
  };

export function CombatantCard({
  combatant,
  isActive,
  isDead,
}: CombatantCardProps) {
  const {
    changeHp,
    setTempHp,
    setInitiative,
    removeCondition,
    removeCombatant,
    updateCombatant,
  } = useCombatStore();

  const [showConditionDialog, setShowConditionDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(combatant.name);

  const typeStyle = typeColors[combatant.type] || typeColors.npc;
  const hpPct =
    combatant.maxHp <= 0 ? 0 : (combatant.hp / combatant.maxHp) * 100;

  const handleDamage = (amt: number) => changeHp(combatant.id, -amt);
  const handleHeal = (amt: number) => changeHp(combatant.id, amt);

  return (
    <div
      className={`rounded-xl border p-4 flex items-center gap-4 transition-all duration-300 ${
        isActive
          ? "bg-surface-2 border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(139,92,246,0.25)] animate-glow"
          : "bg-surface border-border hover:border-border-focus/50 hover:shadow-dnd"
      } ${isDead ? "border-danger/50" : ""}`}
    >
      {/* Initiative Number Badge */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xl border ${
          isActive
            ? "bg-primary text-white border-primary"
            : "bg-surface-2 text-text-muted border-border"
        }`}
      >
        {combatant.initiative}
      </div>

      {(combatant.portraitUrl || combatant.imageUrl) && (
        <img
          src={combatant.portraitUrl || combatant.imageUrl}
          alt={combatant.name}
          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                const trimmed = nameDraft.trim();
                if (trimmed && trimmed !== combatant.name) {
                  updateCombatant(combatant.id, { name: trimmed } as any);
                } else {
                  setNameDraft(combatant.name);
                }
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") {
                  setNameDraft(combatant.name);
                  setEditingName(false);
                }
              }}
              className="text-base font-serif font-semibold bg-surface-2 border border-border rounded px-1 w-full"
            />
          ) : (
            <h3
              onClick={(e) => {
                e.stopPropagation();
                setNameDraft(combatant.name);
                setEditingName(true);
              }}
              className={`text-base font-serif font-semibold truncate ${
                isActive ? "text-primary" : "text-text"
              } ${"cursor-pointer hover:underline"}`}
            >
              {combatant.name}
            </h3>
          )}
          <Badge
            variant={
              combatant.type === "player"
                ? "primary"
                : combatant.type === "monster"
                  ? "danger"
                  : "default"
            }
          >
            {combatant.type === "player"
              ? "Spieler"
              : combatant.type === "monster"
                ? "Monster"
                : "NSC"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted mb-2">
          <span className="flex items-center gap-1">
            <span className="text-[10px]">🛡️</span> AC {combatant.armorClass}
          </span>
          {combatant.initiativeRoll !== undefined && (
            <span className="flex items-center gap-1">
              <span className="text-[10px]">🎯</span> W20{" "}
              {combatant.initiativeRoll}
            </span>
          )}
        </div>

        <HPBar
          hp={combatant.hp}
          maxHp={combatant.maxHp}
          tempHp={combatant.tempHp}
        />
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-sm font-mono text-text">{combatant.hp}</span>
          <span className="text-xs text-text-muted">/ {combatant.maxHp}</span>
          {combatant.tempHp > 0 && (
            <span className="text-xs text-primary ml-1">
              +{combatant.tempHp} TH
            </span>
          )}
          {isDead && <span className="ml-2 text-xs text-danger">💀 TOT</span>}
        </div>

        {/* Zustände */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {(combatant.conditions ?? []).map((c) => (
            <ConditionBadge
              key={c.id}
              condition={c}
              onRemove={() => removeCondition(combatant.id, c.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex gap-0.5">
            <button
              onClick={() => handleDamage(1)}
              className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="-1 HP"
              aria-label="1 Schaden"
            >
              −
            </button>
            <button
              onClick={() => handleDamage(5)}
              className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="-5 HP"
              aria-label="5 Schaden"
            >
              −5
            </button>
          </div>
          <div className="flex gap-0.5">
            <button
              onClick={() => handleHeal(1)}
              className="p-1.5 rounded hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors"
              title="+1 HP"
              aria-label="1 Heilung"
            >
              +
            </button>
            <button
              onClick={() => handleHeal(5)}
              className="p-1.5 rounded hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors"
              title="+5 HP"
              aria-label="5 Heilung"
            >
              +5
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowConditionDialog(true)}
          className="p-1.5 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
          title="Zustand hinzufügen"
          aria-label="Zustand hinzufügen"
        >
          ⚡
        </button>
        {showConditionDialog && (
          <ApplyConditionDialog
            open={showConditionDialog}
            onClose={() => setShowConditionDialog(false)}
            combatantId={combatant.id}
          />
        )}
        <button
          onClick={() => {
            setNameDraft(combatant.name);
            setEditingName(true);
          }}
            className="p-1.5 rounded text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            title="Umbenennen"
            aria-label="Kreatur umbenennen"
          >
            ✏️
          </button>
        <button
          onClick={() => removeCombatant(combatant.id)}
          className="p-1.5 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Entfernen"
          aria-label="Kreatur entfernen"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
