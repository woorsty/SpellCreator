import React from "react";
import { Checkbox } from "../../../component/ui/Checkbox";
import { Label } from "../../../component/ui/Label";
import {
  Attribute,
  AttributeService,
  CharacterSheet,
  SkillViewModel,
} from "@domain";
import { translate, Translator } from "@i18n";

type SkillRowProps<A extends Attribute> = {
  skill: SkillViewModel<A>;
  updateField: (field: keyof CharacterSheet | string, value: any) => void;
};

export function SkillRow<A extends Attribute>({
  skill,
  updateField,
}: SkillRowProps<A>) {
  return (
    <div className="flex items-center justify-between text-sm">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={skill.proficiency}
          onChange={(checked) => {
            updateField(
              `skills.${skill.attributeName}.${skill.name}.proficiency`,
              checked,
            );
            if (!checked) {
              updateField(
                `skills.${skill.attributeName}.${skill.name}.expertise`,
                false,
              );
            }
          }}
        />
        {skill.proficiency && (
          <Checkbox
            checked={skill.expertiese}
            onChange={(checked) =>
              updateField(
                `skills.${skill.attributeName}.${skill.name}.expertise`,
                checked && skill.proficiency,
              )
            }
          />
        )}
        <Label>{translate(`character.skills.${skill.name}`)}</Label>
        {AttributeService.formatModifier(skill.modifier)}
      </div>
    </div>
  );
}
