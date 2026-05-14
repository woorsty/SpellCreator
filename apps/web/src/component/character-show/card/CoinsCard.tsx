import React, { useState } from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { NumberInput } from "../../ui/NumberInput";
import { Translator } from "@repo/i18n";

export const CoinsCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const [editMode, setEditMode] = useState({
    copper: false,
    silver: false,
    electrum: false,
    gold: false,
    platinum: false,
  });

  const translator = new Translator("characterShow.card.coins");

  const renderRow = (
    coinName: "copper" | "silver" | "electrum" | "gold" | "platinum",
  ) => {
    return (
      <div
        className="quickbox"
        onClick={() => {
          setEditMode({ ...editMode, [coinName]: !editMode[coinName] });
        }}
      >
        <div className="label">
          {translator.translate(`.${coinName}_short`)}
        </div>
        {editMode[coinName] ? (
          <NumberInput
            onClick={(e) => e.stopPropagation()}
            className="w-18"
            value={character.coins[coinName]}
            onChange={(e) => updateCharacter(`coins.${coinName}`, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditMode({ ...editMode, [coinName]: false });
              }
            }}
          />
        ) : (
          <div className="value">{character.coins[coinName]}</div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <h2 className="section-title">{translator.translate(".title")}</h2>
      <div className="money">
        {renderRow("copper")}
        {renderRow("silver")}
        {renderRow("electrum")}
        {renderRow("gold")}
        {renderRow("platinum")}
      </div>
    </div>
  );
};
