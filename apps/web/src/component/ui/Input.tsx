import React, { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`
        
        rounded-lg
        border
        border-border
        bg-surface-2
        px-3
        py-2
        text-text
        outline-none
        transition-colors
        focus:border-primary
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
    />
  );
}
