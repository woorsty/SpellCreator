import { CharacterViewProps } from "./CharacterViewProps";
import React from "react";
import { NumberInput } from "../../../ui/NumberInput";
import { Card } from "../../../ui/Card";

export const LevelCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <div className="quickbox">
      <Card>
        <div className="label">Stufe</div>
        <NumberInput
          min={1}
          onChange={(e) => updateCharacter("level", e)}
          value={character.level}
        />
      </Card>
      <Card>
        <div className="label">EP</div>
        <NumberInput
          min={0}
          value={character.xp}
          onChange={(e) => updateCharacter("xp", e)}
        />
      </Card>
    </div>
  );
};
