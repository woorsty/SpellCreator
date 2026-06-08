import { Polygon } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export const PolygonsLayer = () => {
  const [polygons, setPolygons] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/map/polygon").then((res) => {
      setPolygons(res.data);
    });
  }, []);

  return (
    <>
      {polygons.map((p) => (
        <Polygon
          key={p.id}
          positions={p.points.map((pt: any) => [pt.x, pt.y])}
          pathOptions={{
            color: p.style?.color || "blue",
            fillColor: p.style?.fillColor || "blue",
            fillOpacity: p.style?.fillOpacity ?? 0.3,
          }}
        />
      ))}
    </>
  );
};
