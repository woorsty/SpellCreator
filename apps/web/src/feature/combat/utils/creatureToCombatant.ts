import type { CharacterSheet, Combatant, Skill } from "@repo/domain";

export function characterSheetToCombatant(
  sheet: CharacterSheet,
  isPlayer = false,
): Omit<Combatant, "turnOrder"> {
  const skills: Skill[] = [];
  for (const attribute of Object.keys(
    sheet.attributes,
  ) as (keyof typeof sheet.attributes)[]) {
    const attr = sheet.attributes[attribute];
    const skillMap = attr.skills as Record<string, { modifier?: number }>;
    for (const skillName of Object.keys(skillMap)) {
      const skillData = skillMap[skillName];
      if (skillData.modifier == null) continue;
      skills.push({
        name: skillName,
        bonus: skillData.modifier,
      });
    }
  }

  return {
    id: crypto?.randomUUID?.() ?? `c-${Date.now()}`,
    name: sheet.name,
    type: isPlayer ? "player" : "npc",
    initiative: sheet.initiative,
    initiativeBonus: 0,
    hp: sheet.currentHitpoints,
    maxHp: sheet.maxHitpoints,
    tempHp: sheet.temporaryHitpoints,
    armorClass: sheet.armorClass,
    conditions: [],
    isDead: false,
    isConcentrating: false,
    source: "custom",
    description: sheet.story || sheet.appearance || undefined,
    strength: sheet.attributes.strength.value,
    dexterity: sheet.attributes.dexterity.value,
    constitution: sheet.attributes.constitution.value,
    intelligence: sheet.attributes.intelligence.value,
    wisdom: sheet.attributes.wisdom.value,
    charisma: sheet.attributes.charisma.value,
    savingThrowStrength: sheet.attributes.strength.savingThrow,
    savingThrowDexterity: sheet.attributes.dexterity.savingThrow,
    savingThrowConstitution: sheet.attributes.constitution.savingThrow,
    savingThrowIntelligence: sheet.attributes.intelligence.savingThrow,
    savingThrowWisdom: sheet.attributes.wisdom.savingThrow,
    savingThrowCharisma: sheet.attributes.charisma.savingThrow,
    skills,
    senses: [],
    languages: sheet.languages,
    actions: sheet.attacks.map((attack) => ({
      name: attack.name,
      description: attack.notes
        ? `${attack.damage} · ${attack.notes}`
        : attack.damage,
    })),
    bonusActions: [],
    legendaryActions: [],
    mythicActions: [],
  };
}
