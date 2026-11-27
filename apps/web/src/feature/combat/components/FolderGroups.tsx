import React, { useMemo, useState } from "react";

const ROOT_KEY = "__root__";

export type FolderGroupsProps<T> = {
  items: T[];
  getFolder: (item: T) => string | undefined;
  getId: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  emptyLabel?: React.ReactNode;
};

/**
 * Groups items by an optional folder string and renders collapsible folder
 * sections. Items without a folder are rendered ungrouped at the top.
 */
export function FolderGroups<T>({
  items,
  getFolder,
  getId,
  renderItem,
  emptyLabel,
}: FolderGroupsProps<T>) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const map = new Map<string, T[]>();
    for (const item of items) {
      const key = getFolder(item) || "";
      (map.get(key) ?? map.set(key, []).get(key)!).push(item);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [items, getFolder]);

  const toggle = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (items.length === 0) {
    return <>{emptyLabel ?? null}</>;
  }

  return (
    <>
      {groups.map(([folder, groupItems]) => {
        const isOpen = !collapsed.has(folder || ROOT_KEY);
        return (
          <div key={folder || ROOT_KEY} className="space-y-1">
            {folder && (
              <button
                className="text-xs font-semibold text-text-muted px-1 w-full text-left"
                onClick={() => toggle(folder || ROOT_KEY)}
              >
                {isOpen ? "▼" : "▶"} {folder}
              </button>
            )}
            {(isOpen || !folder) &&
              groupItems.map((item) => (
                <React.Fragment key={getId(item)}>
                  {renderItem(item)}
                </React.Fragment>
              ))}
          </div>
        );
      })}
    </>
  );
}