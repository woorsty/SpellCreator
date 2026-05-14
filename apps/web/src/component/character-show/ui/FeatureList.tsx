import React, { useState } from "react";
import { Card } from "../../ui/Card";
import { FeatureCard } from "./FeatureCard";
import { CharacterSheet, ClassFeature } from "@repo/domain";

export const FeatureList = ({
  title,
  character,
  items,
  editable = false,
  updateCharacter,
}: {
  character: CharacterSheet;
  title: string;
  items: {
    index: number;
    name: string;
    notes?: string;
    editPath?: string;
  }[];
  editable: boolean;
  updateCharacter: (key: keyof CharacterSheet | string, value: any) => void;
}) => (
  <Card>
    <h2 className="section-title">{title}</h2>
    <ul className="list">
      {items.map((item, i) => (
        <li key={i}>
          <FeatureCard
            character={character}
            updateCharacter={updateCharacter}
            feature={item}
            editable={editable}
          />
        </li>
      ))}
    </ul>
  </Card>
);
