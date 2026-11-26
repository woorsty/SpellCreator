import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { ApplyConditionDialog } from "./ApplyConditionDialog";

const mockUseCombatStore = vi.fn();
vi.mock("../combatStore", () => ({
  useCombatStore: (selector?: any) => {
    if (selector) return selector(mockUseCombatStore());
    return mockUseCombatStore();
  },
}));

const baseCombatantId = "c-1";

function renderDialog(open: boolean, combatantId: string, round = 1) {
  mockUseCombatStore.mockReturnValue({
    applyCondition: vi.fn(),
    currentCombat: { round },
  });
  return render(
    <ApplyConditionDialog
      open={open}
      onClose={vi.fn()}
      combatantId={combatantId}
    />,
  );
}

describe("ApplyConditionDialog", () => {
  beforeEach(() => {
    mockUseCombatStore.mockReset();
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should_render_nothing_when_closed", () => {
    renderDialog(false, baseCombatantId);
    expect(document.body.textContent).not.toContain("Zustand hinzufügen");
  });

  it("should_show_preset_conditions_including_burning_prone_concentration", () => {
    renderDialog(true, baseCombatantId);
    expect(document.body.textContent).toContain("Brennend");
    expect(document.body.textContent).toContain("Liegend");
    expect(document.body.textContent).toContain("Konzentration");
  });

  it("should_apply_custom_condition_with_name_and_rounds", () => {
    renderDialog(true, baseCombatantId);
    const apply = mockUseCombatStore().applyCondition as ReturnType<
      typeof vi.fn
    >;
    const inputs = document.body.querySelectorAll<HTMLInputElement>("input");
    const nameInput = inputs[0];
    const roundsInput = inputs[1];
    fireEvent.change(nameInput, { target: { value: "Gelähmt" } });
    fireEvent.change(roundsInput, { target: { value: "2" } });
    const submit = document.body.querySelector("button[type=submit]")!;
    fireEvent.click(submit);
    expect(apply).toHaveBeenCalledWith(baseCombatantId, expect.objectContaining({ name: "Gelähmt", rounds: 2 }));
  });

  it("should_apply_permanent_condition_when_rounds_empty", () => {
    renderDialog(true, baseCombatantId);
    const apply = mockUseCombatStore().applyCondition as ReturnType<
      typeof vi.fn
    >;
    const inputs = document.body.querySelectorAll<HTMLInputElement>("input");
    const nameInput = inputs[0];
    fireEvent.change(nameInput, { target: { value: "Dauerhaft" } });
    const submit = document.body.querySelector("button[type=submit]")!;
    fireEvent.click(submit);
    expect(apply).toHaveBeenCalledWith(baseCombatantId, expect.objectContaining({ name: "Dauerhaft", rounds: undefined }));
  });

  it("should_show_error_when_name_empty", () => {
    renderDialog(true, baseCombatantId);
    const submit = document.body.querySelector("button[type=submit]")!;
    fireEvent.click(submit);
    expect(document.body.textContent).toContain("Bitte einen Namen angeben.");
  });

  it("should_fill_fields_when_preset_selected", () => {
    renderDialog(true, baseCombatantId);
    const buttons = Array.from(document.body.querySelectorAll("button"));
    const burningBtn = buttons.find((b) => b.textContent?.includes("Brennend"))!;
    fireEvent.click(burningBtn);
    const inputs = document.body.querySelectorAll<HTMLInputElement>("input");
    const nameInput = inputs[0];
    const roundsInput = inputs[1];
    expect(nameInput.value).toBe("Brennend");
    expect(roundsInput.value).toBe("");
  });
});
