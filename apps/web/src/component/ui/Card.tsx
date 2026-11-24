import React, { DetailedHTMLProps, PropsWithChildren } from "react";

type CardProps = PropsWithChildren &
  DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    variant?: "default" | "elevated" | "outlined";
  };

export function Card({
  children,
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  const variants = {
    default: "bg-surface border border-border",
    elevated: "bg-surface border border-border shadow-dnd",
    outlined: "bg-transparent border-2 border-border",
  };

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-200 hover:border-border-focus/50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
