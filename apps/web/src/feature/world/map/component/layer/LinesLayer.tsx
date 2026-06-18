import { Polyline } from "react-leaflet";
import React from "react";
import { useMapStore } from "../../state/mapStore";
import { WorldEntityPopup } from "./WorldEntityPopup";
import { useEditorStore } from "../../state/editorStore";

export const LinesLayer = () => {
  const setSelectedEntity = useEditorStore((s) => s.setSelectedEntity);

  return (
    <>
      {useMapStore().lines.map((line) => (
        <Polyline
          key={line.id}
          positions={line.points.map((p: any) => [p.x, p.y])}
          eventHandlers={{
            click: (e) => {
              setSelectedEntity(line);
            },
          }}
        >
          <WorldEntityPopup entity={line} />
        </Polyline>
      ))}
    </>
  );
};
