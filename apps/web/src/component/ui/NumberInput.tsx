import React, { InputHTMLAttributes } from "react";
import { Input } from "./Input";

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value: number;
  onChange: (value: number) => void;
};

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  function getMaxLength() {
    const candidates = [value, props.min, props.max]
      .filter((v): v is number => v !== undefined)
      .map((v) => Math.abs(v).toString().length);

    return Math.max(...candidates, 1);
  }

  const length = getMaxLength();

  return (
    <Input
      {...props}
      style={
        props.max
          ? {
              width: `${length + 6}ch`, // +1 für etwas Padding
            }
          : undefined
      }
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
