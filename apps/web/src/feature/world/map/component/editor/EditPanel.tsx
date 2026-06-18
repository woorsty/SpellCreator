import React, { use, useState } from "react";
import { useEditorStore } from "../../state/editorStore";
import styles from "./EditPanel.module.css";
import { WorldEntityService } from "../service/editorService";
import { EditForm } from "./EditForm";
import {
  LineEntity,
  PointEntity,
  PolygonEntity,
  WorldEntity,
  WorldEntityBase,
} from "@repo/domain";
import { Card } from "../../../../../component/ui/Card";
import { Button } from "../../../../../component/ui/Button";
import { useMapStore } from "../../state/mapStore";
import { EntityForm } from "./EntityForm";
import { Translator } from "@repo/i18n";

export const EditPanel: React.FC = () => {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const resetDraft = useEditorStore((s) => s.resetDraft);
  const draftPoint = useEditorStore((s) => s.draftPoint);
  const draftPoints = useEditorStore((s) => s.draftPoints);
  const selectedEntity = useEditorStore((s) => s.selectedEntity);
  const setSelectedEntity = useEditorStore((s) => s.setSelectedEntity);

  const [worldEntityBase, setWorldEntityBase] = useState<
    Partial<WorldEntityBase>
  >({
    name: "",
    articleUrl: "",
    description: "",
    tags: [],
  });

  const [newEntity, setNewEntity] = useState<Partial<WorldEntity>>({});

  const translator = new Translator("map");

  const handleSave = async () => {
    if (selectedEntity) {
      editEntity();
    } else {
      createNew();
    }

    await useMapStore.getState().loadAll();
    setMode("idle");
  };

  const editEntity = async () => {
    if (!selectedEntity) {
      return;
    }

    await WorldEntityService.edit(selectedEntity);
  };

  const createNew = async () => {
    const entity: WorldEntity = {
      ...worldEntityBase,
      ...newEntity,
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

    resetDraft();
  };

  return (
    <div className={styles.editPanel}>
      <Card>
        <Button
          variant="secondary"
          onClick={() => setMode(mode === "edit" ? "idle" : "edit")}
        >
          {translator.translate(".abort")}
        </Button>
        {mode === "edit" && !selectedEntity && (
          <>
            <Button
              onClick={() => {
                resetDraft();
                setNewEntity({ entityType: "point" });
                setMode("create-point");
              }}
            >
              {translator.translate(".new_point")}
            </Button>
            <Button
              onClick={() => {
                resetDraft();
                setNewEntity({ entityType: "line" });
                setMode("create-line");
              }}
            >
              {translator.translate(".new_line")}
            </Button>
            <Button
              onClick={() => {
                resetDraft();
                setNewEntity({ entityType: "polygon" });
                setMode("create-polygon");
              }}
            >
              {translator.translate(".new_polygon")}
            </Button>
          </>
        )}

        {(mode === "create-point" ||
          mode === "create-line" ||
          mode === "create-polygon" ||
          selectedEntity) && (
          <>
            <EditForm
              entity={selectedEntity || worldEntityBase}
              onChange={(changes) => {
                if (selectedEntity) {
                  setSelectedEntity({ ...selectedEntity, ...changes });
                } else {
                  setWorldEntityBase((prev) => ({ ...prev, ...changes }));
                }
              }}
            />
            <Button
              disabled={!draftPoint && !draftPoints && !selectedEntity}
              onClick={handleSave}
            >
              {translator.translate(".save")}
            </Button>
          </>
        )}
      </Card>
      {(mode === "create-line" ||
        mode === "create-point" ||
        mode === "create-polygon" ||
        selectedEntity) && (
        <Card>
          <EntityForm
            entity={selectedEntity || newEntity}
            onChange={(changes) => {
              if (selectedEntity) {
                setSelectedEntity({
                  ...selectedEntity,
                  ...changes,
                } as WorldEntity);
              } else {
                setNewEntity((prev) => ({ ...prev, ...changes }));
              }
            }}
          />
        </Card>
      )}
    </div>
  );
};
