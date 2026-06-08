import { useMap } from "react-leaflet";
import { useEditorStore } from "../state/editorStore";
import { useEffect } from "react";

export function useMapEditor() {
  const map = useMap();
  const mode = useEditorStore((s) => s.mode);
  const setDraftPoint = useEditorStore((s) => s.setDraftPoint);

  useEffect(() => {
    const handler = (e: any) => {
      if (mode === "create-point") {
        setDraftPoint({
          x: e.latlng.lat,
          y: e.latlng.lng,
        });
      }
    };

    map.on("click", handler);

    return () => {
      map.off("click", handler);
    };
  }, [map, mode, setDraftPoint]);

  return null;
}
