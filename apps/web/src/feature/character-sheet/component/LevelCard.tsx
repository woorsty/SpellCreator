import { CharacterViewProps } from "./CharacterViewProps";
import React from "react";
import { NumberInput } from "../../../component/ui/NumberInput";
import "../CharacterSheetView.css";
import { Card } from "../../../component/ui/Card";

export const LevelCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <div className="quickbox">
      <Card>
        <div className="label">Stufe</div>
        <NumberInput
          onChange={(e) => updateCharacter("level", e)}
          className="value"
          value={character.level}
        />
      </Card>
      <Card>
        <div className="label">EP</div>
        <NumberInput
          value={character.xp}
          onChange={(e) => updateCharacter("xp", e)}
          className="value"
        />
      </Card>
    </div>
  );
};
