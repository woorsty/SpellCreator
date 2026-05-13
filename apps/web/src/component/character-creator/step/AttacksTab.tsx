import React, { useState } from "react";
import { translate, Translator } from "@repo/i18n";
import { Attack, DamageType } from "@repo/domain";
import { Button } from "../../../component/ui/Button";
import { Select } from "../../../component/ui/Select";
import { Input } from "../../../component/ui/Input";
import { StepProps } from "../../../feature/character-creation/characterCreator.types";

export function AttacksTab({ character, updateField }: StepProps) {
  const [newAttack, setNewAttack] = useState<Partial<Attack>>({
    id: crypto.randomUUID(),
  });
  const translator = new Translator("characterCreator.steps.attacks");

  const addAttack = () => {
    if (!newAttack.name) {
      return;
    }
    const attack: Attack = {
      id: crypto.randomUUID(),
      name: newAttack.name ?? "",
      attackBonus: newAttack.attackBonus ?? 0,
      sg: newAttack.sg ?? 0,
      damage: newAttack.damage ?? "",
      damageType: newAttack.damageType ?? DamageType.BLUDGEONING,
      notes: newAttack.notes ?? "",
    };

    const updated = [...character.attacks, attack];
    // updateField("attacks", [...items, { name: newItem, notes: "" }]);
    updateField("attacks", updated);
    console.log("Update", character);
    setNewAttack({});
  };

  const removeAttack = (index: number) => {
    updateField(
      "attacks",
      character.attacks.filter((_, i) => i !== index),
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
          <col className="w-16" />
          <col className="w-1/6" />
          <col className="w-2/6" />
          <col className="w-4" />
        </colgroup>
        <thead>
          <tr className="text-left border-b">
            <th>{translator.translate(".table.name")}</th>
            <th>{translator.translate(".table.bonus")}</th>
            <th>{translator.translate(".table.sg")}</th>
            <th>{translator.translate(".table.damage")}</th>
            <th>{translator.translate(".table.notes")}</th>
            <th>🚮</th>
          </tr>
        </thead>
        <tbody>
          {character.attacks.map((a, i) => (
            <tr key={a.id} className="border-b">
              <td>{a.name}</td>
              <td>{a.attackBonus}</td>
              <td>{a.sg ?? "-"}</td>
              <td>
                {a.damage} {a.damageType}
              </td>
              <td>{a.notes}</td>
              <td>
                <Button variant="secondary" onClick={() => removeAttack(i)}>
                  X
                </Button>
              </td>
            </tr>
          ))}

          {/* Input Bereich */}
          <tr key={"end"} className="border-b">
            <td className="pr-7">
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newAttack.name ?? ""}
                onChange={(e) =>
                  setNewAttack({ ...newAttack, name: e.target.value })
                }
              />
            </td>
            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                type="number"
                value={newAttack.attackBonus ?? ""}
                onChange={(e) =>
                  setNewAttack({
                    ...newAttack,
                    attackBonus: Number(e.target.value),
                  })
                }
              />
            </td>
            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newAttack.sg ?? ""}
                onChange={(e) =>
                  setNewAttack({
                    ...newAttack,
                    sg: Number(e.target.value),
                  })
                }
              />
            </td>
            <td className="flex items-center">
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newAttack.damage ?? ""}
                placeholder={translator.translate(".input.damage.placeholder")}
                onChange={(e) =>
                  setNewAttack({ ...newAttack, damage: e.target.value })
                }
              />
              <Select
                value={newAttack.damageType ?? DamageType.BLUDGEONING}
                onChange={(e) =>
                  setNewAttack({
                    ...newAttack,
                    damageType: e.target.value as DamageType,
                  })
                }
              >
                {Object.values(DamageType).map((dt) => (
                  <option key={dt} value={dt}>
                    {translator.translate(`damage_type.${dt}`)}
                  </option>
                ))}
              </Select>
            </td>
            <td>
              <Input
                className="w-full h-8 text-sm px-2 py-1"
                value={newAttack.notes ?? ""}
                onChange={(e) =>
                  setNewAttack({ ...newAttack, notes: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <Button onClick={addAttack}>Angriff hinzufügen</Button>
    </div>
  );
}
