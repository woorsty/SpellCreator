// stepRegistry.ts
import { BasicInfoTab } from "./step/BasicInfoTab";
import { AttributesTab } from "./step/AttributesTab";
import { BackgroundTab } from "./step/BackgroundTab";
import { EquipmentTab } from "./step/EquipmentTab";
import { AttacksTab } from "./step/AttacksTab";
import { CharacterCreationStep } from "./character-creator-stpes";
import React from "react";
import { StepProps } from "./characterCreator.types";
import { SpellsTab } from "./step/SpellsTab";
import { TalentsTab } from "./step/TalentsTab";

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
