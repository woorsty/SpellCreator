import { WorldEntity } from "@repo/domain";
import { API_BASE } from "./base";

export const MapApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/map`);
    const data = await res.json();

    return {
      points: data.points,
      lines: data.lines,
      polygons: data.polygons,
    };
  },

  async create(entity: WorldEntity) {
    console.log("create:", entity);
    const res = await fetch(`${API_BASE}/map/${entity.entityType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entity),
    });
    console.log("created:", entity);

    if (!res.ok) {
      throw new Error("Failed to create entity");
    }

    return res.json();
  },

  async remove(entity: WorldEntity) {
    const res = await fetch(
      `${API_BASE}/map/${entity.entityType}/${entity.id}`,
      {
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to remove entity");
    }
  },

  async edit(entity: WorldEntity) {
    console.log("PUT", entity);
    const res = await fetch(
      `${API_BASE}/map/${entity.entityType}/${entity.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entity),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to create entity");
    }

    return res.json();
  },
};
