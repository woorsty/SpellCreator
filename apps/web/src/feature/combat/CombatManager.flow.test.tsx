import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { CombatManager } from "./CombatManager";

const storeMock = {
  currentCombat: null,
  initCombat: vi.fn(),
};

vi.mock("./combatStore", () => ({
  useCombatStore: () => storeMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  storeMock.currentCombat = null;
});

describe("CombatManager flow", () => {
  it("should initialize a combat when entering /combat without id", () => {
    render(
      <MemoryRouter initialEntries={["/combat"]}>
        <Routes>
          <Route path="combat" element={<CombatManager />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Lade Kampf/)).toBeTruthy();
    expect(storeMock.initCombat).toHaveBeenCalled();
  });

  it.todo("should add multiple monsters");
  it.todo("should start the combat");
  it.todo("should complete a full initiative round");
  it.todo("should add damage and remove it again");
  it.todo("should add a status and remove it again");
  it.todo("should add a status lasting 2 rounds and remove it after two rounds");
  it.todo("should delete a monster and add it again");
  it.todo("should pause the combat and resume it");
});
