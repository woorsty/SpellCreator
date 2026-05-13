import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Translator } from "@i18n";
import { CharacterService, CharacterSheet, Spellslots } from "@domain";
import "./CharacterSheetView.css";
import { HitPoints } from "./component/HitPoints";

export const CharacterSheetView: React.FC = () => {
  const [character, setCharacter] = useState<CharacterSheet>();
  const params = useParams();

  const updateCharacter = (key: keyof CharacterSheet, value: any) => {
    setCharacter((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev!,
        [key]: value,
      };

      CharacterService.saveCharacter(updated);
      return updated;
    });
  };

  useEffect(() => {
    fetch(`/api/characters/${params.name}`)
      .then((res) => res.json())
      .then((characterData) => {
        setCharacter(characterData);
      });
  }, [params.name]);

  const translator = new Translator("");
  const t = translator.translate;

  const sign = (n: number) => (n >= 0 ? `+${n}` : n);

  if (!character) {
    return <p>Keiner da</p>;
  }

  return (
    <div className="sheet">
      <div className="top">
        <div className="grid-2">
          <div className="character-info">
            <div className="card">
              <div className="label">Charaktername</div>
              <div className="value">{character.name}</div>
            </div>
            <div className="grid-2-small">
              <div className="card">
                <div className="label">Hintergrund</div>
                <div className="value">
                  {t(`background.${character.background.id}`)}
                </div>
              </div>
              <div className="card">
                <div className="label">Klasse</div>
                <div className="value">
                  {t(`characterClass.${character.characterClass.id}.title`)}
                </div>
              </div>
              <div className="card">
                <div className="label">Volk</div>
                <div className="value">
                  {t(`species.${character.species.id}.name`)}
                </div>
              </div>
              <div className="card">
                <div className="label">Unterklasse</div>
                <div className="value">
                  {t(
                    `characterClass.${character.characterClass.id}.subclasses.${character.subclass?.id}.title`,
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="quickbox">
            <div className="card">
              <div className="label">Stufe</div>
              <div className="value">{character.level}</div>
            </div>
            <div className="card">
              <div className="label">EP</div>
              <div className="value">{character.xp}</div>
            </div>
          </div>
        </div>

        <div className="quickbox">
          <div className="card">
            <div className="label">Rüstungsklasse</div>
            <div className="value">{character.armorClass}</div>
          </div>
        </div>

        <HitPoints character={character} updateCharacter={updateCharacter} />

        <div className="quickbox">
          <h2 className="section-title">Todesrettungswürfe</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div className="death-column">
              <div className="death-label">Erfolge</div>
              <div className="death-row">
                {[1, 2, 3].map((i) => (
                  <div
                    key={`success-${i}`}
                    className={`skill-check ${character.successDeathSaves >= i ? "filled" : ""}`}
                  />
                ))}
              </div>
            </div>
            <div className="death-column">
              <div className="death-label">Fehlschläge</div>
              <div className="death-row">
                {[1, 2, 3].map((i) => (
                  <div
                    key={`fail-${i}`}
                    className={`skill-check ${character.failedDeathSaves >= i ? "filled" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="firstpage">
        <div className="left">
          <div className="card">
            <h2 className="section-title">Attribute</h2>
            <div className="abilities">
              <div className="abilities-left">
                <div className="mini-stat">
                  <div className="label">Übungsbonus</div>
                  <div className="value">+{character.proficiencyBonus}</div>
                </div>

                {/* Stat-Block Template Funktion für DRY Code */}
                {renderAbility(t, sign, "strength", "Stärke", character, [
                  { id: "athletics", label: "Athletik" },
                ])}
                {renderAbility(
                  t,
                  sign,
                  "dexterity",
                  "Geschicklichkeit",
                  character,
                  [
                    { id: "acrobatics", label: "Akrobatik" },
                    { id: "sleightOfHand", label: "Fingerfertigkeit" },
                    { id: "stealth", label: "Heimlichkeit" },
                  ],
                )}
                {renderAbility(
                  t,
                  sign,
                  "constitution",
                  "Konstitution",
                  character,
                )}

                <div className="mini-stat">
                  <div className="label">Heroische Inspiration</div>
                  <div
                    className={`heroic-circle ${character.heroicInspiration ? "filled" : ""}`}
                  />
                </div>
              </div>

              <div className="abilities-right">
                {renderAbility(
                  t,
                  sign,
                  "intelligence",
                  "Intelligenz",
                  character,
                  [
                    { id: "arcana", label: "Arkane Kunde" },
                    { id: "history", label: "Geschichte" },
                    { id: "investigation", label: "Nachforschung" },
                    { id: "nature", label: "Naturkunde" },
                    { id: "religion", label: "Religion" },
                  ],
                )}
                {renderAbility(t, sign, "wisdom", "Weisheit", character, [
                  { id: "medicine", label: "Heilkunde" },
                  { id: "animalHandling", label: "Mit Tieren umgehen" },
                  { id: "insight", label: "Motiv erkennen" },
                  { id: "survival", label: "Überlebenskunst" },
                  { id: "perception", label: "Wahrnehmung" },
                ])}
                {renderAbility(t, sign, "charisma", "Charisma", character, [
                  { id: "performance", label: "Auftreten" },
                  { id: "intimidation", label: "Einschüchtern" },
                  { id: "deception", label: "Täuschen" },
                  { id: "persuasion", label: "Überzeugen" },
                ])}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-title">Übung & Kompetenzen</div>
            <div className="label">Rüstung</div>
            <div className="training-grid-4">
              <TrainingRow
                checked={character.armorTraining.light}
                label="Leichte"
              />
              <TrainingRow
                checked={character.armorTraining.medium}
                label="Mittlere"
              />
              <TrainingRow
                checked={character.armorTraining.heavy}
                label="Schwere"
              />
              <TrainingRow
                checked={character.armorTraining.shield}
                label="Schilde"
              />
            </div>

            <div className="label" style={{ marginTop: "12px" }}>
              Waffen
            </div>
            <div className="training-grid-2">
              <TrainingRow
                checked={character.weaponTraining.simple}
                label="Einfache"
              />
              <TrainingRow
                checked={character.weaponTraining.martial}
                label="Kriegswaffen"
              />
              <TrainingRow
                checked={character.weaponTraining.light}
                label="Leichte Kriegswaffen"
              />
              <TrainingRow
                checked={character.weaponTraining.finesse}
                label="Finessewaffen"
              />
            </div>

            <div style={{ marginTop: "12px" }}>
              <div className="label">Werkzeuge</div>
              <div className="tool-list">
                {character.toolProficiencies?.length > 0 ? (
                  <div>
                    {character.toolProficiencies.map((p) => p.name).join(", ")}
                  </div>
                ) : (
                  <div className="skill-row">
                    <div
                      className="skill-name"
                      style={{ color: "var(--muted)" }}
                    >
                      Keine
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="center">
          <div className="card">
            <div className="quickstats">
              <QuickStat
                label="Initiative"
                value={sign(character.initiative)}
              />
              <QuickStat
                label="Bewegungsrate"
                value={character.species.speed}
              />
              <QuickStat label="Größe" value={t(`size.${character.size}`)} />
              <QuickStat
                label="Passive Wahrnehmung"
                value={character.passivePerception}
              />
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Waffen & Angriffszauber</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Bonus/SG</th>
                  <th>Schaden</th>
                  <th>Art</th>
                  <th>Notizen</th>
                </tr>
              </thead>
              <tbody>
                {character.attacks.map((w, i) => (
                  <tr key={i}>
                    <td>{w.name}</td>
                    <td>{`${sign(w.attackBonus)}/${sign(w.sg)}`}</td>
                    <td>{w.damage}</td>
                    <td>{t(`damage_type.${w.damageType}`)}</td>
                    <td>{w.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid-2">
            <ListCard
              title="Klassenmerkmale"
              items={character.characterClass.features
                .map((f) => {
                  return {
                    name: t(
                      `characterClass.${character.characterClass.id}.features.${f.id}.name`,
                    ),
                    level: f.level,
                  };
                })
                .concat(
                  character.subclass
                    ? character.subclass.features.map((f) => {
                        return {
                          name: t(
                            `characterClass.${character.characterClass.id}.subclasses.${character.subclass!.id}.features.${f.id}.name`,
                          ),
                          level: f.level,
                        };
                      })
                    : [],
                )
                .sort((a, b) => a.level - b.level)
                .map((f) => f.name)}
            />
            <ListCard
              title="Volksmerkmale"
              items={character.species.feats.map((f) =>
                t(`species.${character.species.id}.feats.${f.id}.name`),
              )}
            />
          </div>

          <div className="card">
            <h2 className="section-title">Talente</h2>
            <ul className="list">
              {character.feats.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="page-two">
        <div className="page-two-left">
          <div className="page-two-top">
            <div className="card">
              <h2 className="section-title">Zauberwirken</h2>
              <div className="quickstats">
                <QuickStat
                  label="Attribut"
                  value={t(
                    `character.attribute.${character.characterClass.castingAttribute || character.subclass?.castingAttribute || "none"}`,
                  )}
                />
                <QuickStat
                  label="Mod"
                  value={sign(
                    character.spellAttackBonus - character.proficiencyBonus,
                  )}
                />
                <QuickStat label="SG" value={character.spellSaveDC} />
                <QuickStat
                  label="Angriff"
                  value={sign(character.spellAttackBonus)}
                />
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Zauberplätze</h2>
              <div className="spellslots-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
                  const total =
                    character.spellSlots.total[character.level - 1][
                      `slot${level}` as keyof Spellslots
                    ] || 0;
                  const used = character.spellSlots.used[level] || 0;
                  if (total === 0) return null;

                  return (
                    <div key={level} className="slot-card">
                      <div className="slot-top">
                        <span className="slot-grade">Grad {level}</span>
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">
              Zaubertricks & Vorbereitete Zauber
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Grad</th>
                  <th>Name</th>
                  <th>Aufwand</th>
                  <th>Reichweite</th>
                  <th>Konz.</th>
                  <th>Ritual</th>
                  <th>Material</th>
                  <th>Notizen</th>
                </tr>
              </thead>
              <tbody>
                {character.preparedSpells.map((s, i) => (
                  <tr key={i}>
                    <td>{s.level}</td>
                    <td>
                      <a
                        href={`/spell/${s.name}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td>{s.castingTime}</td>
                    <td>{s.range}</td>
                    <td>
                      <input
                        type="checkbox"
                        readOnly
                        checked={s.concentration}
                      />
                    </td>
                    <td>
                      <input type="checkbox" readOnly checked={s.ritual} />
                    </td>
                    <td>{s.components.material}</td>
                    <td>{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-two-right">
          <TextCard title="Aussehen" text={character.appearance} />
          <TextCard title="Hintergrundgeschichte" text={character.story} />
          <div className="card">
            <h2 className="section-title">Gesinnung</h2>
            <div>{t(`alignment.${character.alignment}`)}</div>
          </div>
          <ListCard
            title="Sprachen"
            items={character.languages.map((l) => t(`language.${l}`))}
          />
          <ListCard
            title="Ausrüstung"
            items={character.equipment.map((e) => e.name)}
          />
          <ListCard
            title="Eingestimmte magische Gegenstände"
            items={Object.values(character.attunedMagicItems)}
          />

          <div className="card">
            <h2 className="section-title">Münzen</h2>
            <div className="money">
              <QuickStat label="KM" value={character.coins.copper} />
              <QuickStat label="SM" value={character.coins.silver} />
              <QuickStat label="EM" value={character.coins.electrum} />
              <QuickStat label="GM" value={character.coins.gold} />
              <QuickStat label="PM" value={character.coins.platinum} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderAbility = (
  t: any,
  sign: any,
  attrKey: string,
  label: string,
  character: CharacterSheet,
  skills: { id: string; label: string }[] = [],
) => {
  const attr =
    character.attributes[attrKey as keyof typeof character.attributes];
  return (
    <div className="ability">
      <div className="ability-name">{label}</div>
      <div className="ability-header">
        <div className="ability-statbox">
          <div className="ability-stat-label">Wert</div>
          <div className="ability-stat-value">{attr.value}</div>
        </div>
        <div className="ability-statbox">
          <div className="ability-stat-label">Mod</div>
          <div className="ability-stat-mod">{sign(attr.modifier)}</div>
        </div>
      </div>
      <div className="skill-row">
        <div className={`skill-check ${attr.proficiency ? "filled" : ""}`} />
        <div className="skill-mod">{sign(attr.savingThrow)}</div>
        <div className="skill-name">Rettungswurf</div>
      </div>
      {skills.map((s) => {
        const skillData = (attr as any).skills[s.id];
        return (
          <div key={s.id} className="skill-row">
            <div
              className={`skill-check ${skillData.proficiency ? "filled" : ""}`}
            />
            <div className="skill-mod">{sign(skillData.modifier)}</div>
            <div className="skill-name">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const QuickStat = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="quickbox">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);

const TrainingRow = ({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) => (
  <div className="skill-row">
    <div className={`skill-check ${checked ? "filled" : ""}`} />
    <div className="skill-name">{label}</div>
  </div>
);

const ListCard = ({ title, items }: { title: string; items: string[] }) => (
  <div className="card">
    <h2 className="section-title">{title}</h2>
    <ul className="list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);

const TextCard = ({ title, text }: { title: string; text: string }) => (
  <div className="card">
    <h2 className="section-title">{title}</h2>
    <div>{text}</div>
  </div>
);
