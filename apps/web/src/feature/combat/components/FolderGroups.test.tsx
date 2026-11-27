import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { FolderGroups, type FolderGroupsProps } from "./FolderGroups";

afterEach(cleanup);

type Item = { id: string; folder?: string; name: string };

const items: Item[] = [
  { id: "1", name: "Alpha" },
  { id: "2", folder: "Bestien", name: "Wolf" },
  { id: "3", folder: "Bestien", name: "Bär" },
  { id: "4", folder: "Untote", name: "Skelett" },
];

function renderGroups(
  overrides: Partial<FolderGroupsProps<Item>> = {},
) {
  return render(
    <FolderGroups
      items={items}
      getFolder={(i) => i.folder}
      getId={(i) => i.id}
      renderItem={(i) => <div>{i.name}</div>}
      {...overrides}
    />,
  );
}

describe("FolderGroups", () => {
  it("should_render_all_items_when_no_folder_assigned", () => {
    renderGroups({ items: [{ id: "1", name: "Alpha" }] });
    expect(screen.getByText("Alpha")).toBeTruthy();
  });

  it("should_render_folder_headers_and_items_when_folders_exist", () => {
    renderGroups();
    expect(screen.getByText("▼ Bestien")).toBeTruthy();
    expect(screen.getByText("▼ Untote")).toBeTruthy();
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Wolf")).toBeTruthy();
    expect(screen.getByText("Skelett")).toBeTruthy();
  });

  it("should_hide_folder_items_when_folder_collapsed", () => {
    renderGroups();
    fireEvent.click(screen.getByText("▼ Bestien"));
    expect(screen.getByText("▶ Bestien")).toBeTruthy();
    expect(screen.queryByText("Wolf")).toBeNull();
    expect(screen.queryByText("Bär")).toBeNull();
    // other folder remains open
    expect(screen.getByText("Skelett")).toBeTruthy();
  });

  it("should_show_items_again_when_folder_expanded", () => {
    renderGroups();
    fireEvent.click(screen.getByText("▼ Bestien"));
    fireEvent.click(screen.getByText("▶ Bestien"));
    expect(screen.getByText("Wolf")).toBeTruthy();
    expect(screen.getByText("Bär")).toBeTruthy();
  });

  it("should_render_empty_label_when_no_items", () => {
    renderGroups({ items: [], emptyLabel: <div>Nichts da</div> });
    expect(screen.getByText("Nichts da")).toBeTruthy();
  });
});