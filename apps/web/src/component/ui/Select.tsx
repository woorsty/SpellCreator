import React, { DetailedHTMLProps, SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({
  label,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2.5 rounded bg-surface border border-border text-text focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors ${error ? "border-danger focus:ring-danger" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger">{error}</span>
      )}
    </div>
  );
}
