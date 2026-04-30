export class Skill {
  name = "";
  proficiency = false;
  modifier = 0;
  expertise = false;

  public constructor(init?: Partial<Skill>) {
    Object.assign(this, init);
  }
}
