import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AddCombatantForm } from "./AddCombatantForm";

describe("AddCombatantForm", () => {
  it("renders max hp field", () => {
    render(<AddCombatantForm open onAdd={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/Max\. TP/i)).toBeTruthy();
  });
});