import { CharacterSheet } from "@repo/domain";
import React, { useEffect, useState } from "react";
import { Card } from "../../component/ui/Card";
import { A } from "../../component/ui/A";

export function CharacterSheetList() {
  const [characterData, setCharacterData] = useState<CharacterSheet[]>([]);

  useEffect(() => {
    fetch("/api/characters")
      .then((res) => res.json())
      .then((characterData) => {
        setCharacterData(characterData);
      });
  }, []);

  console.log(characterData);

  return (
    <>
      {characterData.map((character) => (
        <Card>
          <A href={`show/${character.name}`}>{character.name}</A>
        </Card>
      ))}
    </>
  );
}
