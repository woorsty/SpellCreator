import React, { InputHTMLAttributes } from "react";
import { Label } from "./Label";
import { NumberInput } from "./NumberInput";

type LabeledNumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

export function LabeledNumberInput({
  label,
  value,
  onChange,
  ...props
}: LabeledNumberInputProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24">
        <Label>{label}</Label>
      </div>

      <NumberInput
        value={value}
        onChange={onChange}
        className="w-20 text-center font-semibold"
        {...props}
      />
    </div>
  );
}
