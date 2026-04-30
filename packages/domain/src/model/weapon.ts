export class Weapon {
  name: string = "";
  attackBonus: number = 0;
  difficultyBonus: number = 0;
  damage: string = "";
  damageType: string = "";
  notes: string = "";

  public constructor(init?: Partial<Weapon>) {
    Object.assign(this, init);
  }
}
