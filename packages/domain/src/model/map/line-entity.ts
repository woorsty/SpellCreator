import { MapPoint, WorldEntity } from "./world-entity";

export type LineType = "road" | "river" | "path";

export type LineEntity = WorldEntity & {
  entityType: "line";
  type: LineType;
  points: MapPoint[];

  style?: {
    color?: string;
    width?: number;
  };
};
