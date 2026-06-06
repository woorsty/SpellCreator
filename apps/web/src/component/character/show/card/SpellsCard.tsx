import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { A } from "../../../ui/A";
import { serverUrl } from "@repo/domain";
import { Card } from "../../../ui/Card";

export const SpellsCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <Card>
      <h2 className="section-title">Zaubertricks & Vorbereitete Zauber</h2>
      <table>
        <thead>
          <tr>
            <th>Grad</th>
            <th>Name</th>
            <th>Aufwand</th>
            <th>Reichweite</th>
            <th>Konz.</th>
            <th>Ritual</th>
            <th>Material</th>
            <th>Notizen</th>
          </tr>
        </thead>
        <tbody>
          {character.preparedSpells.map((s, i) => (
            <tr key={i}>
              <td>{s.level}</td>
              <td>
                <A
                  href={serverUrl + `spell/${s.name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.name}
                </A>
              </td>
              <td>{s.castingTime}</td>
              <td>{s.range}</td>
              <td>
                <input type="checkbox" readOnly checked={s.concentration} />
              </td>
              <td>
                <input type="checkbox" readOnly checked={s.ritual} />
              </td>
              <td>{s.components.material}</td>
              <td>{s.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
