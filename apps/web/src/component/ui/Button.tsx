import React, { ButtonHTMLAttributes } from "react";
import "./button.css";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:opacity-90 active:opacity-80",

    secondary: "bg-surface-2 text-text border border-border hover:bg-surface",

    ghost: "text-text hover:bg-surface-2",
  };

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
