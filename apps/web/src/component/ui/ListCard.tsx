import React from "react";

export const ListCard = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div className="card">
    <h2 className="section-title">{title}</h2>
    <ul className="list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);
