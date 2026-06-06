// stepRegistry.ts
import { CharacterCreationStep } from "./character-creator-steps";
import React from "react";
import { StepProps } from "./characterCreator.types";
import { BasicInfoTab } from "../../component/character/creator/step/BasicInfoTab";
import { AttributesTab } from "../../component/character/creator/step/AttributesTab";
import { EquipmentTab } from "../../component/character/creator/step/EquipmentTab";
import { AttacksTab } from "../../component/character/creator/step/AttacksTab";
import { SpellsTab } from "../../component/character/creator/step/SpellsTab";
import { BackgroundTab } from "../../component/character/creator/step/BackgroundTab";
import { TalentsTab } from "../../component/character/creator/step/TalentsTab";

export const stepRegistry: Record<
  CharacterCreationStep,
  React.ComponentType<StepProps>
> = {
  [CharacterCreationStep.BASIC_INFO]: BasicInfoTab,
  [CharacterCreationStep.ATTRIBUTES]: AttributesTab,
  [CharacterCreationStep.EQUIPMENT]: EquipmentTab,
  [CharacterCreationStep.ATTACKS]: AttacksTab,
  [CharacterCreationStep.SPELLS]: SpellsTab,
  [CharacterCreationStep.BACKGROUND]: BackgroundTab,
  [CharacterCreationStep.TALENTS]: TalentsTab,
} as const;
