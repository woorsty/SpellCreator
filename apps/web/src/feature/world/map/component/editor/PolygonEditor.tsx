import React from "react";

interface Props {
  onBack: () => void;
}

export const PolygonEditor = ({ onBack }: Props) => {
  return (
    <>
      <button onClick={onBack}>← Zurück</button>

      <h3>Neues Gebiet</h3>

      <input placeholder="Name" />

      <select>
        <option>Königreich</option>
        <option>Region</option>
        <option>Wald</option>
        <option>Gebirge</option>
        <option>Gefahrengebiet</option>
      </select>

      <textarea placeholder="Beschreibung" />

      <p>Klicke Eckpunkte auf der Karte. Doppelklick schließt das Polygon.</p>

      <button>Speichern</button>
    </>
  );
};
