import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import type { Condition } from "@repo/domain";
import { ConditionBadge } from "./ConditionBadge";

const mockUseCombatStore = vi.fn();
vi.mock("../combatStore", () => ({
  useCombatStore: (selector: any) => selector(mockUseCombatStore()),
}));

function renderBadge(condition: Condition, round: number, appliedAt?: number) {
  mockUseCombatStore.mockReturnValue({
    currentCombat: { round },
    conditionAppliedAt: appliedAt !== undefined ? { [condition.id]: appliedAt } : {},
  });
  return render(
    <ConditionBadge condition={condition} onRemove={vi.fn()} />,
  );
}

const baseCondition: Condition = {
  id: "c-1",
  name: "Vergiftet",
};

describe("ConditionBadge", () => {
  beforeEach(() => {
    mockUseCombatStore.mockReset();
    document.body.innerHTML = "";
  });

  it("should_show_name_without_counter_when_condition_is_permanent", () => {
    const { container } = renderBadge(baseCondition, 1);
    expect(screen.getByText("Vergiftet")).not.toBeNull();
    expect(container.textContent).not.toMatch(/\d+r/);
  });

  it("should_count_down_remaining_rounds_in_label", () => {
    const condition = { ...baseCondition, rounds: 3 };
    renderBadge(condition, 1, 1);
    expect(screen.getByText(/Vergiftet\s+3r/)).not.toBeNull();
  });

  it("should_show_last_round_in_amber", () => {
    const condition = { ...baseCondition, rounds: 3 };
    renderBadge(condition, 3, 1);
    const badge = screen.getByText(/Vergiftet\s+1r/).closest("span") as HTMLElement;
    expect(badge.classList.contains("text-amber-300")).toBe(true);
    expect(badge.classList.contains("animate-pulse")).toBe(false);
  });

  it("should_highlight_when_round_count_is_reached", () => {
    const condition = { ...baseCondition, rounds: 3 };
    renderBadge(condition, 4, 1);
    const badge = screen.getByText(/Vergiftet\s+0r/).closest("span") as HTMLElement;
    expect(badge.classList.contains("animate-pulse")).toBe(true);
    expect(badge.classList.contains("text-red-300")).toBe(true);
  });

  it("should_keep_concentration_color", () => {
    const condition = {
      ...baseCondition,
      rounds: 2,
      concentration: true,
    };
    renderBadge(condition, 2, 1);
    const badge = screen.getByText(/Vergiftet\s+1r/).closest("span") as HTMLElement;
    expect(badge.classList.contains("text-amber-300")).toBe(false);
    expect(badge.style.color).toBe("rgb(167, 139, 250)");
  });

  it("should_show_rounds_counter_when_only_rounds_is_set_no_applied_at", () => {
    const condition = { ...baseCondition, rounds: 3 };
    renderBadge(condition, 1);
    expect(screen.getByText(/Vergiftet\s+3r/)).not.toBeNull();
  });

  it("should_not_show_counter_for_permanent_condition_without_rounds", () => {
    const condition = { ...baseCondition };
    renderBadge(condition, 1);
    const badges = screen.getAllByText("Vergiftet");
    const badgeEl = badges[0].closest("span") as HTMLElement;
    expect(badgeEl.textContent).not.toMatch(/\d+r/);
  });
});
