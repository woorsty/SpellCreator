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
  // =====================
  // MODE
  // =====================
  mode: EditorMode;

  setMode: (mode: EditorMode) => void;

  // =====================
  // POINT DRAWING
  // =====================
  draftPoints: MapPoint[];

  addPoint: (p: MapPoint) => void;

  resetDraft: () => void;

  // =====================
  // SIMPLE POINT EDITING (NEU)
  // =====================
  draftPoint: DraftPoint;

  setDraftPoint: (p: MapPoint | null) => void;

  // =====================
  // SELECTION / EDIT MODE
  // =====================
  activeEntity: any | null;

  setActiveEntity: (entity: any | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  // =====================
  // MODE
  // =====================
  mode: "idle",

  setMode: (mode) => set({ mode }),

  // =====================
  // LINE / POLYGON SUPPORT
  // =====================
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

  // =====================
  // POINT DRAFT (SINGLE POINT)
  // =====================
  draftPoint: null,

  setDraftPoint: (p) =>
    set({
      draftPoint: p,
    }),

  // =====================
  // ACTIVE ENTITY (EDIT MODE)
  // =====================
  activeEntity: null,

  setActiveEntity: (entity) =>
    set({
      activeEntity: entity,
    }),
}));
