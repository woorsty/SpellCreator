import React from "react";
import styles from "../styles/worldMap.module.css";
import { Map } from "leaflet";
import { Translator } from "@repo/i18n";

type Props = {
  mode: "show" | "edit";
  setMode: (m: "show" | "edit") => void;
  map?: Map;
};

export function TopBar({ mode, setMode, map }: Props) {
  const translator = new Translator("map");

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
        onClick={() => setMode(mode === "show" ? "edit" : "show")}
      >
        {mode === "show"
          ? translator.translate(".edit_mode")
          : translator.translate(".show_mode")}
      </button>
    </div>
  );
}
