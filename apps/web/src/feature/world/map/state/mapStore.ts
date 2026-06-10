import { create } from "zustand";
import { PointEntity, LineEntity, PolygonEntity } from "@repo/domain";
import { MapApi } from "../../../../api/map-api";

type MapState = {
  points: PointEntity[];
  lines: LineEntity[];
  polygons: PolygonEntity[];

  loadAll: () => Promise<void>;
};

export const useMapStore = create<MapState>((set) => ({
  points: [],
  lines: [],
  polygons: [],

  loadAll: async () => {
    const data = await MapApi.getAll();

    set({
      points: data.points,
      lines: data.lines,
      polygons: data.polygons,
    });
  },
}));
