import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { Card } from "../../../component/ui/Card";
import { Button } from "../../../component/ui/Button";
import { Translator } from "@repo/i18n";

export const DeathSavesCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const translator = new Translator("characterShow.card.death_saves");

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h3 className="death-label">{translator.translate(".title")}</h3>
        <div className="death-column">
          <div className="death-label">{translator.translate(".success")}</div>
          <div className="death-row">
            {[1, 2, 3].map((i) => (
              <div
                key={`success-${i}`}
                className={`skill-check ${character.successDeathSaves >= i ? "filled" : ""}`}
              />
            ))}
            <Button
              onClick={() =>
                updateCharacter(
                  "successDeathSaves",
                  character.successDeathSaves + 1,
                )
              }
            >
              +
            </Button>
          </div>
        </div>
        <div className="death-column">
          <div className="death-label">{translator.translate(".fail")}</div>
          <div className="death-row">
            {[1, 2, 3].map((i) => (
              <div
                key={`fail-${i}`}
                className={`skill-check ${character.failedDeathSaves >= i ? "filled" : ""}`}
              />
            ))}
            <Button
              onClick={() =>
                updateCharacter(
                  "failedDeathSaves",
                  character.failedDeathSaves + 1,
                )
              }
            >
              +
            </Button>
          </div>
        </div>
        <Button
          onClick={() => {
            updateCharacter("successDeathSaves", 0);
            updateCharacter("failedDeathSaves", 0);
          }}
        >
          {translator.translate(".reset")}
        </Button>
      </div>
    </Card>
  );
};
