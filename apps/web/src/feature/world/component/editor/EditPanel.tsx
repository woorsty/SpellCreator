import React, { useState } from "react";
import { useEditorStore } from "../../state/editorStore";
import styles from "./EditPanel.module.css";
import { EditorService } from "./editorService";
import { EditForm } from "./EditForm";
import { PointEntity, WorldEntityBase } from "@repo/domain";
import { Card } from "../../../../component/ui/Card";
import { Button } from "../../../../component/ui/Button";
import { useMapStore } from "../../state/mapStore";

export const EditPanel = () => {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const resetDraft = useEditorStore((s) => s.resetDraft);
  const draftPoint = useEditorStore((s) => s.draftPoint);
  const [worldEntityBase, setWorldEntityBase] = useState<
    Partial<WorldEntityBase>
  >({
    name: "",
    activeFrom: -1,
    activeTo: -1,
    articleUrl: "",
    description: "",
    imageUrl: "",
    tags: [],
  });

  const [currentPoint, setPointEntity] = useState<Partial<PointEntity>>({
    entityType: "point",
  });

  const handleSave = async () => {
    if (!draftPoint) return;
    const entity: PointEntity = {
      ...worldEntityBase,
      ...currentPoint,
      position: draftPoint,
    } as PointEntity;

    await EditorService.createPoint(entity);

    await useMapStore.getState().loadAll();

    resetDraft();
    setMode("idle");
  };

  return (
    <div className={styles.editPanel}>
      <Card>
        <div className={styles.title}>Editor</div>

        {mode === "edit" && (
          <button
            onClick={() => {
              resetDraft();
              setMode("create-point");
            }}
          >
            Neuer Ort
          </button>
        )}

        {mode === "create-point" && (
          <>
            <EditForm
              entity={worldEntityBase}
              onChange={(changes) =>
                setWorldEntityBase((prev) => ({ ...prev, ...changes }))
              }
            />
            <Button disabled={!draftPoint} onClick={handleSave}>
              Speichern
            </Button>
          </>
        )}

        <br />
        <br />
        <br />
        <div>Mode: {mode}</div>
      </Card>
    </div>
  );
};
