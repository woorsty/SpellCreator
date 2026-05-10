import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

type Item = {
  name: string;
  notes: string;
};

type Props = {
  items: Item[];
  field: string;
  updateField: (field: string, value: any) => void;
};

export function ItemList({ items, field, updateField }: Props) {
  const [newItem, setNewItem] = useState("");

  function addItem() {
    if (!newItem.trim()) return;

    updateField(field, [...items, { name: newItem, notes: "" }]);
    setNewItem("");
  }

  function updateItem(index: number, data: Partial<Item>) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, ...data } : item,
    );

    updateField(field, updated);
  }

  function removeItem(index: number) {
    updateField(
      field,
      items.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="space-y-3">
      {/* Add */}
      <div className="flex gap-2">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
        <Button onClick={addItem}>+</Button>
      </div>

      {/* List */}
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-surface-3 p-3 rounded-md border border-gray-700"
        >
          <div className="flex justify-between ">
            <span className="">{item.name}</span>
            <Button onClick={() => removeItem(i)}>✕</Button>
          </div>

          <TextArea
            value={item.notes}
            onChange={(e) => updateItem(i, { notes: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
