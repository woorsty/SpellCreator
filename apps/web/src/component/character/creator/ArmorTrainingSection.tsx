import { CharacterSheet } from "@repo/domain";
import { Checkbox } from "../../ui/Checkbox";
import { Label } from "../../ui/Label";
import React from "react";
import { Translator } from "@repo/i18n";

type Props = {
  training: CharacterSheet["armorTraining"];
  updateField: (field: string, value: any) => void;
};

export function ArmorTrainingSection({ training, updateField }: Props) {
  const translator = new Translator("characterCreator.steps.equipment");

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{translator.translate(".armor")}</h4>

      {["light", "medium", "heavy", "shield"].map((key) => (
        <div key={key} className="flex items-center gap-2">
          <Checkbox
            checked={training[key as keyof typeof training]}
            onChange={(v) => updateField(`armorTraining.${key}`, v)}
          />
          <Label>{translator.translate(`armor_kind.${key}`)}</Label>
        </div>
      ))}
    </div>
  );
}
