import React from "react";

interface Props {
  onBack: () => void;
}

export const LineEditor = ({ onBack }: Props) => {
  return (
    <>
      <button onClick={onBack}>← Zurück</button>

      <h3>Neue Linie</h3>

      <input placeholder="Name" />

      <select>
        <option>Straße</option>
        <option>Fluss</option>
        <option>Grenze</option>
        <option>Handelsroute</option>
      </select>

      <textarea placeholder="Beschreibung" />

      <p>Klicke Punkte auf der Karte. Doppelklick beendet die Linie.</p>

      <button>Speichern</button>
    </>
  );
};
