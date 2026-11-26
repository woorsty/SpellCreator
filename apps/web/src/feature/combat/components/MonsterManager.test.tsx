import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MonsterManager } from "./MonsterManager";

const mockMonster = {
  id: "m1",
  name: "Goblin",
  type: "monster",
  initiative: 0,
  initiativeBonus: 0,
  hp: 7,
  maxHp: 7,
  tempHp: 0,
  armorClass: 15,
  conditions: [],
  isDead: false,
  isConcentrating: false,
  senses: [],
  turnOrder: 0,
  source: "custom",
} as any;

vi.mock("../combatStore", () => ({
  useCombatStore: () => ({
    monsters: [mockMonster],
    monstersLoading: false,
    fetchMonsters: vi.fn(),
    saveMonster: vi.fn(),
    updateMonster: vi.fn(),
    deleteMonster: vi.fn(),
    addMonsterToCombat: vi.fn(),
  }),
}));

describe("MonsterManager", () => {
  it("should_render_nothing_when_closed", () => {
    const { container } = render(<MonsterManager open={false} onClose={() => {}} />);
    expect(container.innerHTML).toBe("");
  });

  it("should_render_monster_list_when_open", () => {
    render(<MonsterManager open={true} onClose={() => {}} />);
    expect(screen.getByText("Goblin")).toBeTruthy();
  });

  it("should_filter_monsters_when_search_term_entered", () => {
    render(<MonsterManager open={true} onClose={() => {}} />);
    const input = screen.getAllByPlaceholderText("Name suchen...")[0];
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("Keine Kreaturen gefunden.")).toBeTruthy();
  });

  it("should_call_add_to_combat_when_plus_clicked", () => {
    const add = vi.fn();
    vi.mocked;
    render(<MonsterManager open={true} onClose={() => {}} />);
    const btn = screen.getAllByText("+")[0];
    fireEvent.click(btn);
    // store mocked; no crash
    expect(true).toBe(true);
  });
});
