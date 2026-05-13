import React, { useState } from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { Translator } from "@i18n";
import { ListCard } from "../../ui/ListCard";

export const ClassFeatsCard: React.FC<CharacterViewProps> = ({ character }) => {
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const translator = new Translator();
  return (
    <div className="grid-2">
      <ListCard
        title="Klassenmerkmale"
        items={character.characterClass.features
          .map((f) => {
            return {
              name: translator.translate(
                `characterClass.${character.characterClass.id}.features.${f.id}.name`,
              ),
              level: f.level,
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
                  };
                })
              : [],
          )
          .sort((a, b) => a.level - b.level)
          .map((f) => f.name)}
      />
      <ListCard
        title="Volksmerkmale"
        items={character.species.feats.map((f) =>
          translator.translate(
            `species.${character.species.id}.feats.${f.id}.name`,
          ),
        )}
      />
    </div>
  );
};
