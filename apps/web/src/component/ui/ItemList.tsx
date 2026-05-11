import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

type Props<T> = {
  data: T[];
  field: string;
  labelProperty: keyof T;
  textProperty: keyof T;
  updateField: (field: string, value: any) => void;
};

export function ItemList<T>({
  data,
  field,
  labelProperty,
  textProperty,
  updateField,
}: Props<T>) {
  const [newItem, setNewItem] = useState("");
  const items = data.map((dat) => ({
    [labelProperty]: dat[labelProperty],
    [textProperty]: dat[textProperty],
  }));

  function addItem() {
    if (!newItem.trim()) return;

    const updated = [
      ...items,
      { [labelProperty]: newItem, [textProperty]: "" },
    ];

    updateField(field, updated);

    setNewItem("");
  }

  function updateItem(
    index: number,
    data: Partial<{ [labelProperty]: string; [textProperty]: string }>,
  ) {
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
      {data.map((item, i) => (
        <div
          key={i}
          className="bg-surface-3 p-3 rounded-md border border-gray-700"
        >
          <div className="flex justify-between ">
            <span className="">{item[labelProperty] as string}</span>
            <Button onClick={() => removeItem(i)}>✕</Button>
          </div>

          <TextArea
            value={item[textProperty] as string}
            onChange={(e) => updateItem(i, { [textProperty]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
