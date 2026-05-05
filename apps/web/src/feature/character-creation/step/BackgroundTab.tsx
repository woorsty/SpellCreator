import React from "react";
import { StepProps } from "../characterCreator.types";
import { translate } from "@i18n";
import { Input } from "@web/component/ui/Input";

export function BackgroundTab({ character, updateField }: StepProps) {
  return (
    <>
      <h3>{translate("characterCreator.steps.background")}</h3>

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
