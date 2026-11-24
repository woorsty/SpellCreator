import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CombatState } from "@repo/domain";
import { useCombatStore } from "./combatStore";
import { CombatView } from "./components/CombatView";
import { CombatList } from "./components/CombatList";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";

export function CombatManager() {
  const { id } = useParams<{ id?: string }>();
  const { currentCombat, fetchCombats, selectCombat, closeCombat } = useCombatStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      selectCombat(id);
    } else {
      fetchCombats();
      closeCombat();
    }
  }, [id]);

  if (id) {
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
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/combat")}>
              ← Zurück zur Übersicht
            </Button>
            <h1 className="text-2xl font-serif font-bold text-text ml-2">
              {currentCombat.name}
            </h1>
          </div>
        </div>
        <CombatView combat={currentCombat} />
      </div>
    );
  }

  return <CombatList />;
}
