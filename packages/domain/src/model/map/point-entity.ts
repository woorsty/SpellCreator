import { MapPoint, WorldEntityBase } from "./world-entity";

export type PointType = "city" | "village" | "dungeon" | "poi";

export type PointEntity = WorldEntityBase & {
  type: PointType;
  position: MapPoint;
  entityType: "point";
};
