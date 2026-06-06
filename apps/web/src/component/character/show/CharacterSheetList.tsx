import { CharacterSheet, fetchUrl } from "@repo/domain";
import React, { useEffect, useState } from "react";
import { Card } from "../../ui/Card";
import { A } from "../../ui/A";

export function CharacterSheetList() {
  const [characterData, setCharacterData] = useState<CharacterSheet[]>([]);

  useEffect(() => {
    fetchUrl("/api/characters")
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
          <A href={`show/${character.name}`} key={character.name}>
            {character.name}
          </A>
        </Card>
      ))}
    </>
  );
}
