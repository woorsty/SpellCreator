import { Marker, Popup } from "react-leaflet";
import React from "react";
import { useMapStore } from "../../state/mapStore";
import { Button } from "../../../../component/ui/Button";
import { EditorService } from "../editor/editorService";
import { PointEntity } from "@repo/domain";

export const PointsLayer = () => {
  const deletePoint = (point: PointEntity) => {
    EditorService.removePoint(point);
    useMapStore.getState().loadAll();
  };

  return (
    <>
      {useMapStore().points.map((p) => (
        <Marker key={p.id} position={[p.position.x, p.position.y]}>
          <Popup key={p.id}>
            <b>{p.name}</b>
            <br />
            {p.description}
            <Button variant={"secondary"} onClick={() => deletePoint(p)}>
              X
            </Button>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
