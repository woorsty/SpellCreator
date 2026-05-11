import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

type Item = {
  name: string;
  text: string;
};

type Props<T> = {
  items: T[];
  addItem: (newItem: T) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, data: T) => void;
};

export function ItemList<T extends Item>({
  items,
  addItem,
  removeItem,
}: Props<T>) {
  const [newItem, setNewItem] = useState("");

  function updateItem(index: number, data: Partial<Item>) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, ...data } : item,
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
            value={item.text}
            onChange={(e) => updateItem(i, { text: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
