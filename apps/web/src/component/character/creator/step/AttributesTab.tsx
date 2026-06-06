import React from "react";
import { translate } from "@repo/i18n";
import { Attribute, ATTRIBUTE_SKILLS } from "@repo/domain";
import { StepProps } from "../../../../feature/character/characterCreator.types";
import { AttributeCard } from "../AttributeCard";

export function AttributesTab({ character, updateField }: StepProps) {
  return (
    <>
      <h3>{translate("characterCreator.steps.attributes.title")}</h3>

      {Object.keys(ATTRIBUTE_SKILLS).map((attr) => (
        <AttributeCard
          key={attr}
          attributeName={attr as Attribute}
          character={character}
          updateField={updateField}
        />
      ))}
    </>
  );
}
