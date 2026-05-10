import React, { useState, useMemo } from "react";
import { Input } from "./Input";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  options: Option<T>[];
  onSelect: (value: T) => void;
  placeholder?: string;
};

export function SearchableSelect<T>({
  options,
  onSelect,
  placeholder = "Suchen...",
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, options]);

  return (
    <div className="relative w-full">
      <Input
        className="w-full border p-2 rounded"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
      />

      {open && (
        <div className="absolute z-10 w-full border rounded mt-1 max-h-60 overflow-y-auto shadow">
          {filtered.length === 0 && (
            <div className="p-2 text-gray-500">Keine Treffer</div>
          )}

          {filtered.map((opt) => (
            <div
              key={opt.label}
              className="p-2 hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                onSelect(opt.value);
                setQuery("");
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
