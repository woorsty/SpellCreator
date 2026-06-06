import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";

export const TrainingCard: React.FC<CharacterViewProps> = ({ character }) => {
  return (
    <div className="card">
      <div className="section-title">Übung & Kompetenzen</div>
      <div className="label">Rüstung</div>
      <div className="training-grid-4">
        <TrainingRow checked={character.armorTraining.light} label="Leichte" />
        <TrainingRow
          checked={character.armorTraining.medium}
          label="Mittlere"
        />
        <TrainingRow checked={character.armorTraining.heavy} label="Schwere" />
        <TrainingRow checked={character.armorTraining.shield} label="Schilde" />
      </div>

      <div className="label" style={{ marginTop: "12px" }}>
        Waffen
      </div>
      <div className="training-grid-2">
        <TrainingRow
          checked={character.weaponTraining.simple}
          label="Einfache"
        />
        <TrainingRow
          checked={character.weaponTraining.martial}
          label="Kriegswaffen"
        />
        <TrainingRow
          checked={character.weaponTraining.light}
          label="Leichte Kriegswaffen"
        />
        <TrainingRow
          checked={character.weaponTraining.finesse}
          label="Finessewaffen"
        />
      </div>

      <div style={{ marginTop: "12px" }}>
        <div className="label">Werkzeuge</div>
        <div className="tool-list">
          {character.toolProficiencies?.length > 0 ? (
            <div>
              {character.toolProficiencies.map((p) => p.name).join(", ")}
            </div>
          ) : (
            <div className="skill-row">
              <div className="skill-name" style={{ color: "var(--muted)" }}>
                Keine
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrainingRow = ({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) => (
  <div className="skill-row">
    <div className={`skill-check ${checked ? "filled" : ""}`} />
    <div className="skill-name">{label}</div>
  </div>
);
