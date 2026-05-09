import React from "react";
import { Card } from "../../component/ui/Card";
import { translate } from "@i18n";
import { CharacterSheet } from "@domain";

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
          {character.species} {character.characterClass}
        </div>
        <div>STR {character.attributes.strength.value}</div>
        <div>DEX {character.attributes.dexterity.value}</div>
        <div>CON {character.attributes.constitution.value}</div>
      </Card>
    </>
  );
}
