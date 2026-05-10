import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ label, className = "", ...props }: Props) {
  return (
    <div className=" gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <select
        {...props}
        className={`
          border border-gray-300
          rounded-md
          px-3 py-2
          bg-surface
          text-sm
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
          focus:border-blue-500
          ${className}
        `}
      />
    </div>
  );
}
