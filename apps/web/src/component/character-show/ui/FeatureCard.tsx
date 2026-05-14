import { CharacterSheet } from "@repo/domain";
import React from "react";
import { useState } from "react";
import { TextArea } from "../../ui/TextArea";

type Props = {
  character: CharacterSheet;
  feature: {
    index: number;
    name: string;
    notes?: string;
    editPath?: string;
  };
  editable: boolean;
  updateCharacter: (key: keyof CharacterSheet | string, value: any) => void;
};

export const FeatureCard: React.FC<Props> = ({
  character,
  feature,
  editable = false,
  updateCharacter,
}) => {
  const [open, setOpen] = useState(false);

  const updateEquipmentNote = (value: string) => {
    const equipment = character[
      feature.editPath! as keyof CharacterSheet
    ] as any[];

    const updatedEquipment = [...equipment];

    updatedEquipment[feature.index] = {
      ...updatedEquipment[feature.index],
      notes: value,
    };

    updateCharacter(feature.editPath!, updatedEquipment);
  };

  return (
    <div
      className="rounded-xl border border-border bg-surface p-4 shadow-sm"
      onClick={() => setOpen(!open)}
    >
      <div className="title">{feature.name}</div>

      {open &&
        (editable && feature.editPath ? (
          <TextArea
            onChange={(e) => {
              console.log("Update Card", feature.editPath, e.target.value);
              // updateCharacter(feature.editPath! + ".notes", e.target.value);
              updateEquipmentNote(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            value={feature.notes}
          />
        ) : (
          feature.notes && (
            <div className="border rounded-xl border-border p-2 shadow-sm">
              {feature.notes.split("\n").map((line) => (
                <p>{line}</p>
              ))}{" "}
            </div>
          )
        ))}
    </div>
  );
};
