import React from "react";
import { translate } from "@i18n";
import { Input } from "../../../component/ui/Input";
import { StepProps } from "../characterCreator.types";

export function EquipmentTab({ character, updateField }: StepProps) {
  return (
    <>
      <h3>{translate("characterCreator.steps.attributes")}</h3>

      {character.attributes.map((attr) => (
        <div key={attr.name}>
          <label>{translate(`character.${attr.name}`)}</label>
          <Input
            type="number"
            value={attr.value}
            onChange={(e) =>
              updateField(attr.name as any, Number(e.target.value))
            }
          />
        </div>
      ))}
    </>
  );
}
