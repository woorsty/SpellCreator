import React from "react";
import styles from "../styles/worldMap.module.css";

export function EditPanel() {
  return (
    <div className={styles.editPanel}>
      <button className={styles.toolButton}>+ City</button>
      <button className={styles.toolButton}>+ Marker</button>
      <button className={styles.toolButton}>+ Quest</button>
    </div>
  );
}
