import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import type { Combatant } from "@repo/domain";
import { CombatantCard } from "./CombatantCard";

const mockUpdateCombatant = vi.fn();
const mockUseCombatStore = vi.fn();

vi.mock("../combatStore", () => ({
  useCombatStore: () => mockUseCombatStore(),
}));

const baseCombatant: Combatant = {
  id: "c-1",
  name: "Goblin",
  type: "monster",
  initiative: 10,
  hp: 7,
  maxHp: 7,
  tempHp: 0,
  armorClass: 15,
  isDead: false,
  conditions: [],
  turnOrder: 0,
} as any;

function renderCard(combatant: Combatant = baseCombatant) {
  mockUseCombatStore.mockReturnValue({
    changeHp: vi.fn(),
    setTempHp: vi.fn(),
    setInitiative: vi.fn(),
    removeCondition: vi.fn(),
    removeCombatant: vi.fn(),
    updateCombatant: mockUpdateCombatant,
  });
  return render(
    <CombatantCard combatant={combatant} isActive={false} isDead={false} />,
  );
}

describe("CombatantCard", () => {
  beforeEach(() => {
    mockUpdateCombatant.mockReset();
    mockUseCombatStore.mockReset();
    document.body.innerHTML = "";
  });

  it("should_call_updateCombatant_with_new_name_when_monster_renamed", () => {
    renderCard();
    const name = screen.getByText("Goblin");
    fireEvent.click(name);
    const input = screen.getByDisplayValue("Goblin") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Goblin (Elite)" } });
    fireEvent.blur(input);
    expect(mockUpdateCombatant).toHaveBeenCalledWith("c-1", { name: "Goblin (Elite)" });
  });
});
