import React, { useState } from "react";
import { Translator } from "@i18n";
import { Spell, CharacterClass } from "@domain";
import { Button } from "../../../component/ui/Button";
import { StepProps } from "../characterCreator.types";
import { Input } from "../../../component/ui/Input";
import { Select } from "../../../component/ui/Select";
import { SpellSchool } from "@domain";

export function SpellsTab({ character, updateField }: StepProps) {
  const [newSpell, setNewSpell] = useState<Partial<Spell>>({});
  const translator = new Translator("characterCreator.steps.spells");

  const addSpell = () => {
    if (!newSpell.name) return;

    const spell: Spell = {
      level: newSpell.level ?? 0,
      name: newSpell.name,
      school: newSpell.school ?? SpellSchool.EVOCATION,
      castingTime: newSpell.castingTime ?? "",
      range: newSpell.range ?? "",
      concentration: newSpell.concentration ?? false,
      duration: newSpell.duration ?? "",
      ritual: newSpell.ritual ?? false,
      components: {
        gestic: newSpell.components?.gestic ?? false,
        verbal: newSpell.components?.verbal ?? false,
        material: newSpell.components?.material ?? null,
      },
      text: newSpell.text ?? "",
      characterClasses: newSpell.characterClasses ?? [],
      higherLevel: newSpell.higherLevel ?? null,
      notes: newSpell.notes ?? null,
    };

    const updated = [...character.preparedSpells, spell];
    updateField("spells", updated);

    setNewSpell({});
  };

  const removeSpell = (index: number) => {
    updateField(
      "spells",
      character.preparedSpells.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">{translator.translate(".title")}</h2>

      {/* Tabelle */}
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-1/6" />
          <col className="w-16" />
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-4" />
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
          {character.preparedSpells.map((s, i) => (
            <tr key={i} className="border-b">
              <td>{s.level}</td>
              <td>{s.name}</td>
              <td>{s.castingTime}</td>
              <td>{s.range}</td>
              <td>
                {s.concentration}
                {s.ritual}
                {s.components.material}
              </td>
              <td>{s.notes}</td>
              <td>
                <Button variant="secondary" onClick={() => removeSpell(i)}>
                  X
                </Button>
              </td>
            </tr>
          ))}

          {/* Input Row */}
          <tr className="border-b">
            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newSpell.name ?? ""}
                onChange={(e) =>
                  setNewSpell({ ...newSpell, name: e.target.value })
                }
              />
            </td>

            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                type="number"
                value={newSpell.level ?? ""}
                onChange={(e) =>
                  setNewSpell({
                    ...newSpell,
                    level: Number(e.target.value),
                  })
                }
              />
            </td>

            <td>
              <Select
                className="w-full h-8 text-sm px-2 py-1"
                value={newSpell.school ?? SpellSchool.EVOCATION}
                onChange={(e) =>
                  setNewSpell({
                    ...newSpell,
                    school: e.target.value as SpellSchool,
                  })
                }
              >
                {Object.values(SpellSchool).map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </Select>
            </td>

            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newSpell.castingTime ?? ""}
                onChange={(e) =>
                  setNewSpell({
                    ...newSpell,
                    castingTime: e.target.value,
                  })
                }
              />
            </td>

            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newSpell.range ?? ""}
                onChange={(e) =>
                  setNewSpell({ ...newSpell, range: e.target.value })
                }
              />
            </td>

            <td>{/* TODO: Checkboxen */}</td>

            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newSpell.notes ?? ""}
                onChange={(e) =>
                  setNewSpell({
                    ...newSpell,
                    notes: e.target.value,
                  })
                }
              />
            </td>

            <td />
          </tr>
        </tbody>
      </table>

      <Button onClick={addSpell}>Zauber hinzufügen</Button>
    </div>
  );
}
