import { useMap } from "react-leaflet";
import type { Map } from "leaflet";
import { useEffect } from "react";

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
