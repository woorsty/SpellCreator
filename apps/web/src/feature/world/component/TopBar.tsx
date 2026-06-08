import React from "react";
import styles from "../styles/worldMap.module.css";
import { Map } from "leaflet";
import { Translator } from "@repo/i18n";
import { useEditorStore } from "../state/editorStore";

type Props = {
  map: Map | null;
};

export function TopBar({ map }: Props) {
  const translator = new Translator("map");

  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);

  return (
    <div className={styles.topBar}>
      <button onClick={() => window.history.back()} className={styles.button}>
        ← {translator.translate(".back")}
      </button>

      <div>
        <button
          className={styles.button}
          onClick={() => map?.setZoom(Math.min(map.getZoom() + 1, 8))}
        >
          +
        </button>
        <button
          className={styles.button}
          onClick={() => map?.setZoom(Math.max(map.getZoom() - 1, 1))}
        >
          -
        </button>
      </div>

      <button
        className={styles.button}
        onClick={() => setMode(mode === "idle" ? "edit" : "idle")}
      >
        {mode === "idle"
          ? translator.translate(".edit_mode")
          : translator.translate(".show_mode")}
      </button>
    </div>
  );
}
