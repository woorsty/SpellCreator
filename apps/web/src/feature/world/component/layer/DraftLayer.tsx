import React from "react";
import { Polyline, Polygon, Marker } from "react-leaflet";
import { useEditorStore } from "../../state/editorStore";

export function DraftLayer() {
  const { mode, draftPoints } = useEditorStore();

  if (mode === "create-line") {
    return <Polyline positions={draftPoints.map((p) => [p.x, p.y])} />;
  }

  if (mode === "create-polygon") {
    return <Polygon positions={draftPoints.map((p) => [p.x, p.y])} />;
  }

  if (mode === "create-point" && draftPoints[0]) {
    return <Marker position={[draftPoints[0].x, draftPoints[0].y]} />;
  }

  return null;
}
