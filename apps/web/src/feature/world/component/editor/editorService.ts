import { LineEntity, MapPoint, PointEntity, WorldEntity } from "@repo/domain";

export const WorldEntityService = {
  async create(entity: WorldEntity) {
    console.log("create:", entity);
    const res = await fetch(`/map/${entity.entityType}`, {
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
    const res = await fetch(`/map/${entity.entityType}/${entity.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to remove entity");
    }
  },

  async edit(entity: WorldEntity) {
    const res = await fetch(`/map/${entity.entityType}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entity),
    });

    if (!res.ok) {
      throw new Error("Failed to create entity");
    }

    return res.json();
  },
};
