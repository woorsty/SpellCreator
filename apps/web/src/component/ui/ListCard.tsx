import React, { useState } from "react";
import { Card } from "./Card";

export const ListCard = ({
  title,
  items,
}: {
  title: string;
  items: { name: string; notes?: string }[];
}) => {
  return (
    <Card>
      <h2 className="section-title">{title}</h2>
      <ul className="list">
        {items.map((item, i) => (
          <li key={i}>{item.name}</li>
        ))}
      </ul>
    </Card>
  );
};
