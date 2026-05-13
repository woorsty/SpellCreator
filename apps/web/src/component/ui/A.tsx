import React from "react";

type AProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "default" | "subtle" | "button";
};

export function A({
  children,
  className = "",
  variant = "default",
  ...props
}: AProps) {
  const baseStyles = "transition-colors";

  const variants = {
    default: "underline text-blue-600 hover:text-blue-800",
    subtle: "text-gray-600 hover:text-gray-900",
    button:
      "px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 inline-block",
  };

  return (
    <a {...props} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
}
