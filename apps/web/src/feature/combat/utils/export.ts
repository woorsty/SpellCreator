import type { Combatant, Encounter } from "@repo/domain";

function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function sanitize(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, "_").toLowerCase() || "export";
}

export function exportEncounter(encounter: Encounter): void {
  downloadJson(`encounter-${sanitize(encounter.name)}.json`, encounter);
}

export function exportEncounters(encounters: Encounter[]): void {
  downloadJson("encounters.json", encounters);
}

export function exportMonster(monster: Combatant): void {
  downloadJson(`monster-${sanitize(monster.name)}.json`, monster);
}

export function exportMonsters(monsters: Combatant[]): void {
  downloadJson("monsters.json", monsters);
}