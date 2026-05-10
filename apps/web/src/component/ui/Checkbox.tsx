import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export function Checkbox({ checked, onChange, ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      checked={checked}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
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
