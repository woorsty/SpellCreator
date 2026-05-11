import { CharacterClassId, Spell } from "../model";
import { SpellSchool } from "../model/spell-school";

export class SpellService {
  public static getLinkToSpell(spell: Spell) {
    return `http://localhost:3000/spell/${spell.name}`;
  }

  public static getNewSpell(): Spell {
    return {
      castingTime: "",
      higherLevel: "",
      notes: "",
      characterClasses: [],
      components: {
        gestic: false,
        verbal: false,
        material: "",
      },
      concentration: false,
      duration: "",
      level: 0,
      name: "",
      range: "",
      ritual: false,
      school: SpellSchool.ABJURATION,
      text: "",
    };
  }

  public static getTestSpell(): Spell {
    return {
      castingTime: "Aktion",
      characterClasses: [CharacterClassId.SORCERER],
      components: {
        gestic: true,
        verbal: true,
        material: "",
      },
      concentration: false,
      duration: "1 Minute",
      level: 1,
      name: "Testzauber",
      range: "60 Fuß",
      ritual: true,
      school: SpellSchool.ABJURATION,
      text: "Geiler super Zauber macht zeugs",
      higherLevel: "",
      notes: "",
    };
  }
}
