import React from "react";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { CharacterSheet } from "@repo/domain";
import { Translator } from "@repo/i18n";

type Props = {
  training: CharacterSheet["weaponTraining"];
  updateField: (field: string, value: any) => void;
};

export function WeaponTrainingSection({ training, updateField }: Props) {
  const translator = new Translator("characterCreator.steps.equipment");

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{translator.translate(".weapons")}</h4>

      {["simple", "martial", "light", "finesse"].map((key) => (
        <div key={key} className="flex items-center gap-2">
          <Checkbox
            checked={training[key as keyof typeof training]}
            onChange={(v) => updateField(`weaponTraining.${key}`, v)}
          />
          <Label>{translator.translate(`weapon_kind.${key}`)}</Label>
        </div>
      ))}
    </div>
  );
}
