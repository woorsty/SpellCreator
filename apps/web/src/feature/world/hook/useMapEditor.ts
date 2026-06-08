import { useMap } from "react-leaflet";
import { useEditorStore } from "../state/editorStore";
import { useEffect } from "react";

export function useMapEditor() {
  const map = useMap();

  const mode = useEditorStore((s) => s.mode);
  const addPoint = useEditorStore((s) => s.addPoint);

  useEffect(() => {
    const handler = (e: any) => {
      if (
        mode === "create-point" ||
        mode === "create-line" ||
        mode === "create-polygon"
      ) {
        addPoint({
          x: e.latlng.lat,
          y: e.latlng.lng,
        });
      }
    };

    map.on("click", handler);

    return () => {
      map.off("click", handler); // 👈 WICHTIG
    };
  }, [map, mode, addPoint]);

  return null;
}
