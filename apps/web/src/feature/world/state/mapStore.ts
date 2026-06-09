import { create } from "zustand";
import { PointEntity, LineEntity, PolygonEntity } from "@repo/domain";

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
    const res = await fetch("/map");
    const data = await res.json();

    set({
      points: data.points,
      lines: data.lines,
      polygons: data.polygons,
    });
  },
}));
