import { MapPoint, PointEntity } from "@repo/domain";

export const EditorService = {
  async createPoint(point: PointEntity) {
    const res = await fetch(`/map/point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(point),
    });

    if (!res.ok) {
      throw new Error("Failed to create point");
    }

    return res.json();
  },

  async removePoint(point: PointEntity) {
    const res = await fetch(`/map/point/${point.id}`, {
      method: "DELETE",
    });
  },
};
