export class AttributeService {
  public static calculateModifier(value: number): number {
    return Math.floor((value - 10) / 2);
  }

  public static calculateSavingThrow(
    modifier: number,
    proficiency: boolean,
    proficiencyBonus = 2,
  ): number {
    return modifier + (proficiency ? proficiencyBonus : 0);
  }

  public static formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}
