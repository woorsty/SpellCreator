import React, { useEffect } from "react";
import { Card } from "../../../../../component/ui/Card";
import { Select } from "../../../../../component/ui/Select";
import {
  LINE_TYPES,
  POINT_TYPES,
  POLYGON_TYPES,
  WorldEntity,
} from "@repo/domain";
import { Translator } from "@repo/i18n";
import { useArticleStore } from "../../../article/state/articleStore";

type Props = {
  entity: Partial<WorldEntity>;
  onChange: (changes: Partial<WorldEntity>) => void;
};

export const EditEntityForm: React.FC<Props> = ({ entity, onChange }) => {
  if (!entity.entityType) return <></>;

  const translator = new Translator("map.entity");

  const loadPlaces = useArticleStore((s) => s.loadPlaces);
  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  let entityTypes;
  switch (entity.entityType) {
    case "point":
      entityTypes = POINT_TYPES;
      break;
    case "line":
      entityTypes = LINE_TYPES;
      break;
    case "polygon":
      entityTypes = POLYGON_TYPES;
      break;
  }

  return (
    <Card>
      {translator.translate(".type.title")}
      <Select onChange={(e) => onChange({ type: e.target.value })}>
        {entityTypes.map((type) => (
          <option key={type} value={type}>
            {translator.translate(".type." + type)}
          </option>
        ))}
      </Select>
    </Card>
  );
};
