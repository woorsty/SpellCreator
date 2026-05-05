import { Skill } from "./skill";

export class Attribute extends Skill {
  value = 0;
  savingThrow = 0;
  skills: Skill[] = [];

  public constructor(
    name: string,
    proficiency: boolean,
    modifier: number,
    expertise: boolean,
    value: number,
    savingThrow: number,
    skills: Skill[],
  ) {
    super(name, proficiency, modifier, expertise);
    this.value = value;
    this.savingThrow = savingThrow;
    this.skills = skills;
  }
}
