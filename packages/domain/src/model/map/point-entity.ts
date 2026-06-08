import { MapPoint, WorldEntity } from "./world-entity";

export type PointType = "city" | "village" | "dungeon" | "poi";

export type PointEntity = WorldEntity & {
  type: PointType;
  position: MapPoint;
  entityType: "point";
};
