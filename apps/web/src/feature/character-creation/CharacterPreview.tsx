import React from "react";
import { StepProps } from "./characterCreator.types";
import { Card } from "@web/component/ui/Card";
import { translate } from "@i18n";
import { CharacterSheet } from "@domain/model/charactersheet";

export type CharacterPreviewProps = {
  character: CharacterSheet;
};

export function CharacterPreview({ character }: CharacterPreviewProps) {
  return (
    <>
      <Card>
        <h3>{translate("characterCreator.preview")}</h3>
        <div>
          <b>{character.name || "Unbenannt"}</b>
        </div>
        <div>
          {character.species} {character.class}
        </div>
        <div>STR {character.getAttributeByName("strength")?.value}</div>
        <div>DEX {character.getAttributeByName("dexterity")?.value}</div>
        <div>CON {character.getAttributeByName("constitution")?.value}</div>
      </Card>
    </>
  );
}
