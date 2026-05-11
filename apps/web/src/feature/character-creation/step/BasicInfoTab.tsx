import React, { useEffect, useState } from "react";
import { StepProps } from "../characterCreator.types";
import { Translator } from "@i18n";
import { Card } from "../../../component/ui/Card";
import { Label } from "../../../component/ui/Label";
import { Button } from "../../../component/ui/Button";
import { Background, CharacterClass, CharacterClassId, Species } from "@domain";
import { LabeledNumberInput } from "../../../component/ui/LabeledNumberInput";
import { LabeledInput } from "../../../component/ui/LabeledInput";

export function BasicInfoTab({ character, updateField }: StepProps) {
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);

  function updateClass(classId: CharacterClassId) {
    const newClass = classes.find((cls) => classId === cls.id);
    updateField("characterClass", newClass);
    updateField("subclass", undefined);
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then((res) => res.json()),
      fetch("/api/backgrounds").then((res) => res.json()),
    ])
      .then(([classesData, backgroundsData]) => {
        setClasses(classesData);
        setBackgrounds(backgroundsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const translator = new Translator("characterCreator.steps.basic_info");
  const selectedClass = classes.find(
    (cls) => cls.id == character.characterClass.id,
  );

  return (
    <>
      <h3>{translator.translate(".title")}</h3>
      <Card>
        <LabeledInput
          value={character.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Name"
          className="w-40"
          label={translator.translate(".name")}
        />
        <LabeledNumberInput
          label={translator.translate(".level")}
          value={character.level}
          min={1}
          max={20}
          onChange={(value) => {
            updateField("level", value);
            if ((value as number) < 3) updateField("subclass", undefined);
          }}
        />

        <LabeledNumberInput
          value={character.armorClass}
          onChange={(e) => updateField("armorClass", e)}
          label={translator.translate("character.armor_class")}
        />

        <LabeledNumberInput
          value={character.maxHitpoints}
          onChange={(e) => {
            updateField("maxHitpoints", e);
            updateField("currentHitpoints", e);
          }}
          label={translator.translate("character.hitpoints")}
        />
      </Card>

      <Card>
        <Label>{translator.translate(".species")}</Label>{" "}
        {Object.values(Species).map((species) => (
          <Button
            key={species}
            variant={character.species == species ? "primary" : "secondary"}
            onClick={() => updateField("species", species)}
          >
            {translator.translate(`species.${species}`)}
          </Button>
        ))}
      </Card>
      <Card>
        <Label>{translator.translate(".background")}</Label>{" "}
        {backgrounds.map((background) => (
          <Button
            key={background.id}
            variant={
              character.background.id == background.id ? "primary" : "secondary"
            }
            onClick={() => updateField("background", background)}
          >
            {translator.translate(`background.${background.id}`)}
          </Button>
        ))}
      </Card>
      <Card>
        <Label>{translator.translate(".character_class")}</Label>{" "}
        {Object.values(CharacterClassId).map((characterClassId) => (
          <Button
            key={characterClassId}
            variant={
              character.characterClass.id == characterClassId
                ? "primary"
                : "secondary"
            }
            onClick={() => updateClass(characterClassId)}
          >
            {translator.translate(`characterClass.${characterClassId}.title`)}
          </Button>
        ))}
      </Card>
      {character.level >= 3 && (
        <Card>
          <Label>{translator.translate(".subclass")}</Label>{" "}
          <Button
            variant={!character.subclass ? "primary" : "secondary"}
            onClick={() => updateField("subclass", undefined)}
          >
            {translator.translate(".none")}
          </Button>
          {loading && <div>Lade Subklassen...</div>}
          {!loading &&
            selectedClass?.subclasses?.map((sub) => (
              <Button
                key={sub.id}
                variant={
                  character.subclass?.id == sub.id ? "primary" : "secondary"
                }
                onClick={() => updateField("subclass", sub)}
              >
                {translator.translate(
                  `characterClass.${selectedClass.id}.subclasses.${sub.id}.title`,
                )}
              </Button>
            ))}
        </Card>
      )}
    </>
  );
}
