import React from "react";
import { StepProps } from "../characterCreator.types";
import { Species } from "@domain";
import { translate } from "@i18n";

export function CharacterClassTab({ character, updateField }: StepProps) {
  return (
    <>
      <h3>{translate("characterCreator.steps.class")}</h3>

      {Object.values(Species).map((species) => (
        <div key={species} onClick={() => updateField("species", species)}>
          {translate(`species.${species}`)}
        </div>
      ))}
    </>
  );
}
