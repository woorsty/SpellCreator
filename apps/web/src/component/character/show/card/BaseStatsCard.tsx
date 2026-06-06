import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { ClassFeatsCard } from "./ClassFeatsCard";
import { Translator } from "@repo/i18n";
import { FeatureList } from "../ui/FeatureList";

export const BaseStatsCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const sign = (n: number) => (n >= 0 ? `+${n}` : n);

  const translator = new Translator("characterShow.card.base_stats");
  const t = translator.translate;

  return (
    <div className="center">
      <div className="card">
        <div className="quickstats">
          <QuickStat label="Initiative" value={sign(character.initiative)} />
          <QuickStat label="Bewegungsrate" value={character.species.speed} />
          <QuickStat label="Größe" value={t(`size.${character.size}`)} />
          <QuickStat
            label="Passive Wahrnehmung"
            value={character.passivePerception}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Waffen & Angriffszauber</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Bonus/SG</th>
              <th>Schaden</th>
              <th>Art</th>
              <th>Notizen</th>
            </tr>
          </thead>
          <tbody>
            {character.attacks.map((w, i) => (
              <tr key={i}>
                <td>{w.name}</td>
                <td>{`${sign(w.attackBonus)}/${sign(w.sg)}`}</td>
                <td>{w.damage}</td>
                <td>{t(`damage_type.${w.damageType}`)}</td>
                <td>{w.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ClassFeatsCard character={character} updateCharacter={updateCharacter} />

      <FeatureList
        character={character}
        editable={false}
        title={translator.translate(".talents")}
        updateCharacter={updateCharacter}
        items={character.feats.map((feat, i) => {
          return { index: i, name: feat.name, notes: feat.text };
        })}
      />
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
