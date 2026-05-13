import React, { useState } from "react";
import { Button } from "../../../component/ui/Button";
import { NumberInput } from "../../../component/ui/NumberInput";
import { CharacterViewProps } from "./CharacterViewProps";
import { Card } from "../../../component/ui/Card";

export const HitPointCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const [damage, setDamge] = useState<number>(0);

  const updateHitpoints = (heal: boolean = false) => {
    if (!character) {
      return;
    }

    if (heal) {
      const heal = Math.min(
        character.maxHitpoints,
        character.currentHitpoints + damage,
      );
      updateCharacter("currentHitpoints", heal);
    } else {
      const tempHp = character.temporaryHitpoints - damage;
      if (tempHp < 0) {
        const dmg = Math.max(0, character.currentHitpoints + tempHp);
        updateCharacter("currentHitpoints", dmg);
      }
      updateCharacter("temporaryHitpoints", Math.max(0, tempHp));
    }
  };

  return (
    <div className="quickbox">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "10px",
        }}
      >
        <Card>
          <div className="label">Trefferpunkte</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div className="label">Aktuell</div>
              <div className="value">{character.currentHitpoints}</div>

              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <NumberInput
                  value={damage}
                  className="w-16"
                  min={0}
                  onChange={(e) => setDamge(e as number)}
                ></NumberInput>
                <Button
                  onClick={() => updateHitpoints(false)}
                  className="hp-btn damage"
                >
                  −
                </Button>

                <Button
                  onClick={() => updateHitpoints(true)}
                  className="hp-btn heal"
                >
                  +
                </Button>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                textAlign: "center",
              }}
            >
              <div>
                <div className="label">Max</div>
                <div className="value">{character.maxHitpoints}</div>
              </div>
              <div>
                <div className="label">Temp</div>
                <div className="value">{character.temporaryHitpoints}</div>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="label">Trefferwürfel</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "6px",
            }}
          >
            <div>
              <div className="label">Verbraucht</div>
              <NumberInput
                min={0}
                max={character.level}
                onChange={(e) => updateCharacter("spentHitDice", e as number)}
                className="value"
                value={character.spentHitDice}
              />
            </div>
            <div>
              <div className="label">Max</div>
              <div className="value">{`${character.level}W${character.characterClass.hitDie}`}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
