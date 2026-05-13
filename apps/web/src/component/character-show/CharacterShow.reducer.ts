import { CharacterSheet } from "@repo/domain";

type Action =
  | {
      type: "UPDATE_FIELD";
      field: keyof CharacterSheet;
      value: CharacterSheet[keyof CharacterSheet] | string;
    }
  | {
      type: "INIT_CHARACTER";
      character: CharacterSheet;
    };

export type State = {
  character?: CharacterSheet;
};

export const characterReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_FIELD":
      console.log(action);
      return {
        ...state,
        character: setNestedValue(state.character, action.field, action.value),
      };
    case "INIT_CHARACTER":
      return {
        ...state,
        character: action.character,
      };
    default:
      return state;
  }
};
function setNestedValue(obj: any, path: string, value: any) {
  const keys = path.split(".");

  return keys.reduceRight((acc, key, index) => {
    if (index === 0) {
      return {
        ...obj,
        [key]: acc,
      };
    }

    const parentPath = keys.slice(0, index).reduce((o, k) => o[k], obj);

    return {
      ...parentPath,
      [key]: acc,
    };
  }, value);
}
