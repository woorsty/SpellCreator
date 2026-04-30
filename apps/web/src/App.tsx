import React, { useReducer } from "react";

type Character = {
  name: string;
  background: string;
  class: string;
  species: string;
  alignment: string;
  backstory: string;
  strength: number;
  dexterity: number;
  constitution: number;
};

const emptyCharacter: Character = {
  name: "",
  background: "",
  class: "Fighter",
  species: "Human",
  alignment: "Neutral",
  backstory: "",
  strength: 10,
  dexterity: 10,
  constitution: 10,
};

// -----------------------------
// State
// -----------------------------

type State = {
  step: number;
  character: Character;
};

const initialState: State = {
  step: 0,
  character: emptyCharacter,
};

// -----------------------------
// Actions (Java-like explicitness)
// -----------------------------

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "UPDATE_FIELD"; field: keyof Character; value: any };

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

// -----------------------------
// Component
// -----------------------------

export default function CharacterCreator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, character } = state;

  const steps = ["Charakterdaten", "Klasse & Volk", "Attribute", "Hintergrund"];

  return (
    <div style={styles.layout}>
      {/* NAV */}
      <aside style={styles.card}>
        <h2>Charakter erstellen</h2>
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
            <h3>Charakterdaten</h3>

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
            <h3>Klasse & Volk</h3>

            <input
              value={character.species}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "species",
                  value: e.target.value,
                })
              }
              style={styles.input}
            />

            {"Fighter Wizard Rogue Cleric".split(" ").map((c) => (
              <div
                key={c}
                onClick={() =>
                  dispatch({ type: "UPDATE_FIELD", field: "class", value: c })
                }
                style={{
                  ...styles.choice,
                  borderColor: character.class === c ? "#3b82f6" : "#4b4f57",
                }}
              >
                {c}
              </div>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h3>Attribute</h3>

            {["strength", "dexterity", "constitution"].map((attr) => (
              <div key={attr}>
                <label>{attr}</label>
                <input
                  type="number"
                  value={(character as any)[attr]}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: attr as keyof Character,
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
            <h3>Hintergrund</h3>

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
        <h3>Charaktervorschau</h3>
        <div>
          <b>{character.name || "Unbenannt"}</b>
        </div>
        <div>
          {character.species} {character.class}
        </div>
        <div>STR {character.strength}</div>
        <div>DEX {character.dexterity}</div>
        <div>CON {character.constitution}</div>
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
