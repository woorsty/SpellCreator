import { CharacterSheet } from "@repo/domain";
import { CharacterCreationStep } from "./character-creator-steps";

export type StepProps = {
  character: CharacterSheet;
  updateField: (field: keyof CharacterSheet | string, value: any) => void;
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
      value: CharacterSheet[keyof CharacterSheet] | string;
    };
