import { MapPoint, WorldEntityBase } from "./world-entity";

export const POINT_TYPES = ["city", "village", "dungeon", "poi", "event"];

export type PointType = (typeof POINT_TYPES)[number];

export type PointEntity = WorldEntityBase & {
  type: PointType;
  position: MapPoint;
  entityType: "point";
};
