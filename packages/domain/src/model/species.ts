export enum AllSpecies {
  HUMAN = "human",
  ELF = "elf",
  DWARF = "dwarf",
  HALFLING = "halfling",
  GNOME = "gnome",
  TIEFLING = "tiefling",
  DRAGONBORN = "dragonborn",
  GOLIATH = "goliath",
  ORC = "orc",
  AASIMAR = "aasimar",
  HARENGON = "harengon",
  FAIRY = "fairy",
}

export enum CreatureType {
  HUMANOID = "humanoid",
}

export enum CreatureSize {
  SMALL = "small",
  MEDIUM = "medium",
}

export type SpeciesFeature = {
  id: string;
  notes?: string;
};

export type Species = {
  id: AllSpecies;
  creature_type: CreatureType;
  speed: number;
  size: CreatureSize[];
  feats: SpeciesFeature[];
};

export const SPECIES: { [S in AllSpecies]: Species } = {
  aasimar: {
    id: AllSpecies.AASIMAR,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM, CreatureSize.SMALL],
    speed: 9,
    feats: [
      { id: "celestial_resistance" },
      { id: "darkvision" },
      { id: "healing_hands" },
      { id: "light_bearer" },
      { id: "celestial_revelation" },
    ],
  },
  dragonborn: {
    id: AllSpecies.DRAGONBORN,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [
      { id: "breath_weapon" },
      { id: "damage_resistance" },
      { id: "darkvision" },
      { id: "draconic_flight" },
    ],
  },
  dwarf: {
    id: AllSpecies.DWARF,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [
      { id: "darkvision" },
      { id: "dwarven_resilience" },
      { id: "dwarven_toughness" },
      { id: "stonecunning" },
    ],
  },
  elf: {
    id: AllSpecies.ELF,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [
      { id: "darkvision" },
      { id: "elven_lineage" },
      { id: "fey_ancestry" },
      { id: "keen_senses" },
      { id: "trance" },
    ],
  },
  fairy: {
    id: AllSpecies.FAIRY,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [],
  },
  gnome: {
    id: AllSpecies.GNOME,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.SMALL],
    speed: 9,
    feats: [{ id: "forest_gnome" }, { id: "rock_gnome" }],
  },
  goliath: {
    id: AllSpecies.GOLIATH,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [
      { id: "giant_ancestry" },
      { id: "large_form" },
      { id: "powerful_build" },
    ],
  },
  halfling: {
    id: AllSpecies.HALFLING,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.SMALL],
    speed: 9,
    feats: [
      { id: "brave" },
      { id: "halfling_nimbless" },
      { id: "luck" },
      { id: "naturally_stealthy" },
    ],
  },
  harengon: {
    id: AllSpecies.HARENGON,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [],
  },
  human: {
    id: AllSpecies.HUMAN,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM, CreatureSize.SMALL],
    speed: 9,
    feats: [{ id: "resourceful" }, { id: "skillful" }, { id: "versatile" }],
  },
  orc: {
    id: AllSpecies.ORC,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM],
    speed: 9,
    feats: [
      { id: "adrenaline_rush" },
      { id: "darkvision" },
      { id: "relentless_endurance" },
    ],
  },
  tiefling: {
    id: AllSpecies.TIEFLING,
    creature_type: CreatureType.HUMANOID,
    size: [CreatureSize.MEDIUM, CreatureSize.SMALL],
    speed: 9,
    feats: [
      { id: "darkvision" },
      { id: "flendish_legacy" },
      { id: "otherworldly_presence" },
    ],
  },
} as const;
