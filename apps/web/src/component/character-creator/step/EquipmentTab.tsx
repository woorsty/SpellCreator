import React from "react";
import { Translator } from "@i18n";
import { Card } from "../../../component/ui/Card";
import { ItemList } from "../../../component/ui/ItemList";
import { Input } from "../../../component/ui/Input";
import { EquipmentItem, ToolItem } from "@domain";
import { StepProps } from "../../../feature/character-creation/characterCreator.types";
import { ArmorTrainingSection } from "../ArmorTrainingSection";
import { WeaponTrainingSection } from "../WeaponTrainingSection";
import { CoinsRow } from "../CoinsRow";

export function EquipmentTab({ character, updateField }: StepProps) {
  const translator = new Translator("characterCreator.steps.equipment");

  const updateAttunedMagicItems = (magicItem: string, index: number) => {
    const attunedItems = { ...character.attunedMagicItems };
    attunedItems[index] = magicItem;
    updateField("attunedMagicItems", attunedItems);
  };

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
            <ItemList<ToolItem>
              data={character.toolProficiencies}
              labelProperty="name"
              textProperty="notes"
              field="toolProficiencies"
              updateField={updateField}
            />
          </div>
        </Card>
      </Card>
      <Card>
        <h3>{translator.translate(".attuned_magic_items")}</h3>
        <Input
          value={character.attunedMagicItems[0]}
          placeholder={translator.translate(".magic_item")}
          onChange={(e) => {
            updateAttunedMagicItems(e.target.value, 0);
          }}
        />
        <Input
          value={character.attunedMagicItems[1]}
          placeholder={translator.translate(".magic_item")}
          onChange={(e) => {
            updateAttunedMagicItems(e.target.value, 1);
          }}
        />
        <Input
          value={character.attunedMagicItems[2]}
          placeholder={translator.translate(".magic_item")}
          onChange={(e) => {
            updateAttunedMagicItems(e.target.value, 2);
          }}
        />
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

          <ItemList<EquipmentItem>
            data={character.equipment}
            labelProperty="name"
            textProperty="notes"
            updateField={updateField}
            field={"equipment"}
          />
        </div>
      </Card>
    </div>
  );
}
