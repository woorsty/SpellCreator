import {
  Attribute,
  ATTRIBUTE_SKILLS,
  AttributeViewModel,
  CharacterAttributes,
  CharacterSheet,
  SkillOf,
  SkillViewModel,
} from "../model";

export class AttributeService {
  public static calculateModifier(value: number): number {
    return Math.floor((value - 10) / 2);
  }

  public static calculateSkillModifier(
    attibuteValue: number,
    proficiency: boolean,
    expertiese: boolean,
    proficiencyBonus: number,
  ) {
    const modifier = this.calculateModifier(attibuteValue);
    let bonus = 0;

    if (proficiency) {
      bonus += proficiencyBonus;
    }
    if (expertiese) {
      bonus += proficiencyBonus;
    }

    return modifier + bonus;
  }

  public static calculateSavingThrow(
    modifier: number,
    proficiency: boolean,
    proficiencyBonus: number,
  ): number {
    return modifier + (proficiency ? proficiencyBonus : 0);
  }

  public static formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  public static getAttributeViewModel(
    character: CharacterSheet,
    attributeName: keyof CharacterAttributes,
  ): AttributeViewModel {
    const attribute = character.attributes[attributeName];

    const modifier = AttributeService.calculateModifier(attribute.value);
    const savingThrow = AttributeService.calculateSavingThrow(
      modifier,
      attribute.proficiency,
      character.proficiencyBonus,
    );

    return {
      name: attributeName,
      ...attribute,
      modifier,
      savingThrow,
    };
  }

  public static getSkillViewModel<A extends Attribute>(
    character: CharacterSheet,
    attributeName: A,
    skillName: SkillOf<A>,
  ): SkillViewModel<A> {
    const skill = character.skills[attributeName][skillName];
    const modifier = AttributeService.calculateSkillModifier(
      character.attributes[attributeName].value,
      skill.proficiency,
      skill.expertise,
      character.proficiencyBonus,
    );

    return {
      name: skillName,
      attributeName,
      value: character.attributes[attributeName].value,
      proficiency: skill.proficiency,
      expertiese: skill.expertise,
      modifier,
    };
  }
}
