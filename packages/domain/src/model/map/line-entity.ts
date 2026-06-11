import { MapPoint, WorldEntityBase } from "./world-entity";

export const LINE_TYPES = ["road", "river", "path", "backtrack"];

export type LineType = (typeof LINE_TYPES)[number];

export type LineEntity = WorldEntityBase & {
  entityType: "line";
  type: LineType;
  points: MapPoint[];

  style?: {
    color?: string;
    width?: number;
  };
};
