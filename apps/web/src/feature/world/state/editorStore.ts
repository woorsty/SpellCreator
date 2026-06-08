import { create } from "zustand";

export type EditorMode =
  | "idle"
  | "create-point"
  | "create-line"
  | "create-polygon"
  | "edit";

export type MapPoint = {
  x: number;
  y: number;
};

type EditorState = {
  mode: EditorMode;
  draftPoints: MapPoint[];

  activeEntity: any | null;

  setMode: (mode: EditorMode) => void;
  addPoint: (p: MapPoint) => void;
  resetDraft: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  mode: "idle",
  draftPoints: [],
  activeEntity: null,

  setMode: (mode) => set({ mode }),

  addPoint: (p) =>
    set((state) => ({
      draftPoints: [...state.draftPoints, p],
    })),

  resetDraft: () =>
    set({
      draftPoints: [],
    }),
}));
