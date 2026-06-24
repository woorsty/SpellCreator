import { Button } from "../../../../../component/ui/Button";
import React, { useEffect, useState } from "react";
import { useEditorStore } from "../../state/editorStore";
import { Article, WorldEntity } from "@repo/domain";
import { WorldEntityService } from "../service/editorService";
import { useMapStore } from "../../state/mapStore";
import { Popup } from "react-leaflet";
import { ArticlePreview } from "../../../article/component/ArticlePreview";
import { Translator } from "@repo/i18n";
import { loadArticle } from "../../../article/controller/articleController";

type Props = {
  entity: WorldEntity;
};

export const WorldEntityPopup: React.FC<Props> = ({ entity }) => {
  const mode = useEditorStore((s) => s.mode);
  const translator = new Translator("map.popup");

  const deleteEntity = (entity: WorldEntity) => {
    WorldEntityService.remove(entity);
    useMapStore.getState().loadAll();
  };

  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticle("/article/places/" + entity.name).then((value) => {
      setArticle(value);
    });
  }, [loadArticle]);

  if (article) {
    return (
      <Popup key={entity.id}>
        <ArticlePreview
          article={article}
          onOpen={() => window.open(`/article/places/${entity.name}`, "_blank")}
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
      <Button
        onClick={() => window.open(`/article/places/${entity.name}`, "_blank")}
      >
        {translator.translate(".create_article")}
      </Button>
      {mode === "edit" && (
        <Button variant={"secondary"} onClick={() => deleteEntity(entity)}>
          🚮
        </Button>
      )}
    </Popup>
  );
};
