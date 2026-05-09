import React from "react";
import { NumberInput } from "../../component/ui/NumberInput";
import { Label } from "../../component/ui/Label";
import { Translator } from "@i18n";

type CoinsRowProps = {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
  updateField: (field: string, value: any) => void;
};

export function CoinsRow({
  copper,
  silver,
  electrum,
  gold,
  platinum,
  updateField,
}: CoinsRowProps) {
  const translator = new Translator("characterCreator.steps.equipment");
  const inputSize = "w-16";
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <NumberInput
          value={platinum}
          onChange={(v) => updateField("platinum", v)}
          className={`text-center ${inputSize}`}
        />
        <span className="mr-4">{translator.translate(".platinum")}</span>

        <NumberInput
          value={gold}
          onChange={(v) => updateField("gold", v)}
          className={`text-center ${inputSize}`}
        />
        <span className="mr-4">{translator.translate(".gold")}</span>

        <NumberInput
          value={electrum}
          onChange={(v) => updateField("electrum", v)}
          className={`text-center ${inputSize}`}
        />
        <span className="mr-4">{translator.translate(".electrum")}</span>

        <NumberInput
          value={silver}
          onChange={(v) => updateField("silver", v)}
          className={`text-center ${inputSize}`}
        />
        <span className="mr-4">{translator.translate(".silver")}</span>

        <NumberInput
          value={copper}
          onChange={(v) => updateField("copper", v)}
          className={`text-center ${inputSize}`}
        />
        <span className="mr-4">{translator.translate(".copper")}</span>
      </div>
    </div>
  );
}
