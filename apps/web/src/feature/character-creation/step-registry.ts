// stepRegistry.ts
import { BasicInfoTab } from "./step/BasicInfoTab";
import { AttributesTab } from "./step/AttributesTab";
import { BackgroundTab } from "./step/BackgroundTab";
import { EquipmentTab } from "./step/EquipmentTab";
import { CharacterCreationStep } from "./character-creator-stpes";
import React from "react";
import { StepProps } from "./characterCreator.types";

export const stepRegistry: Record<
  CharacterCreationStep,
  React.ComponentType<StepProps>
> = {
  [CharacterCreationStep.BASIC_INFO]: BasicInfoTab,
  [CharacterCreationStep.ATTRIBUTES]: AttributesTab,
  [CharacterCreationStep.BACKGROUND]: BackgroundTab,
  [CharacterCreationStep.EQUIPMENT]: EquipmentTab,
} as const;
