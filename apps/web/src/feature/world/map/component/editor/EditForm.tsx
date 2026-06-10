import { MapEntity, WorldEntityBase } from "@repo/domain";
import React, { useState } from "react";
import { Checkbox } from "../../../../../component/ui/Checkbox";
import { TextArea } from "../../../../../component/ui/TextArea";
import { Input } from "../../../../../component/ui/Input";
import { NumberInput } from "../../../../../component/ui/NumberInput";

type Props = {
  entity: Partial<WorldEntityBase>;
  onChange: (changes: Partial<WorldEntityBase>) => void;
};

export const EditForm: React.FC<Props> = ({ entity, onChange }) => {
  const [tagInput, setTagInput] = useState("");
  const [validYearsVisible, setValidYearsVisible] = useState(
    entity.activeFrom !== undefined || entity.activeTo !== undefined,
  );

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
        placeholder="Name"
        value={entity.name}
        onChange={(e) => updateEntity({ name: e.target.value })}
      />
      <TextArea
        placeholder="Beschreibung"
        value={entity.description}
        onChange={(e) => updateEntity({ description: e.target.value })}
      />
      <Checkbox
        checked={validYearsVisible}
        onChange={(value) => setValidYearsVisible(value as boolean)}
      />
      {validYearsVisible && (
        <>
          <NumberInput
            placeholder="Von"
            value={entity.activeFrom || 0}
            onChange={(e) => updateEntity({ activeFrom: e as number })}
          />
          <NumberInput
            type="number"
            placeholder="Bis"
            value={entity.activeTo || 0}
            onChange={(e) => updateEntity({ activeTo: e as number })}
          />
        </>
      )}
      <Input
        placeholder="Tag hinzufügen..."
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
      />

      <button onClick={addTag}>Hinzufügen</button>
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
