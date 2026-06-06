import React from "react";
import { Checkbox } from "../../../ui/Checkbox";
import { Label } from "../../../ui/Label";
import { AttributeService, CharacterSheet, SkillValues } from "@repo/domain";
import { translate } from "@repo/i18n";

type SkillRowProps = {
  attributeName: string;
  skill: SkillValues & { name: string; modifier: number };
  updateField: (field: keyof CharacterSheet | string, value: any) => void;
};

export function SkillRow({ attributeName, skill, updateField }: SkillRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={skill.proficiency}
          onChange={(checked) => {
            updateField(
              `attributes.${attributeName}.skills.${skill.name}.proficiency`,
              checked,
            );
            if (!checked) {
              updateField(
                `attributes.${attributeName}.skills.${skill.name}.expertise`,
                false,
              );
            }
          }}
        />
        {skill.proficiency && (
          <Checkbox
            checked={skill.expertise}
            onChange={(checked) =>
              updateField(
                `attributes.${attributeName}.skills.${skill.name}.expertise`,
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
