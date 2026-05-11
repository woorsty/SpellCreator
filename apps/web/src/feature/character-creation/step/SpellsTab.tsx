import React, { useEffect, useState } from "react";
import { Translator } from "@i18n";
import { Spell, SpellService } from "@domain";
import { Button } from "../../../component/ui/Button";
import { StepProps } from "../characterCreator.types";
import { Checkbox } from "../../../component/ui/Checkbox";
import { Input } from "../../../component/ui/Input";
import { SearchableSelect } from "../../../component/ui/SearchableSelect";

export function SpellsTab({ character, updateField }: StepProps) {
  const [spellsData, setSpellsData] = useState<Spell[]>([]);
  const translator = new Translator("characterCreator.steps.spells");

  useEffect(() => {
    fetch("/api/spells")
      .then((res) => res.json())
      .then((spellsData) => {
        setSpellsData(spellsData);
      });
  }, []);

  const addSpell = (spell: Spell) => {
    const updated = [...character.preparedSpells, spell];
    updateField("preparedSpells", updated);
  };

  const removeSpell = (index: number) => {
    console.log(character.preparedSpells.filter((_, i) => i !== index));
    updateField(
      "preparedSpells",
      character.preparedSpells.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">{translator.translate(".title")}</h2>

      {/* Tabelle */}
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-1/24" />
          <col className="w-1/6" />
          <col className="w-1/12" />
          <col className="w-1/12" />
          <col className="w-1/12" />
          <col className="w-20" />
          <col className="w-1/12" />
        </colgroup>

        <thead>
          <tr className="text-left border-b">
            <th>{translator.translate(".table.level")}</th>
            <th>{translator.translate(".table.name")}</th>
            <th>{translator.translate(".table.casting_time")}</th>
            <th>{translator.translate(".table.range")}</th>
            <th>{translator.translate(".table.checkboxes")}</th>
            <th>{translator.translate(".table.notes")}</th>
            <th>🚮</th>
          </tr>
        </thead>

        <tbody>
          {character.preparedSpells.map((spell, i) => (
            <tr key={i} className="border-b">
              <td>{spell.level}</td>
              <td>
                <a
                  className="underline"
                  href={SpellService.getLinkToSpell(spell)}
                >
                  {spell.name}
                </a>
              </td>
              <td>{spell.castingTime}</td>
              <td>{spell.range}</td>
              <td>
                <Checkbox readOnly={true} checked={spell.concentration} />
                <Checkbox readOnly={true} checked={spell.ritual} />
                <Checkbox
                  readOnly={true}
                  checked={spell.components.material
                    .toLowerCase()
                    .includes("wert")}
                />
              </td>
              <td>
                <Input
                  value={spell.notes}
                  className="w-full"
                  onChange={(e) => {
                    const newSpell = spellsData.find(
                      (s) => s.name === spell?.name,
                    );
                    if (newSpell) {
                      newSpell.notes = e.target.value;
                    }

                    updateField("preparedSpells", character.preparedSpells);
                  }}
                />
              </td>
              <td>
                <Button variant="secondary" onClick={() => removeSpell(i)}>
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <SearchableSelect<Spell>
        onSelect={(value) => addSpell(value)}
        options={spellsData.map((spell) => ({
          label: spell.name,
          value: spell,
        }))}
        placeholder={translator.translate(".spell_search")}
      />
      {/* <Select value="" onChange={(value) => addSpell(value.target.value)}>
        <option></option>
        {spellsData.map((spell) => (
          <option key={spell.name} value={spell.name}>
            {spell.name}
          </option>
        ))}
      </Select> */}
    </div>
  );
}
