import React from "react";
import { useEditorStore } from "../../state/editorStore";
import styles from "./EditPanel.module.css";

export const EditPanel = () => {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const resetDraft = useEditorStore((s) => s.resetDraft);

  return (
    <div className={styles.editPanel}>
      <div className={styles.title}>Editor</div>

      <button
        onClick={() => {
          resetDraft();
          setMode("create-point");
        }}
      >
        Neuer Ort
      </button>

      <div>Mode: {mode}</div>
    </div>
  );
};
