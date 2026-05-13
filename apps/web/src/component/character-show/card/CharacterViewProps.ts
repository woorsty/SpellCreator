import { CharacterSheet } from "@repo/domain";

export type CharacterViewProps = {
  character: CharacterSheet;
  updateCharacter: (key: keyof CharacterSheet | string, value: any) => void;
};
