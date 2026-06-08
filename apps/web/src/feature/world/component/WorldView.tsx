import { useMapMode } from "../hook/useMapMode";
import styles from "../styles/worldMap.module.css";
import React, { useState } from "react";
import { EditPanel } from "./EditPanel";
import { SearchPanel } from "./SearchPanel";
import { TopBar } from "./TopBar";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { Map } from "leaflet";
import { MapBridge } from "../controller/mapController";

export function WorldMap() {
  const { mode, setMode } = useMapMode();
  const [map, setMap] = useState<Map | null>(null);

  const maxTilesX = 200;
  const baseTilesX = 198;
  const maxTilesY = 104;
  const shiftX = 41;

  const minX = 0;
  const maxX = baseTilesX + shiftX;

  const bounds: L.LatLngBoundsExpression = [
    [-maxTilesY, minX],
    [0, maxX],
  ];
  const center: L.LatLngExpression = [-maxTilesY / 2, (minX + maxX) / 2];

  return (
    <div className={styles.container}>
      <MapContainer
        crs={L.CRS.Simple}
        center={center}
        zoom={4}
        minZoom={1}
        maxZoom={8}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url={`/map-tiles/{z}/{x}/{y}.png`}
          noWrap={true}
          tileSize={256}
        />

        <MapBridge onReady={setMap} />
      </MapContainer>

      <TopBar mode={mode} setMode={setMode} map={map} />

      {mode === "show" && <SearchPanel />}
      {mode === "edit" && <EditPanel />}
    </div>
  );
}
