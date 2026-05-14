import React, { useState } from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { Translator } from "@repo/i18n";
import { FeatureList } from "../ui/FeatureList";

export const ClassFeatsCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const translator = new Translator();
  return (
    <div className="grid-2">
      <FeatureList
        character={character}
        updateCharacter={updateCharacter}
        editable={false}
        title="Klassenmerkmale"
        items={character.characterClass.features
          .map((f) => {
            return {
              name: translator.translate(
                `characterClass.${character.characterClass.id}.features.${f.id}.name`,
              ),
              level: f.level,
              notes: translator.translate(
                `characterClass.${character.characterClass.id}.features.${f.id}.description`,
              ),
            };
          })
          .concat(
            character.subclass
              ? character.subclass.features.map((f) => {
                  return {
                    name: translator.translate(
                      `characterClass.${character.characterClass.id}.subclasses.${character.subclass!.id}.features.${f.id}.name`,
                    ),
                    level: f.level,
                    notes: translator.translate(
                      `characterClass.${character.characterClass.id}.subclasses.${character.subclass?.id}.features.${f.id}.description`,
                    ),
                  };
                })
              : [],
          )
          .sort((a, b) => a.level - b.level)
          .map((feat, i) => {
            return { ...feat, index: i };
          })}
      />
      <FeatureList
        character={character}
        updateCharacter={updateCharacter}
        editable={false}
        title="Volksmerkmale"
        items={character.species.feats.map((f, i) => {
          return {
            name: translator.translate(
              `species.${character.species.id}.feats.${f.id}.name`,
            ),
            notes: translator.translate(
              `species.${character.species.id}.feats.${f.id}.description`,
            ),
            index: i,
          };
        })}
      />
    </div>
  );
};
