import React, { useState } from "react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

type EquipmentItem = {
  name: string;
  notes: string;
};

type EquipmentListProps = {
  equipment: EquipmentItem[];
  updateField: (field: string, value: any) => void;
};

export function EquipmentList({ equipment, updateField }: EquipmentListProps) {
  const [newItem, setNewItem] = useState("");

  function addItem() {
    if (!newItem.trim()) return;

    updateField("equipment", [
      ...equipment,
      { name: newItem.trim(), notes: "" },
    ]);

    setNewItem("");
  }

  function removeItem(index: number) {
    const updated = equipment.filter((_, i) => i !== index);
    updateField("equipment", updated);
  }

  function updateNotes(index: number, notes: string) {
    const updated = equipment.map((item, i) =>
      i === index ? { ...item, notes } : item,
    );

    updateField("equipment", updated);
  }

  return (
    <div className="space-y-3">
      {/* ADD ITEM */}
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Equipment hinzufügen..."
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
        />

        <Button onClick={addItem}>+</Button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {equipment.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-surface-2 p-3"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{item.name}</span>

              <Button variant="ghost" onClick={() => removeItem(index)}>
                ✕
              </Button>
            </div>

            {/* NOTES */}
            <textarea
              value={item.notes}
              onChange={(e) => updateNotes(index, e.target.value)}
              placeholder="Notizen..."
              className="
                w-full
                rounded-md
                border
                border-border
                bg-surface
                p-2
                text-sm
                text-text
                resize-y
                outline-none
                focus:border-primary
              "
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
