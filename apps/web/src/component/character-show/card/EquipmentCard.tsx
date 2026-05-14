import React from "react";
import { CharacterViewProps } from "./CharacterViewProps";
import { ListCard } from "../../ui/ListCard";

export const EquipmentCard: React.FC<CharacterViewProps> = ({
  character,
  updateCharacter,
}) => {
  return (
    <ListCard
      title="Ausrüstung"
      items={character.equipment.map((e) => {
        return { name: e.name };
      })}
    />
  );
};
