import { MapPoint, WorldEntity } from "./world-entity";

export type PolygonType = "kingdom" | "forest" | "region";

export type PolygonEntity = WorldEntity & {
  entityType: "polygon";
  type: PolygonType;
  points: MapPoint[];

  style?: {
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
  };
};
