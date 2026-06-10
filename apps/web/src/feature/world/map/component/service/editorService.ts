import { WorldEntity } from "@repo/domain";
import { MapApi } from "../../../../../api/map-api";

export const WorldEntityService = {
  async create(entity: WorldEntity) {
    return MapApi.create(entity);
  },

  async remove(entity: WorldEntity) {
    return MapApi.remove(entity);
  },

  async edit(entity: WorldEntity) {
    return MapApi.edit(entity);
  },
};
