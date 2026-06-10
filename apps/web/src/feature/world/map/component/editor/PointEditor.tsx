import { useState } from "react";
import axios from "axios";
import React from "react";

interface Props {
  onBack: () => void;
}

export const PointEditor = ({ onBack }: Props) => {
  const [form, setForm] = useState({
    name: "",
    type: "city",
    description: "",
    image: "",
    articleUrl: "",
    activeFrom: "",
    activeTo: "",
  });

  const save = async () => {
    await axios.post("/map/point", form);
    onBack();
  };

  return (
    <>
      <button onClick={onBack}>← Zurück</button>

      <h3>Neuer Ort</h3>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="city">Stadt</option>
        <option value="village">Dorf</option>
        <option value="castle">Burg</option>
        <option value="dungeon">Dungeon</option>
        <option value="poi">POI</option>
      </select>

      <textarea
        placeholder="Beschreibung"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      <input
        placeholder="Bild URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <input
        placeholder="Artikel URL"
        value={form.articleUrl}
        onChange={(e) =>
          setForm({
            ...form,
            articleUrl: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Aktiv von"
        value={form.activeFrom}
        onChange={(e) =>
          setForm({
            ...form,
            activeFrom: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Aktiv bis"
        value={form.activeTo}
        onChange={(e) =>
          setForm({
            ...form,
            activeTo: e.target.value,
          })
        }
      />

      <p>Klicke anschließend auf die Karte.</p>

      <button onClick={save}>Speichern</button>
    </>
  );
};
