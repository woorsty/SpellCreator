import { MapEntity, WorldEntityBase } from "@repo/domain";
import React, { useState } from "react";
import { Checkbox } from "../../../../../component/ui/Checkbox";
import { TextArea } from "../../../../../component/ui/TextArea";
import { Input } from "../../../../../component/ui/Input";
import { NumberInput } from "../../../../../component/ui/NumberInput";
import { Button } from "../../../../../component/ui/Button";
import { Card } from "../../../../../component/ui/Card";
import { Translator } from "@repo/i18n";
import { useArticleStore } from "../../../article/state/articleStore";

type Props = {
  entity: Partial<WorldEntityBase>;
  onChange: (changes: Partial<WorldEntityBase>) => void;
};

export const EditBaseForm: React.FC<Props> = ({ entity, onChange }) => {
  const translator = new Translator("map.entity");
  const [tagInput, setTagInput] = useState("");
  const [validYearsVisible, setValidYearsVisible] = useState(
    entity.activeFrom !== undefined || entity.activeTo !== undefined,
  );
  const places = useArticleStore((s) => s.places);

  const updateEntity = (changes: Partial<WorldEntityBase>) => {
    onChange(changes);
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;

    if (entity.tags?.includes(value)) return;

    onChange({ tags: [...(entity.tags ?? []), value] });

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    onChange({
      tags: entity.tags?.filter((t) => t !== tag) ?? [],
    });
  };

  return (
    <>
      <Input
        list="article-suggestions"
        placeholder={translator.translate(".name")}
        value={entity.name}
        className="w-full m-0.5"
        onChange={(e) =>
          updateEntity({
            name: e.target.value,
          })
        }
      />

      <datalist id="article-suggestions">
        {places.map((place) => (
          <option key={place.name.split(".")[0]} value={place.name} />
        ))}
      </datalist>
      <Card>
        <Checkbox
          checked={validYearsVisible}
          onChange={(value) => {
            setValidYearsVisible(value as boolean);
            updateEntity({ activeFrom: undefined, activeTo: undefined });
          }}
        />{" "}
        {translator.translate(".timespan")}
        {validYearsVisible && (
          <>
            <div className="flex">
              <p>{translator.translate(".timespan_from")}</p>
              <NumberInput
                className="w-full m-0.5"
                placeholder={translator.translate(".timespan_from_max")}
                value={entity.activeFrom}
                onChange={(e) => updateEntity({ activeFrom: e as number })}
              />
            </div>
            <div className="flex">
              <p>{translator.translate(".timespan_to")}</p>
              <NumberInput
                type="number"
                className="w-full m-0.5"
                placeholder={translator.translate(".timespan_to_max")}
                value={entity.activeTo}
                onChange={(e) => updateEntity({ activeTo: e as number })}
              />
            </div>
          </>
        )}
      </Card>
      <div className="w-full flex">
        <Input
          placeholder={translator.translate(".add_tag")}
          value={tagInput}
          className="m-0.5"
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />

        <Button className="m-0.5" variant="secondary" onClick={addTag}>
          +
        </Button>
      </div>
      <div>
        {entity.tags?.map((tag) => (
          <span
            key={tag}
            onClick={() => removeTag(tag)}
            style={{
              display: "inline-block",
              marginRight: 6,
              padding: "4px 8px",
              borderRadius: 6,
              background: "#333",
              cursor: "pointer",
            }}
          >
            {tag} ✕
          </span>
        ))}
      </div>
    </>
  );
};
