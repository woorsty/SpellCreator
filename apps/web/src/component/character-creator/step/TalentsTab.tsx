import { Translator } from "@repo/i18n";
import React from "react";
import { Card } from "../../../component/ui/Card";
import { ItemList } from "../../../component/ui/ItemList";
import { Feat } from "@repo/domain";
import { StepProps } from "../../../feature/character-creation/characterCreator.types";

export function TalentsTab({ character, updateField }: StepProps) {
  const translator = new Translator("characterCreator.steps.talents");

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{translator.translate(".title")}</h3>

      <Card>
        {/* Talents */}
        <div>
          <h4 className="mb-2 font-semibold">
            {translator.translate(".talents")}
          </h4>

          <ItemList<Feat>
            data={character.feats}
            labelProperty="name"
            textProperty="text"
            field="feats"
            updateField={updateField}
          />
        </div>
      </Card>
    </div>
  );
}
