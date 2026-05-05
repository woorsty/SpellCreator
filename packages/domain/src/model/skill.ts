export class Skill {
  name = "";
  proficiency = false;
  modifier = 0;
  expertise = false;

  public constructor(
    name: string,
    proficiency: boolean,
    modifier: number,
    expertise: boolean,
  ) {
    this.name = name;
    this.proficiency = proficiency;
    this.modifier = modifier;
    this.expertise = expertise;
  }
}
