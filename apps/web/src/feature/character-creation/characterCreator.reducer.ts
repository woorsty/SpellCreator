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
        character: {
          ...state.character,
          [action.field]: action.value,
        },
      };

    default:
      return state;
  }
}
