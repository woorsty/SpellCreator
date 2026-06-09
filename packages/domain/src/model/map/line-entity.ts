import { MapPoint, WorldEntityBase } from "./world-entity";

export type LineType = "road" | "river" | "path";

export type LineEntity = WorldEntityBase & {
  entityType: "line";
  type: LineType;
  points: MapPoint[];

  style?: {
    color?: string;
    width?: number;
  };
};
