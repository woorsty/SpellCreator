import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  asChild = false,
  href,
  ...props
}: ButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const base = "inline-flex items-center justify-center rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-dnd-glow",
    secondary: "bg-surface-2 border border-border text-text hover:bg-bg-panel-hover focus:ring-border-focus",
    ghost: "bg-transparent text-text-muted hover:bg-surface hover:text-text focus:ring-border-focus",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const Common = ({ className: cn, ...rest }: any) => (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${cn}`} {...rest}>
      {children}
    </span>
  );

  if (asChild) {
    return <Common className={className} {...props} />;
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
