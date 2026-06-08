import React from "react";
import styles from "../styles/worldMap.module.css";
import { Translator } from "@repo/i18n";

export function SearchPanel() {
  const translator = new Translator("map");
  return (
    <div className={styles.searchPanel}>
      <input
        className={styles.input}
        placeholder={translator.translate(".search")}
      />
    </div>
  );
}
