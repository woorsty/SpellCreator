import React, { useState } from "react";
import { useEditorStore } from "../../state/editorStore";
import styles from "./EditPanel.module.css";
import { WorldEntityService } from "./editorService";
import { EditForm } from "./EditForm";
import {
  LineEntity,
  PointEntity,
  PolygonEntity,
  WorldEntity,
  WorldEntityBase,
} from "@repo/domain";
import { Card } from "../../../../component/ui/Card";
import { Button } from "../../../../component/ui/Button";
import { useMapStore } from "../../state/mapStore";

export const EditPanel = () => {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const resetDraft = useEditorStore((s) => s.resetDraft);
  const draftPoint = useEditorStore((s) => s.draftPoint);
  const draftPoints = useEditorStore((s) => s.draftPoints);
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

  const [currentEntity, setCurrentEntity] = useState<Partial<WorldEntity>>({});

  const handleSave = async () => {
    const entity: WorldEntity = {
      ...worldEntityBase,
      ...currentEntity,
    } as WorldEntity;

    switch (mode) {
      case "create-point":
        if (!draftPoint) return;
        entity.entityType = "point";
        (entity as PointEntity).position = draftPoint;
        break;
      case "create-line":
        if (!draftPoints) return;
        entity.entityType = "line";
        (entity as LineEntity).points = draftPoints;
        break;
      case "create-polygon":
        if (!draftPoints) return;
        entity.entityType = "polygon";
        (entity as PolygonEntity).points = draftPoints;
        break;
    }

    await WorldEntityService.create(entity);

    await useMapStore.getState().loadAll();

    resetDraft();
    setMode("idle");
  };

  return (
    <div className={styles.editPanel}>
      <Card>
        <div className={styles.title}>Editor</div>

        {mode === "edit" && (
          <>
            <Button
              onClick={() => {
                resetDraft();
                setMode("create-point");
              }}
            >
              Neuer Ort
            </Button>
            <Button
              onClick={() => {
                resetDraft();
                setMode("create-line");
              }}
            >
              Neue Linie
            </Button>
            <Button
              onClick={() => {
                resetDraft();
                setMode("create-polygon");
              }}
            >
              Neues Gebiet
            </Button>
          </>
        )}

        {(mode === "create-point" ||
          mode === "create-line" ||
          mode === "create-polygon") && (
          <>
            <EditForm
              entity={worldEntityBase}
              onChange={(changes) =>
                setWorldEntityBase((prev) => ({ ...prev, ...changes }))
              }
            />
            <Button disabled={!draftPoint && !draftPoints} onClick={handleSave}>
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
