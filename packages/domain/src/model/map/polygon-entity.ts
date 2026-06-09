import { MapPoint, WorldEntityBase } from "./world-entity";

export type PolygonType = "kingdom" | "forest" | "region";

export type PolygonEntity = WorldEntityBase & {
  entityType: "polygon";
  type: PolygonType;
  points: MapPoint[];

  style?: {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
  };
};
