import { LineEntity } from "./line-entity";
import { PointEntity } from "./point-entity";
import { PolygonEntity } from "./polygon-entity";

export type WorldEntityBase = {
  id: string;
  name: string;
  description: string;
  articleUrl?: string;
  activeFrom?: number;
  activeTo?: number;
  tags?: string[];
};

export type MapPoint = {
  x: number;
  y: number;
};

export type DraftGeometry =
  | {
      type: "point";
      position: MapPoint;
    }
  | {
      type: "line";
      points: MapPoint[];
    }
  | {
      type: "polygon";
      points: MapPoint[];
    };

export type WorldEntity = PointEntity | LineEntity | PolygonEntity;
