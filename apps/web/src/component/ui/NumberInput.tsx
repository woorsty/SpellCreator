import React, { InputHTMLAttributes } from "react";
import { Input } from "./Input";

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value: number;
  onChange: (value: number) => void;
};

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  return (
    <Input
      {...props}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
