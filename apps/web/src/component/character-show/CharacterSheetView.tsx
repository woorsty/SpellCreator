import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { Translator } from "@repo/i18n";
import { CharacterService, CharacterSheet, fetchUrl } from "@repo/domain";
import "./CharacterSheetView.css";
import { BasicInfoCard } from "./card/BasicInfoCard";
import { LevelCard } from "./card/LevelCard";
import { HitPointCard } from "./card/HitPointCard";
import { DeathSavesCard } from "./card/DeathSavesCard";
import { AttributesCard } from "./card/AttributesCard";
import { characterReducer } from "./CharacterShow.reducer";
import { ListCard } from "../ui/ListCard";
import { TrainingCard } from "./card/TrainingCard";
import { BaseStatsCard } from "./card/BaseStatsCard";
import { SpellSlotsCard } from "./card/SpellSlotsCard";
import { CoinsCard } from "./card/CoinsCard";
import { SpellsCard } from "./card/SpellsCard";
import { TextArea } from "../ui/TextArea";
import { EquipmentCard } from "./card/EquipmentCard";
import { FeatureList } from "./ui/FeatureList";
import { Card } from "../ui/Card";

const initialState = {
  character: undefined,
};

export const CharacterSheetView: React.FC = () => {
  const [state, dispatch] = useReducer(characterReducer, initialState);
  const params = useParams();

  const character = state.character;
  useEffect(() => {
    if (!character) return;

    const timeout = setTimeout(() => {
      CharacterService.saveCharacter(character);
    }, 300);

    return () => clearTimeout(timeout);
  }, [character]);

  const updateCharacter = (
    field: keyof CharacterSheet | string,
    value: any,
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: field as keyof CharacterSheet,
      value,
    });
  };

  useEffect(() => {
    fetchUrl(`/api/characters/${params.name}`)
      .then((res) => res.json())
      .then((characterData) => {
        dispatch({
          type: "INIT_CHARACTER",
          character: characterData,
        });
      });
  }, [params.name]);

  const translator = new Translator("characterShow");
  const t = translator.translate;

  const sign = (n: number) => (n >= 0 ? `+${n}` : n);

  if (!character) {
    return <p>Keiner da</p>;
  }

  return (
    <div className="sheet">
      <div className="top">
        <div className="grid-2">
          <BasicInfoCard
            character={character}
            updateCharacter={updateCharacter}
          />

          <LevelCard character={character} updateCharacter={updateCharacter} />
        </div>

        <div className="quickbox">
          <div className="card">
            <div className="label">Rüstungsklasse</div>
            <div className="value">{character.armorClass}</div>
          </div>
        </div>

        <HitPointCard character={character} updateCharacter={updateCharacter} />

        <DeathSavesCard
          character={character}
          updateCharacter={updateCharacter}
        />
      </div>

      <div className="firstpage">
        <div className="left">
          <AttributesCard
            character={character}
            updateCharacter={updateCharacter}
          />
          <TrainingCard
            character={character}
            updateCharacter={updateCharacter}
          />
        </div>
        <BaseStatsCard
          character={character}
          updateCharacter={updateCharacter}
        />
      </div>

      <div className="page-two">
        <div className="page-two-full">
          <div className="page-two-top">
            <div className="card">
              <h2 className="section-title">Zauberwirken</h2>
              <div className="quickstats">
                <QuickStat
                  label="Attribut"
                  value={t(
                    `character.attribute.${character.characterClass.castingAttribute || character.subclass?.castingAttribute || "none"}`,
                  )}
                />
                <QuickStat
                  label="Mod"
                  value={sign(character.spellAttackBonus)}
                />
                <QuickStat label="SG" value={character.spellSaveDC} />
                <QuickStat
                  label="Angriff"
                  value={sign(character.spellAttackBonus)}
                />
              </div>
            </div>
            <SpellSlotsCard
              character={character}
              updateCharacter={updateCharacter}
            />
          </div>
        </div>
        <div className="page-two-left">
          <SpellsCard character={character} updateCharacter={updateCharacter} />

          <FeatureList
            updateCharacter={updateCharacter}
            character={character}
            items={character.equipment.map((equipment, i) => {
              return {
                ...equipment,
                index: i,
                editPath: `equipment`,
              };
            })}
            title={translator.translate(".card.equipment.title")}
            editable={true}
          />
        </div>

        <div className="page-two-right">
          <TextCard title="Aussehen" text={character.appearance} />
          <TextCard title="Hintergrundgeschichte" text={character.story} />
          <div className="card">
            <h2 className="section-title">Gesinnung</h2>
            <div>{t(`alignment.${character.alignment}`)}</div>
          </div>
          <Card>
            <h2 className="section-title">
              {translator.translate(".languages")}
            </h2>
            <p>
              {character.languages.map((l) => t(`language.${l}`)).join(", ")}
            </p>
          </Card>
          <ListCard
            title="Eingestimmte magische Gegenstände"
            items={Object.values(character.attunedMagicItems).map(
              (magicItem) => {
                return { name: magicItem };
              },
            )}
          />

          <CoinsCard character={character} updateCharacter={updateCharacter} />
        </div>
      </div>
      <Card>
        <h3>{translator.translate(".notes")}</h3>
        <TextArea
          className="w-full h-100"
          onChange={(e) => updateCharacter("notes", e.target.value)}
        >
          {character.notes}
        </TextArea>
      </Card>
    </div>
  );
};

const QuickStat = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="quickbox">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);
const TextCard = ({ title, text }: { title: string; text: string }) => (
  <div className="card">
    <h2 className="section-title">{title}</h2>
    <div>{text}</div>
  </div>
);
