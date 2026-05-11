import { Translator } from "@i18n";
import { StepProps } from "../characterCreator.types";
import React from "react";
import { Card } from "../../../component/ui/Card";
import { ItemList } from "apps/web/src/component/ui/ItemList";
import { Talent } from "packages/domain/src/model/talent";

export function TalentsTab({ character, updateField }: StepProps) {
  const translator = new Translator("characterCreator.steps.equipment");
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{translator.translate(".title")}</h3>

      <Card>
        {/* EQUIPMENT */}
        <div>
          <h4 className="mb-2 font-semibold">
            {translator.translate(".equipment")}
          </h4>

          <ItemList<Talent>
            items={character.talents}
            addItem={(newItem) => {
              if (!newItem) return;

              updateField("talents", [
                ...character.talents,
                { name: newItem, text: "" },
              ]);
            }}
            removeItem={(index) => {
              updateField(
                "talents",
                character.talents.filter((_, i) => i !== index),
              );
            }}
            updateItem={(index, data) => {
              const updated = character.talents.map((item, i) =>
                i === index ? { ...item, ...data } : item,
              );
              updateField("talents", updated);
            }}
          />
        </div>
      </Card>
    </div>
  );
}
