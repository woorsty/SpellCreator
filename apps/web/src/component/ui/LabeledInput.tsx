import React, { InputHTMLAttributes } from "react";
import { Label } from "./Label";
import { Input } from "./Input";

type LabeledInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string;
};

export function LabeledInput({ label, value, ...props }: LabeledInputProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24">
        <Label>{label}</Label>
      </div>

      <Input
        {...props}
        value={value}
        className="w-20 text-center font-semibold"
      />
    </div>
  );
}
