import { MapPoint, WorldEntityBase } from "./world-entity";

export const POLYGON_TYPES = ["kingdom", "forest", "region"];

export type PolygonType = (typeof POLYGON_TYPES)[number];

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
