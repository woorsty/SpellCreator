import React from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="
        h-5
        w-5
        cursor-pointer
        rounded
        border-border
        bg-surface-2
      "
    />
  );
}
