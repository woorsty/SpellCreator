import { Marker } from "react-leaflet";
import React from "react";
import { useMapStore } from "../../state/mapStore";
import { WorldEntityPopup } from "./WorldEntityPopup";
import { useEditorStore } from "../../state/editorStore";

export const PointsLayer = () => {
  const setSelectedEntity = useEditorStore((s) => s.setSelectedEntity);
  return (
    <>
      {useMapStore().points.map((point) => (
        <Marker
          key={point.id}
          position={[point.position.x, point.position.y]}
          eventHandlers={{
            click: (e) => {
              setSelectedEntity(point);
            },
          }}
        >
          <WorldEntityPopup entity={point} />
        </Marker>
      ))}
    </>
  );
};
