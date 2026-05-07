import React from "react";
import { StepProps } from "../characterCreator.types";
import { translate } from "@i18n";
import { ATTRIBUTES } from "@domain";
import { AttributeCard } from "../../../component/character/AttributeCard";

export function AttributesTab({ character, updateField }: StepProps) {
  return (
    <>
      <h3>{translate("characterCreator.steps.attributes.title")}</h3>

      {ATTRIBUTES.map((attr) => (
        <AttributeCard
          key={attr}
          attributeName={attr}
          attribute={character.attributes[attr]}
          updateField={updateField}
        />
      ))}
    </>
  );
}
