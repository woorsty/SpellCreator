import { Polygon, Popup } from "react-leaflet";
import React from "react";
import { useMapStore } from "../../state/mapStore";
import { useEditorStore } from "../../state/editorStore";
import { WorldEntity } from "@repo/domain";
import { WorldEntityService } from "../service/editorService";
import { Button } from "../../../../../component/ui/Button";

export const PolygonsLayer = () => {
  const mode = useEditorStore((s) => s.mode);

  const deleteEntity = (entity: WorldEntity) => {
    WorldEntityService.remove(entity);
    useMapStore.getState().loadAll();
  };

  return (
    <>
      {useMapStore().polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.points.map((pt: any) => [pt.x, pt.y])}
          pathOptions={{
            color: polygon.style?.color || "blue",
            fillColor: polygon.style?.fillColor || "blue",
            fillOpacity: polygon.style?.fillOpacity ?? 0.3,
          }}
        >
          <Popup key={polygon.id}>
            <b>{polygon.name}</b>
            <br />
            {polygon.description}
            {mode === "edit" && (
              <Button
                variant={"secondary"}
                onClick={() => deleteEntity(polygon)}
              >
                🚮
              </Button>
            )}
          </Popup>
        </Polygon>
      ))}
    </>
  );
};
