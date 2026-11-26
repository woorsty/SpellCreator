import React from "react";
import type { Condition } from "@repo/domain";
import { useCombatStore } from "../combatStore";

type ConditionBadgeProps = {
  condition: Condition;
  onRemove: () => void;
};

export function ConditionBadge({ condition, onRemove }: ConditionBadgeProps) {
  const currentRound = useCombatStore((s) => s.currentCombat?.round ?? 1);
  const conditionAppliedAt = useCombatStore((s) => s.conditionAppliedAt);
  const isConcentration = condition.concentration;
  const isLimited = condition.rounds !== undefined;

  // Verbleibende Runden, berechnet clientseitig aus der Rundenanzahl bei
  // Anwendung. Kein expiresAtRound gesetzt -> kein automatisches
  // serverseitiges Entfernen, nur ein visueller Hinweis.
  const appliedAt = conditionAppliedAt?.[condition.id];
  const remaining =
    isLimited && condition.rounds !== undefined
      ? appliedAt !== undefined
        ? condition.rounds - (currentRound - appliedAt)
        : condition.rounds
      : undefined;

  const reached = isLimited && remaining !== undefined && remaining <= 0;
  const lastRound = isLimited && remaining !== undefined && remaining === 1;
  const counter = isLimited ? ` ${Math.max(remaining ?? 0, 0)}⌛` : "";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border transition-all duration-200 ${
        reached
          ? "bg-red-500/25 border-red-500/60 text-red-300 animate-pulse"
          : lastRound && !isConcentration
            ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
            : "border-transparent"
      }`}
      style={{
        borderColor: isConcentration ? "#8b5cf6" : "transparent",
        color: isConcentration
          ? "#a78bfa"
          : reached
            ? "#fca5a5"
            : lastRound
              ? "#fbbf24"
              : "#cbd5e1",
      }}
      title={condition.description ?? undefined}
    >
      {condition.name}
      {counter}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded"
        aria-label="Zustand entfernen"
      >
        ✕
      </button>
    </span>
  );
}
