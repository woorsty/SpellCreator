import { Button } from "../../../../../component/ui/Button";
import React from "react";
import { useEditorStore } from "../../state/editorStore";
import { WorldEntity } from "@repo/domain";
import { WorldEntityService } from "../service/editorService";
import { useMapStore } from "../../state/mapStore";
import { Popup } from "react-leaflet";
import { ArticlePreview } from "../../../article/component/ArticlePreview";
import { useNavigate } from "react-router";

type Props = {
  entity: WorldEntity;
};

export const WorldEntityPopup: React.FC<Props> = ({ entity }) => {
  const mode = useEditorStore((s) => s.mode);

  const deleteEntity = (entity: WorldEntity) => {
    WorldEntityService.remove(entity);
    useMapStore.getState().loadAll();
  };
  const navigate = useNavigate();

  if (entity.articleUrl) {
    return (
      <Popup key={entity.id}>
        <ArticlePreview
          articlePath={entity.articleUrl}
          onOpen={() => window.open(`/article/${entity.articleUrl}`, "_blank")}
        />
        {mode === "edit" && (
          <Button variant={"secondary"} onClick={() => deleteEntity(entity)}>
            🚮
          </Button>
        )}
      </Popup>
    );
  }

  return (
    <Popup key={entity.id}>
      <b>{entity.name}</b>
      <br />
      {entity.description}
      {mode === "edit" && (
        <Button variant={"secondary"} onClick={() => deleteEntity(entity)}>
          🚮
        </Button>
      )}
    </Popup>
  );
};
