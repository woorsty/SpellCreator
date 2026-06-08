import { useMap } from "react-leaflet";
import type { Map } from "leaflet";
import { useEffect } from "react";
import { useMapEditor } from "../hook/useMapEditor";

type Props = {
  onReady: (map: Map) => void;
};

export function MapBridge({ onReady }: Props) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

export const MapEditorController = () => {
  useMapEditor();
  return null;
};
