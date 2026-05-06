import { CharacterSheet } from "@domain";
import { CharacterCreationStep } from "./character-creator-stpes";

export type StepProps = {
  character: CharacterSheet;
  updateField: (field: keyof CharacterSheet, value: any) => void;
};

export type State = {
  step: CharacterCreationStep;
  character: CharacterSheet;
};

export type Action =
  | {
      type: "SET_STEP";
      step: CharacterCreationStep;
    }
  | {
      type: "UPDATE_FIELD";
      field: keyof CharacterSheet;
      value: CharacterSheet[keyof CharacterSheet];
    };
