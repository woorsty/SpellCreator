import { Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export const PointsLayer = () => {
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/map/point").then((res) => {
      setPoints(res.data);
    });
  }, []);

  return (
    <>
      {points.map((p) => (
        <Marker key={p.id} position={[p.position.x, p.position.y]}>
          <Popup>
            <b>{p.name}</b>
            <br />
            {p.description}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
