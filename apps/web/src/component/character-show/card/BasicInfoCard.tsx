import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { Translator } from "@repo/i18n";

export const BasicInfoCard: React.FC<CharacterViewProps> = ({ character }) => {
  const translator = new Translator();
  return (
    <div className="character-info">
      <div className="card">
        <div className="label">Charaktername</div>
        <div className="value">{character.name}</div>
      </div>
      <div className="grid-2-small">
        <div className="card">
          <div className="label">Hintergrund</div>
          <div className="value">
            {translator.translate(`background.${character.background.id}`)}
          </div>
        </div>
        <div className="card">
          <div className="label">Klasse</div>
          <div className="value">
            {translator.translate(
              `characterClass.${character.characterClass.id}.title`,
            )}
          </div>
        </div>
        <div className="card">
          <div className="label">Volk</div>
          <div className="value">
            {translator.translate(`species.${character.species.id}.name`)}
          </div>
        </div>
        <div className="card">
          <div className="label">Unterklasse</div>
          <div className="value">
            {translator.translate(
              `characterClass.${character.characterClass.id}.subclasses.${character.subclass?.id}.title`,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
