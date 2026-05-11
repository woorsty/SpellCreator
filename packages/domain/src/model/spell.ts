import { CharacterClassId } from "./character-class";
import { SpellSchool } from "./spell-school";

export type Spell = {
  level: number;
  name: string;
  school: SpellSchool;
  castingTime: string;
  range: string;
  concentration: boolean;
  duration: string;
  ritual: boolean;
  components: {
    gestic: boolean;
    verbal: boolean;
    material: string;
  };
  text: string;
  characterClasses: CharacterClassId[];
  higherLevel: string;
  notes: string;
};
