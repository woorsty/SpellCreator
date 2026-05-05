import React, { useReducer } from "react";
import { CharacterSheet } from "@domain/model/charactersheet";
import { Species } from "@domain/model/species";
import { translate } from "@i18n";
import { Skill } from "@domain/model/skill";
import { Attribute } from "@domain/model/attribute";

const emptyCharacter: CharacterSheet = new CharacterSheet();

// -----------------------------
// State
// -----------------------------

type State = {
  step: number;
  character: CharacterSheet;
};

const initialState: State = {
  step: 0,
  character: emptyCharacter,
};

// -----------------------------
// Actions
// -----------------------------

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "UPDATE_FIELD"; field: keyof CharacterSheet; value: any };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

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

function getAttributeByName(
  character: CharacterSheet,
  name: string,
): Attribute | undefined {
  return character.attributes.find((attr) => attr.name === name);
}

function getSkillByName(
  character: CharacterSheet,
  name: string,
): Skill | undefined {
  for (const attr of character.attributes) {
    const skill = attr.skills.find((s) => s.name === name);
    if (skill) return skill;
  }
  return undefined;
}

// -----------------------------
// Component
// -----------------------------

export default function CharacterCreator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, character } = state;

  const steps = [
    "Charakterdaten",
    "Klasse & Volk",
    "Attribute",
    "Hintergrund",
    "Ausrüstung",
  ];

  return (
    <div style={styles.layout}>
      {/* NAV */}
      <aside style={styles.card}>
        <h2>{translate("character:title")}</h2>
        {steps.map((s, i) => (
          <div
            key={i}
            onClick={() => dispatch({ type: "SET_STEP", step: i })}
            style={{
              ...styles.step,
              borderColor: step === i ? "#3b82f6" : "#4b4f57",
            }}
          >
            {i + 1}. {s}
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main style={styles.card}>
        {step === 0 && (
          <>
            <h3>{translate("characterCreator.steps.base")}</h3>

            <input
              value={character.name}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "name",
                  value: e.target.value,
                })
              }
              placeholder="Name"
              style={styles.input}
            />

            <input
              value={character.background}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "background",
                  value: e.target.value,
                })
              }
              placeholder="Hintergrund"
              style={styles.input}
            />
          </>
        )}

        {step === 1 && (
          <>
            <h3>{translate("characterCreator.steps.class")}</h3>

            <input
              value={translate(`species.${character.species}`)}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "species",
                  value: e.target.value,
                })
              }
              style={styles.input}
            />

            {Object.values(Species).map((species) => (
              <div
                key={species}
                onClick={() =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "species",
                    value: species,
                  })
                }
                style={{
                  ...styles.choice,
                  borderColor:
                    character.species === species ? "#3b82f6" : "#4b4f57",
                }}
              >
                {translate(`species.${species}`)}
              </div>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h3>{translate("characterCreator.steps.attributes")}</h3>

            {character.attributes.forEach((attr) => (
              <div key={attr.name}>
                <label>{translate(`character.${attr.name}`)}</label>
                <input
                  type="number"
                  value={attr.value}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: attr.name as keyof CharacterSheet,
                      value: Number(e.target.value),
                    })
                  }
                  style={styles.input}
                />
              </div>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h3>{translate("characterCreator.steps.background")}</h3>

            <input
              value={character.alignment}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "alignment",
                  value: e.target.value,
                })
              }
              placeholder="Gesinnung"
              style={styles.input}
            />

            <textarea
              value={character.backstory}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "backstory",
                  value: e.target.value,
                })
              }
              style={styles.textarea}
            />
          </>
        )}
      </main>

      {/* PREVIEW */}
      <aside style={styles.card}>
        <h3>{translate("character.preview")}</h3>
        <div>
          <b>{character.name || "Unbenannt"}</b>
        </div>
        <div>
          {character.species} {character.class}
        </div>
        <div>STR {getAttributeByName(character, "strength")?.value}</div>
        <div>DEX {getAttributeByName(character, "dexterity")?.value}</div>
        <div>CON {getAttributeByName(character, "constitution")?.value}</div>
      </aside>
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
