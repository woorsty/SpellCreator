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
  const lastKey = keys.pop()!;

  const newObj = structuredClone(obj);

  let current = newObj;

  for (const key of keys) {
    current = current[key];
  }

  current[lastKey] = value;

  return newObj;
}
