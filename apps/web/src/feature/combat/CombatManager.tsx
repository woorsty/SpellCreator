import React, { useEffect } from "react";
import type { CombatState } from "@repo/domain";
import { useCombatStore } from "./combatStore";
import { CombatView } from "./components/CombatView";

export function CombatManager() {
  const { currentCombat, initCombat } = useCombatStore();

  useEffect(() => {
    initCombat();
  }, [initCombat]);

  if (!currentCombat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-text-muted">
        <div className="text-3xl mb-2">⚔️</div>
        <p>Lade Kampf...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-text ml-2">
          {currentCombat.name}
        </h1>
      </div>
      <CombatView combat={currentCombat} />
    </div>
  );
}
