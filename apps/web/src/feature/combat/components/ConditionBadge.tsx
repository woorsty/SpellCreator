import React from "react";
import type { Condition } from "@repo/domain";
import { Badge } from "../../../component/ui/Badge";

type ConditionBadgeProps = {
  condition: Condition;
  onRemove: () => void;
};

export function ConditionBadge({ condition, onRemove }: ConditionBadgeProps) {
  const isConcentration = condition.concentration;
  const expires =
    condition.rounds !== undefined || condition.expiresAtRound !== undefined
      ? ` ${condition.rounds ?? condition.expiresAtRound}r`
      : "";

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border"
      style={{
        borderColor: isConcentration ? "#8b5cf6" : "transparent",
        color: isConcentration ? "#a78bfa" : "#cbd5e1",
      }}
    >
      {condition.name}{expires}
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
