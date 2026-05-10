import { CharacterClass, Spell } from "../model";
import { SpellSchool } from "../model/spell-school";

export class SpellService {
  public static getTestSpell(): Spell {
    return {
      castingTime: "Aktion",
      characterClasses: [CharacterClass.SORCERER],
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
    };
  }
}
