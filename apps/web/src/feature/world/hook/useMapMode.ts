import { useState } from "react";

export type MapMode = "show" | "edit";

export function useMapMode() {
  const [mode, setMode] = useState<MapMode>("show");

  return {
    mode,
    setMode,
    isShow: mode === "show",
    isEdit: mode === "edit",
  };
}
