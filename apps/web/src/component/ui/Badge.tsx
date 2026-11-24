import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "primary" | "success" | "danger" | "warning" | "info";
};

export function Badge({
  children,
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-surface-2 border border-border text-text-muted",
    primary: "bg-primary/10 text-primary border-primary/30",
    success: "bg-success/10 text-success border-success/30",
    danger: "bg-danger/10 text-danger border-danger/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    info: "bg-info/10 text-info border-info/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
