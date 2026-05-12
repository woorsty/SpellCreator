import React from "react";
import { Translator } from "@i18n";
import {
  Attribute,
  ATTRIBUTE_SKILLS,
  AttributeService,
  CharacterSheet,
  SkillOf,
} from "@domain";
import { Checkbox } from "../../component/ui/Checkbox";
import { Card } from "../../component/ui/Card";
import { Label } from "../../component/ui/Label";
import { NumberInput } from "../../component/ui/NumberInput";
import { SkillRow } from "../../feature/character-creation/step/SkillRow";

type AttributeCardProps<A extends Attribute> = {
  attributeName: A;
  character: CharacterSheet;
  updateField: (field: keyof CharacterSheet | string, value: any) => void;
};

export function AttributeCard<A extends Attribute>({
  attributeName,
  character,
  updateField,
}: AttributeCardProps<A>) {
  const attribute = character.attributes[attributeName];
  const translator = new Translator("characterCreator.steps.attributes");
  const modifier = AttributeService.calculateModifier(attribute.value);
  const skillsForAttribute = ATTRIBUTE_SKILLS[
    attributeName
  ] as readonly SkillOf<A>[];

  const savingThrow = AttributeService.calculateSavingThrow(
    modifier,
    attribute.proficiency,
    character.proficiencyBonus,
  );

  return (
    <Card>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold">
          {translator.translate(`character.attribute.${attributeName}`)}
        </h4>
      </div>

      {/* BODY GRID */}
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT SIDE: INPUTS */}
        <div className="space-y-3">
          <div>
            <Label>{translator.translate(".value")}</Label>

            <div className="flex items-center gap-2">
              <NumberInput
                value={attribute.value}
                onChange={(value) =>
                  updateField(
                    `attributes.${attributeName}.value` as keyof CharacterSheet,
                    value,
                  )
                }
              />
              <div className="text-2xl font-bold">
                {AttributeService.formatModifier(modifier)}
              </div>
            </div>
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

            <Label>{translator.translate(".savingThrow")}</Label>

            <div className="text-lg font-bold">
              {AttributeService.formatModifier(savingThrow)}
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS */}
      {ATTRIBUTE_SKILLS[attributeName].length > 0 && (
        <div className="mt-4 border-t border-border pt-3 space-y-2">
          {skillsForAttribute.map((skillName) => (
            <SkillRow
              key={skillName}
              skill={AttributeService.getSkillViewModel(
                character,
                attributeName,
                skillName,
              )}
              attributeName={attributeName}
              updateField={updateField}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
