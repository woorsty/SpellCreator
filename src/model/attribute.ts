import { Skill } from "./skill";

export class Attribute extends Skill {
  value = 0;
  savingThrow = 0;

  public constructor(init?: Partial<Attribute>) {
    super(init);
    Object.assign(this, init);
  }
}
