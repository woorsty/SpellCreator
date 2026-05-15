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
  let newState;
  switch (action.type) {
    case "UPDATE_FIELD":
      newState = {
        ...state,
        character: setNestedValue(state.character, action.field, action.value),
      };
      break;
    case "INIT_CHARACTER":
      newState = {
        ...state,
        character: action.character,
      };
      break;
    default:
      newState = state;
      break;
  }
  return newState;
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
