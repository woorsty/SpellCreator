import styles from "../styles/worldMap.module.css";
import React, { useEffect, useState } from "react";
import { EditPanel } from "./editor/EditPanel";
import { SearchPanel } from "./SearchPanel";
import { TopBar } from "./TopBar";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { Map } from "leaflet";
import { MapEditorController } from "../controller/mapController";
import { PointsLayer } from "./layer/PointsLayer";
import { LinesLayer } from "./layer/LinesLayer";
import { PolygonsLayer } from "./layer/PolygonsLayer";
import { DraftLayer } from "./layer/DraftLayer";
import { useEditorStore } from "../state/editorStore";
import { useMapStore } from "../state/mapStore";

export function WorldMap() {
  const loadAll = useMapStore((s) => s.loadAll);
  const mode = useEditorStore((s) => s.mode);
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

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <TopBar map={map} />
      </div>

      <div className={styles.main}>
        <div className={styles.map}>
          <MapContainer
            center={center}
            zoom={4}
            minZoom={1}
            maxZoom={8}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
            crs={L.CRS.Simple}
          >
            <TileLayer
              url={`${import.meta.env.VITE_API_BASE}/map-tiles/{z}/{x}/{y}.png`}
              noWrap={true}
              bounds={bounds}
              tileSize={256}
            />
            <MapEditorController />

            <PointsLayer />
            <LinesLayer />
            <PolygonsLayer />
            <DraftLayer />
          </MapContainer>
        </div>

        {mode !== "idle" && (
          <div className={styles.sidebar}>
            {" "}
            <EditPanel />
          </div>
        )}
        <SearchPanel />
      </div>
    </div>
  );
}
