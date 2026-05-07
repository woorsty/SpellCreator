import React from "react";
import { Input } from "./Input";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export function NumberInput({ value, onChange }: NumberInputProps) {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
