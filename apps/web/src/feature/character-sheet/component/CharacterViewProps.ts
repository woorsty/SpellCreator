import { CharacterSheet } from "@domain";

export type CharacterViewProps = {
  character: CharacterSheet;
  updateCharacter: (key: keyof CharacterSheet, value: any) => void;
};
