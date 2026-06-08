import React from "react";
import { Polyline, Polygon, Marker } from "react-leaflet";
import { useEditorStore } from "../../state/editorStore";

export function DraftLayer() {
  const { mode, draftPoint, draftPoints } = useEditorStore();

  if (mode === "create-line") {
    return <Polyline positions={draftPoints.map((p) => [p.x, p.y])} />;
  }

  if (mode === "create-polygon") {
    return <Polygon positions={draftPoints.map((p) => [p.x, p.y])} />;
  }

  if (mode === "create-point" && draftPoint) {
    return <Marker position={[draftPoint.x, draftPoint.y]} />;
  }

  return null;
}
