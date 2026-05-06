import React, { useReducer } from "react";
import { CharacterSheet } from "@domain";
import { translate } from "@i18n";
import { CharacterCreationStep } from "../../feature/character-creation/character-creator-stpes";
import { stepRegistry } from "../../feature/character-creation/step-registry";
import { State } from "../../feature/character-creation/characterCreator.types";
import { characterCreationReducer } from "../../feature/character-creation/characterCreator.reducer";
import { CharacterPreview } from "../../feature/character-creation/CharacterPreview";
import { CharacterService } from "@domain";

const emptyCharacter: CharacterSheet = CharacterService.getEmptyCharacter();

// -----------------------------
// State
// -----------------------------

const initialState: State = {
  step: CharacterCreationStep.BASIC_INFO,
  character: emptyCharacter,
};

// -----------------------------
// Component
// -----------------------------

export default function CharacterCreator() {
  const [state, dispatch] = useReducer(characterCreationReducer, initialState);
  const { step, character } = state;

  const updateField = <K extends keyof CharacterSheet>(
    field: K,
    value: CharacterSheet[K],
  ) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  function renderCurrentStep() {
    const StepComponent = stepRegistry[step];

    if (!StepComponent) {
      return <div>Tab nicht gefunden</div>;
    }
    return <StepComponent character={character} updateField={updateField} />;
  }

  return (
    <div style={styles.layout}>
      {/* NAV */}
      <aside style={styles.card}>
        <h2>{translate("characterCreator.title")}</h2>
        {Object.values(CharacterCreationStep)
          .filter((v): v is CharacterCreationStep => typeof v === "number")
          .map((s, i) => (
            <div
              key={i}
              onClick={() => dispatch({ type: "SET_STEP", step: s })}
              style={{
                ...styles.step,
                borderColor: step === s ? "#3b82f6" : "#4b4f57",
              }}
            >
              {translate(
                "characterCreator.steps." +
                  CharacterCreationStep[s].toLowerCase(),
              )}
            </div>
          ))}
      </aside>

      {/* MAIN */}
      <main style={styles.card}>{renderCurrentStep()}</main>

      {/* PREVIEW */}
      <CharacterPreview character={character} />
    </div>
  );
}

// -----------------------------
// Styles (keeps your dark UI system)
// -----------------------------

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr 320px",
    gap: 16,
    padding: 20,
    minHeight: "100vh",
    background: "#1e1f22",
    color: "#f5f5f5",
    fontFamily: "Arial",
  },
  card: {
    background: "#2b2d31",
    border: "1px solid #4b4f57",
    borderRadius: 14,
    padding: 16,
  },
  step: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #4b4f57",
    marginBottom: 8,
    cursor: "pointer",
  },
  choice: {
    padding: 10,
    border: "1px solid #4b4f57",
    borderRadius: 10,
    marginBottom: 8,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #4b4f57",
    background: "#33363c",
    color: "#f5f5f5",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #4b4f57",
    background: "#33363c",
    color: "#f5f5f5",
  },
};
