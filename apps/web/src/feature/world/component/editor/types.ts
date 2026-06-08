import {
  LineEntity,
  MapEntity,
  MapPoint,
  PointEntity,
  PolygonEntity,
} from "@repo/domain";

type EditorMode =
  | "idle"
  | "create-point"
  | "create-line"
  | "create-polygon"
  | "edit";

type EditorState = {
  mode: EditorMode;
  activeEntity: MapEntity | null;
  draftPoints: MapPoint[];
};
