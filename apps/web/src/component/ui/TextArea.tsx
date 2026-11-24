import React, { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2.5 rounded bg-surface border border-border text-text placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none ${error ? "border-danger focus:ring-danger" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger">{error}</span>
      )}
    </div>
  );
}