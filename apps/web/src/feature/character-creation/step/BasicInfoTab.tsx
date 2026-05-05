import React from "react";
import { StepProps } from "../characterCreator.types";
import { translate } from "@i18n";
import { Input } from "@web/component/ui/Input";

export function BasicInfoTab({ character, updateField }: StepProps) {
  return (
    <>
      <h3>{translate("characterCreator.steps.base")}</h3>

      <Input
        value={character.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Name"
      />

      <Input
        value={character.background}
        onChange={(e) => updateField("background", e.target.value)}
        placeholder="Hintergrund"
      />
    </>
  );
}
