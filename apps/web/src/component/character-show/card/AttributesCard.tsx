import { Attribute, AttributeService, SkillOf } from "@domain";
import { CharacterViewProps } from "./CharacterViewProps";
import React, { useState } from "react";
import { Translator } from "@i18n";
import { Card } from "../../../component/ui/Card";
import { Button } from "../../../component/ui/Button";
import { NumberInput } from "../../../component/ui/NumberInput";
import { Checkbox } from "../../ui/Checkbox";

const translator = new Translator("characterShow.card.attributes");
const sign = (n: number) => (n >= 0 ? `+${n}` : n);

export const AttributesCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  console.log("Character.attr", character.attributes);

  const renderAbility = <A extends Attribute>(
    attrKey: A,
    skills: SkillOf<A>[] = [],
  ) => {
    const attr = character.attributes[attrKey];
    return (
      <div className="ability">
        <div className="ability-name">
          {translator.translate(`character.attribute.${attrKey}`)}
        </div>
        <div className="ability-header">
          <div className="ability-statbox">
            <div className="ability-stat-label">Wert</div>
            {editMode ? (
              <NumberInput
                className="w-4"
                value={attr.value}
                onChange={(e) => {
                  updateCharacter("attributes." + attrKey + ".value", e);
                  updateCharacter(
                    "attributes." + attrKey + ".modifier",
                    AttributeService.calculateModifier(e as number),
                  );
                }}
              />
            ) : (
              <div className="ability-stat-value">{attr.value}</div>
            )}
          </div>
          <div className="ability-statbox">
            <div className="ability-stat-label">Mod</div>
            <div className="ability-stat-mod">{sign(attr.modifier!)}</div>
          </div>
        </div>
        <div className="skill-row">
          {editMode ? (
            <Checkbox
              checked={attr.proficiency}
              onChange={(e) => {
                updateCharacter("attributes." + attrKey + ".proficiency", e);
                updateCharacter(
                  "attributes." + attrKey + ".savingThrow",
                  e
                    ? attr.modifier! + character.proficiencyBonus
                    : attr.modifier,
                );
              }}
            />
          ) : (
            <div
              className={`skill-check ${attr.proficiency ? "filled" : ""}`}
            />
          )}
          {editMode ? (
            <NumberInput
              value={attr.savingThrow!}
              onChange={(e) =>
                updateCharacter("attributes." + attrKey + ".savingThrow", e)
              }
            />
          ) : (
            <div className="skill-mod">{sign(attr.savingThrow!)}</div>
          )}
          <div className="skill-name">
            {translator.translate(".saving_throw")}
          </div>
        </div>
        {skills.map((s) => {
          const skillData = (attr as any).skills[s];
          return (
            <div key={s} className="skill-row">
              <div
                className={`skill-check ${skillData.proficiency ? "filled" : ""}`}
              />
              {editMode ? (
                <NumberInput
                  value={attr.skills[s].modifier!}
                  onChange={(e) =>
                    updateCharacter(
                      "attributes." + attrKey + ".skills." + s + ".modifier",
                      e,
                    )
                  }
                />
              ) : (
                <div className="skill-mod">{sign(skillData.modifier)}</div>
              )}
              <div className="skill-name">
                {translator.translate(`character.skills.${s}`)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-3">
        <h2 className="section-title flex-1">
          {translator.translate(".title")}
        </h2>
        <Button onClick={() => setEditMode(!editMode)}>✏️</Button>
      </div>
      <div className="abilities">
        <div className="abilities-left">
          <div className="mini-stat">
            <div className="label">Übungsbonus</div>
            <div className="value">+{character.proficiencyBonus}</div>
          </div>

          {/* Stat-Block Template Funktion für DRY Code */}
          {renderAbility("strength", ["athletics"])}
          {renderAbility("dexterity", [
            "acrobatics",
            "sleightOfHand",
            "stealth",
          ])}
          {renderAbility("constitution")}

          <div className="mini-stat">
            <div className="label">Heroische Inspiration</div>
            <div
              className={`heroic-circle ${character.heroicInspiration ? "filled" : ""}`}
            />
          </div>
        </div>

        <div className="abilities-right">
          {renderAbility("intelligence", [
            "arcana",
            "history",
            "investigation",
            "nature",
            "religion",
          ])}
          {renderAbility("wisdom", [
            "medicine",
            "animalHandling",
            "insight",
            "survival",
            "perception",
          ])}
          {renderAbility("charisma", [
            "performance",
            "intimidation",
            "deception",
            "persuasion",
          ])}
        </div>
      </div>
    </Card>
  );
};
