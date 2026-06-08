import React from "react";
import { useEditorStore } from "../../state/editorStore";
import styles from "./EditPanel.module.css";

export const EditPanel = () => {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const resetDraft = useEditorStore((s) => s.resetDraft);
  const draftPoint = useEditorStore((s) => s.draftPoint);

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
      <button
        disabled={!draftPoint}
        onClick={async () => {
          console.log("saving point", draftPoint);
          await fetch("/map/point", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: "1",
              name: "Neuer Ort",
              description: "",
              type: "city",
              position: draftPoint,
            }),
          });

          resetDraft();
        }}
      >
        Speichern
      </button>

      <div>Mode: {mode}</div>
    </div>
  );
};
