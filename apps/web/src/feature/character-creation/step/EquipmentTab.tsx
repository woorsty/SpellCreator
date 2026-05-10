import React from "react";
import { Translator } from "@i18n";
import { StepProps } from "../characterCreator.types";
import { CoinsRow } from "../../../component/character/CoinsRow";
import { Card } from "../../../component/ui/Card";
import { ItemList } from "../../../component/ui/ItemList";
import { ArmorTrainingSection } from "../../../component/character/ArmorTrainingSection";
import { WeaponTrainingSection } from "../../../component/character/WeaponTrainingSection";

export function EquipmentTab({ character, updateField }: StepProps) {
  const translator = new Translator("characterCreator.steps.equipment");
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">{translator.translate(".title")}</h3>

      <Card>
        <h3 className="font-bold">Übung</h3>
        <Card>
          {/* TRAINING */}
          <div className="grid grid-cols-2 gap-6">
            <ArmorTrainingSection
              training={character.armorTraining}
              updateField={updateField}
            />

            <WeaponTrainingSection
              training={character.weaponTraining}
              updateField={updateField}
            />
          </div>
          <br />
          <div>
            <h4 className="font-semibold mb-2">Tools</h4>
            <ItemList
              items={character.toolProficiencies}
              field="toolProficiencies"
              updateField={updateField}
            />
          </div>
        </Card>
      </Card>
      <Card>
        {/* COINS */}
        <CoinsRow
          copper={character.coins.copper}
          silver={character.coins.silver}
          electrum={character.coins.electrum}
          gold={character.coins.gold}
          platinum={character.coins.platinum}
          updateField={updateField}
        />

        {/* EQUIPMENT */}
        <div>
          <h4 className="mb-2 font-semibold">
            {translator.translate(".equipment")}
          </h4>

          <ItemList
            items={character.equipment}
            updateField={updateField}
            field={"equipment"}
          />
        </div>
      </Card>
    </div>
  );
}
