import { Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export const LinesLayer = () => {
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/map/line").then((res) => {
      setLines(res.data);
    });
  }, []);

  return (
    <>
      {lines.map((l) => (
        <Polyline key={l.id} positions={l.points.map((p: any) => [p.x, p.y])} />
      ))}
    </>
  );
};
