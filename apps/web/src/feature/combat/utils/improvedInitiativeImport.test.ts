import { describe, it, expect } from "vitest";
import { parseImprovedInitiative } from "./improvedInitiativeImport";

function statBlock(overrides: Record<string, unknown> = {}) {
  return {
    Id: "sb1",
    Name: "Bullywug",
    Path: "Hexenlicht",
    HP: { Value: 11, Notes: "(1d1+0)" },
    AC: { Value: 15, Notes: "" },
    InitiativeModifier: 1,
    Speed: ["9m"],
    Abilities: { Str: 12, Dex: 12, Con: 13, Int: 7, Wis: 10, Cha: 7 },
    Senses: ["Passive Wahrnehmung 10"],
    Languages: ["Gemeinsprache"],
    Challenge: "1/2",
    Traits: [{ Name: "Amphibie", Content: "Atmet Wasser und Luft" }],
    Actions: [{ Name: "Biss", Content: "1W4+1 Stich" }],
    ...overrides,
  };
}

describe("parseImprovedInitiative", () => {
  it("should_return_empty_bundle_when_root_is_not_an_object", () => {
    const result = parseImprovedInitiative(null);
    expect(result.monsters).toHaveLength(0);
    expect(result.players).toHaveLength(0);
    expect(result.encounters).toHaveLength(0);
  });

  it("should_map_creatures_to_custom_monsters_with_folder", () => {
    const root = { "Creatures.abc": statBlock() };
    const result = parseImprovedInitiative(root);
    expect(result.monsters).toHaveLength(1);
    const monster = result.monsters[0];
    expect(monster.name).toBe("Bullywug");
    expect(monster.source).toBe("custom");
    expect(monster.folder).toBe("Hexenlicht");
    expect(monster.maxHp).toBe(11);
    expect(monster.armorClass).toBe(15);
    expect(monster.strength).toBe(12);
    expect(monster.traits?.[0]).toEqual({
      name: "Amphibie",
      description: "Atmet Wasser und Luft",
    });
  });

  it("should_default_monster_folder_to_Eigene_when_path_missing", () => {
    const root = { "Creatures.abc": statBlock({ Path: "" }) };
    const result = parseImprovedInitiative(root);
    expect(result.monsters[0].folder).toBe("Eigene");
  });

  it("should_map_persistent_characters_to_character_sheets", () => {
    const root = {
      "PersistentCharacters.pc1": {
        Name: "Kael",
        Path: "Brudis",
        StatBlock: statBlock({ Name: "Kael", HP: { Value: 18 }, AC: { Value: 15 } }),
      },
    };
    const result = parseImprovedInitiative(root);
    expect(result.players).toHaveLength(1);
    const sheet = result.players[0];
    expect(sheet.name).toBe("Kael");
    expect(sheet.folder).toBe("Brudis");
    expect(sheet.maxHitpoints).toBe(18);
    expect(sheet.armorClass).toBe(15);
    expect(sheet.attributes.strength.value).toBe(12);
    expect(sheet.attacks[0].name).toBe("Biss");
  });

  it("should_map_saved_encounters_with_combatants_and_alias", () => {
    const root = {
      "SavedEncounters.Landhaus-Gallertzylinder": {
        Name: "Gallertzylinder",
        Path: "Landhaus",
        Id: "Landhaus-Gallertzylinder",
        Combatants: [
          { Alias: "Würfel", StatBlock: statBlock({ Name: "Gelatinous Cube" }) },
        ],
      },
    };
    const result = parseImprovedInitiative(root);
    expect(result.encounters).toHaveLength(1);
    const encounter = result.encounters[0];
    expect(encounter.name).toBe("Gallertzylinder");
    expect(encounter.folder).toBe("Landhaus");
    expect(encounter.combatants).toHaveLength(1);
    expect(encounter.combatants[0].name).toBe("Würfel");
  });

  it("should_ignore_malformed_entries", () => {
    const root = {
      "Creatures.bad": null,
      "PersistentCharacters.bad": { Name: "NoStatBlock" },
      "SavedEncounters.bad": { Name: "Empty", Combatants: [{}] },
      "ImprovedInitiative.Creatures": "ignored",
    };
    const result = parseImprovedInitiative(root);
    expect(result.monsters).toHaveLength(0);
    expect(result.players).toHaveLength(0);
    expect(result.encounters).toHaveLength(1);
    expect(result.encounters[0].combatants).toHaveLength(0);
  });
});