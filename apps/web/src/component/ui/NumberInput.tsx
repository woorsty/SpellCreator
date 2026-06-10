import React, { InputHTMLAttributes } from "react";
import { Input } from "./Input";

type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: number;
  onChange: (value?: number) => void;
};

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const className =
    "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none " +
    props.className;

  return (
    <Input
      {...props}
      type="number"
      value={value ?? ""}
      style={{ textAlign: "center" }}
      className={className}
      onChange={(e) => {
        const value = e.target.value;

        onChange(value === "" ? undefined : Number(value));
      }}
    />
  );
}
