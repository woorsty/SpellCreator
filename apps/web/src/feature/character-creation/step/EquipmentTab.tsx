import React from "react";
import { Translator } from "@i18n";
import { StepProps } from "../characterCreator.types";
import { CoinsRow } from "../../../component/character/CoinsRow";
import { EquipmentList } from "../../../component/character/EquipmentList";

export function EquipmentTab({ character, updateField }: StepProps) {
  const translator = new Translator("characterCreator.steps.equipment");
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{translator.translate(".title")}</h3>

      {/* COINS */}
      <CoinsRow
        copper={character.copper}
        silver={character.silver}
        electrum={character.electrum}
        gold={character.gold}
        platinum={character.platinum}
        updateField={updateField}
      />

      {/* EQUIPMENT */}
      <div>
        <h4 className="mb-2 font-semibold">
          {translator.translate(".equipment")}
        </h4>

        <EquipmentList
          equipment={character.equipment}
          updateField={updateField}
        />
      </div>
    </div>
  );
}
