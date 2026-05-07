import React from "react";
import { Translator } from "@i18n";
import { AttributeService, CharacterSheet } from "@domain";
import { Checkbox } from "../../component/ui/Checkbox";
import { Card } from "../../component/ui/Card";
import { Label } from "../../component/ui/Label";
import { NumberInput } from "../../component/ui/NumberInput";

type AttributeCardProps = {
  attributeName: string;
  attribute: {
    value: number;
    proficiency: boolean;
  };
  updateField: (field: keyof CharacterSheet, value: any) => void;
};

export function AttributeCard({
  attributeName,
  attribute,
  updateField,
}: AttributeCardProps) {
  const translator = new Translator("characterCreator.steps.attributes");
  const modifier = AttributeService.calculateModifier(attribute.value);

  const savingThrow = AttributeService.calculateSavingThrow(
    modifier,
    attribute.proficiency,
  );

  return (
    <Card>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold">
          {translator.translate(`character.attribute.${attributeName}`)}
        </h4>

        <div className="text-2xl font-bold">
          {AttributeService.formatModifier(modifier)}
        </div>
      </div>

      {/* BODY GRID */}
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT SIDE: INPUTS */}
        <div className="space-y-3">
          <div>
            <Label>{translator.translate(".value")}</Label>

            <NumberInput
              value={attribute.value}
              onChange={(value) =>
                updateField(
                  `attributes.${attributeName}.value` as keyof CharacterSheet,
                  value,
                )
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={attribute.proficiency}
              onChange={(checked) =>
                updateField(
                  `attributes.${attributeName}.proficiency` as keyof CharacterSheet,
                  checked,
                )
              }
            />

            <Label>{translator.translate(".proficiency")}</Label>
          </div>
        </div>

        {/* RIGHT SIDE: OUTPUTS */}
        <div className="space-y-3 text-right">
          <div>
            <Label>{translator.translate(".savingThrow")}</Label>

            <div className="text-lg font-bold">
              {AttributeService.formatModifier(savingThrow)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
