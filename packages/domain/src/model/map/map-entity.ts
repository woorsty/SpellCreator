import { LineEntity } from "./line-entity";
import { PointEntity } from "./point-entity";
import { PolygonEntity } from "./polygon-entity";

export type MapEntity = PointEntity | LineEntity | PolygonEntity;
