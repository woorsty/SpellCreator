import { Marker } from "react-leaflet";
import React from "react";
import { useMapStore } from "../../state/mapStore";
import { WorldEntityPopup } from "./WorldEntityPopup";

export const PointsLayer = () => {
  return (
    <>
      {useMapStore().points.map((point) => (
        <Marker key={point.id} position={[point.position.x, point.position.y]}>
          <WorldEntityPopup entity={point} />
        </Marker>
      ))}
    </>
  );
};
