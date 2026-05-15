import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { Spellslots } from "@repo/domain";
import { Translator } from "@repo/i18n";
import { Button } from "../../ui/Button";

export const SpellSlotsCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  const translator = new Translator("characterShow.card.spell_slots");

  return (
    <div className="card">
      <h2 className="section-title">{translator.translate(".title")}</h2>
      <div className="spellslots-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
          const total =
            character.spellSlots.total[character.level - 1][
              `slot${level}` as keyof Spellslots
            ] || 0;
          const used =
            character.spellSlots.used[`slot${level}` as keyof Spellslots] || 0;
          if (total === 0) return null;

          return (
            <div key={level} className="slot-card">
              <div className="slot-top">
                <span className="slot-grade">
                  {translator.translate(".grade")} {level}
                </span>
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateCharacter(
                      `spellSlots.used.slot${level}`,
                      Math.min(used + 1, total),
                    )
                  }
                >
                  🪄
                </Button>
                <div className="slot-right">
                  <div className="slot-gems">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className={`gem ${j <= total ? (j <= used ? "used" : "free") : "hidden"}`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateCharacter(
                      `spellSlots.used.slot${level}`,
                      Math.max(used - 1, 0),
                    )
                  }
                >
                  ⌛
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
