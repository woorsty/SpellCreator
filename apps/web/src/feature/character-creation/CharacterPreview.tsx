import { AttributeService, CharacterSheet } from "@domain";
import React from "react";
import { Translator } from "@i18n";

type Props = {
  character: CharacterSheet;
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-md p-2 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

export function CharacterPreview({ character }: Props) {
  const translator = new Translator("characterCreator.preview");
  return (
    <div className="p-6 space-y-6 text-sm">
      {/* HEADER */}
      <section className="border p-4 rounded-md">
        <h1 className="text-2xl font-bold">{character.name}</h1>
        <div className="flex gap-4 text-gray-600">
          <span>
            {translator.translate(
              `characterClass.${character.characterClass.id}.title`,
            )}
          </span>
          <span>
            {translator.translate(".level")} {character.level}
          </span>
          <span>{translator.translate(`species.${character.species}`)}</span>
        </div>
      </section>

      {/* CORE STATS */}
      <section className="grid grid-cols-6 gap-2">
        {Object.entries(character.attributes).map(([key, attr]) => (
          <div key={key} className="border rounded-md p-1 text-center">
            <div className="text-xs uppercase">
              {translator.translate(`character.attribute.${key}_short`)}
            </div>
            <div className="text-lg font-bold">{attr.value}</div>
            <div className="text-gray-500">
              {AttributeService.formatModifier(
                AttributeService.calculateModifier(attr.value),
              )}
            </div>
          </div>
        ))}
      </section>

      {/* COMBAT */}
      <section className="grid grid-cols-4 gap-4">
        <Stat
          label={translator.translate("character.armor_class_short")}
          value={character.armorClass}
        />
        <Stat
          label={translator.translate("character.initiative_short")}
          value={character.initiative}
        />
        <Stat
          label={translator.translate("character.speed_short")}
          value={character.speed}
        />
        <Stat
          label={translator.translate("character.proficiency_short")}
          value={character.proficiencyBonus}
        />
      </section>

      {/* HITPOINTS */}
      <section className="border p-4 rounded-md">
        <div className="flex justify-between">
          <span>HP</span>
          <span>
            {character.currentHitpoints} / {character.maxHitpoints}
          </span>
        </div>
      </section>

      {/* ATTACKS */}
      <section className="border p-4 rounded-md">
        <h2 className="font-bold mb-2">Angriffe</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Name</th>
              <th>Bonus</th>
              <th>SG</th>
              <th>Schaden</th>
            </tr>
          </thead>
          <tbody>
            {character.attacks.map((a) => (
              <tr key={a.id} className="border-b">
                <td>{a.name}</td>
                <td>{a.attackBonus}</td>
                <td>{a.sg ?? "-"}</td>
                <td>
                  {a.damage} {a.damageType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SPELLS */}
      <section className="border p-4 rounded-md">
        <h2 className="font-bold mb-2">Zauber</h2>

        <div className="space-y-1">
          {character.preparedSpells.map((s, i) => (
            <div key={i} className="flex justify-between border-b">
              <span>
                {s.name} ({s.level})
              </span>
              <span className="text-gray-500">{s.school}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="border p-4 rounded-md">
        <h2 className="font-bold mb-2">Fähigkeiten</h2>
        <ul className="list-disc ml-4">
          {[
            ...character.characterClass.features.filter(
              (feat) => feat.level <= character.level,
            ),
            ...(character.subclass
              ? character.subclass.features.filter(
                  (feature) => feature.level <= character.level,
                )
              : []),
          ].map((f, i) => (
            <li key={i}>{translator.translate(`talent.${f.id}.title`)}</li>
          ))}
        </ul>
      </section>

      {/* EQUIPMENT */}
      <section className="border p-4 rounded-md">
        <h2 className="font-bold mb-2">Ausrüstung</h2>
        <ul>
          {character.equipment.map((e, i) => (
            <li key={i}>{e.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
