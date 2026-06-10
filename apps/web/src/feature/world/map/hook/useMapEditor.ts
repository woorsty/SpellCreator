import { useMap } from "react-leaflet";
import { useEditorStore } from "../state/editorStore";
import { useEffect } from "react";

export function useMapEditor() {
  const map = useMap();
  const mode = useEditorStore((s) => s.mode);
  const setSingleDraftPoint = useEditorStore((s) => s.setSingleDraftPoint);
  const addPoint = useEditorStore((s) => s.addPoint);

  useEffect(() => {
    const handler = (e: any) => {
      if (mode === "create-point") {
        setSingleDraftPoint({
          x: e.latlng.lat,
          y: e.latlng.lng,
        });
      }
      if (mode === "create-line" || mode === "create-polygon") {
        addPoint({
          x: e.latlng.lat,
          y: e.latlng.lng,
        });
      }
    };

    map.on("click", handler);

    return () => {
      map.off("click", handler);
    };
  }, [map, mode, setSingleDraftPoint]);

  return null;
}
