import { State, Action } from "./characterCreator.types";

export function characterCreationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        step: action.step,
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        character: setNestedValue(state.character, action.field, action.value),
      };

    default:
      return state;
  }
}

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
