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

/**
 * Draft für einen neuen Punkt
 */
export type DraftPoint = MapPoint | null;

type EditorState = {
  mode: EditorMode;

  setMode: (mode: EditorMode) => void;

  draftPoints: MapPoint[];

  addPoint: (p: MapPoint) => void;

  resetDraft: () => void;

  draftPoint: DraftPoint;

  setSingleDraftPoint: (p: MapPoint | null) => void;

  activeEntity: any | null;

  setActiveEntity: (entity: any | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  mode: "idle",

  setMode: (mode) => set({ mode }),

  draftPoints: [],

  addPoint: (p) =>
    set((state) => ({
      draftPoints: [...state.draftPoints, p],
    })),

  resetDraft: () =>
    set({
      draftPoints: [],
      draftPoint: null,
    }),

  draftPoint: null,

  setSingleDraftPoint: (p) =>
    set({
      draftPoint: p,
    }),

  activeEntity: null,

  setActiveEntity: (entity) =>
    set({
      activeEntity: entity,
    }),
}));
