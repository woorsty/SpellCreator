import { Polyline } from "react-leaflet";
import React from "react";
import { useMapStore } from "../../state/mapStore";
import { WorldEntityPopup } from "./WorldEntityPopup";

export const LinesLayer = () => {
  return (
    <>
      {useMapStore().lines.map((line) => (
        <Polyline
          key={line.id}
          positions={line.points.map((p: any) => [p.x, p.y])}
        >
          <WorldEntityPopup entity={line} />
        </Polyline>
      ))}
    </>
  );
};
