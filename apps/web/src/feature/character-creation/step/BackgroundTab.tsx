import React from "react";
import { Translator } from "@i18n";
import { StepProps } from "../characterCreator.types";
import { Checkbox } from "../../../component/ui/Checkbox";
import { Alignment, Language } from "@domain";
import { Select } from "../../../component/ui/Select";

export function BackgroundTab({ character, updateField }: StepProps) {
  const translator = new Translator("characterCreator.steps.background");

  const toggleLanguage = (lang: Language) => {
    const exists = character.languages.includes(lang);

    const updated = exists
      ? character.languages.filter((l) => l !== lang)
      : [...character.languages, lang];

    updateField("languages", updated);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">{translator.translate(".title")}</h2>

      {/* Aussehen */}
      <div>
        <label className="font-semibold block mb-1">
          {translator.translate(".appearance")}
        </label>
        <textarea
          className="w-full border p-2 rounded min-h-20"
          value={character.appearance}
          onChange={(e) => updateField("appearance", e.target.value)}
        />
      </div>

      {/* Story */}
      <div>
        <label className="font-semibold block mb-1">
          {translator.translate(".story")}
        </label>
        <textarea
          className="w-full border p-2 rounded min-h-30"
          value={character.story}
          onChange={(e) => updateField("story", e.target.value)}
        />
      </div>

      {/* Gesinnung */}
      <Select
        value={character.alignment}
        onChange={(e) => updateField("alignment", e.target.value)}
      >
        {Object.values(Alignment).map((align) => (
          <option key={align} value={align}>
            {translator.translate(`alignment.${align}`)}
          </option>
        ))}
      </Select>

      {/* Sprachen */}
      <div>
        <label className="font-semibold block mb-2">
          {translator.translate(".languages")}
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(Language).map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <Checkbox
                checked={character.languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
              />
              {translator.translate(`language.${lang}`)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
