import { Attribute, CharacterSheet, SkillOf, SkillValues } from "../model";

export class AttributeService {
  public static calculateModifier(value: number): number {
    return Math.floor((value - 10) / 2);
  }

  public static calculateSkillModifierFromCharacter<
    A extends Attribute,
    S extends SkillOf<A>,
  >(character: CharacterSheet, attribute: A, skill: S) {
    const attr = character.attributes[attribute];
    const skillData = attr.skills[skill];

    return AttributeService.calculateSkillModifier(
      attr.value,
      skillData.proficiency,
      skillData.expertise,
      character.proficiencyBonus,
    );
  }

  public static getSkillData<A extends Attribute, S extends SkillOf<A>>(
    character: CharacterSheet,
    attribute: A,
    skill: S,
  ) {
    return character.attributes[attribute].skills[skill];
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

  public static getSkillViewModel<A extends Attribute>(
    character: CharacterSheet,
    attributeName: A,
    skillName: SkillOf<A>,
  ): SkillValues & {
    name: string;
    value: number;
    modifier: number;
  } {
    const skill = character.attributes[attributeName].skills[skillName];
    const modifier = AttributeService.calculateSkillModifier(
      character.attributes[attributeName].value,
      skill.proficiency,
      skill.expertise,
      character.proficiencyBonus,
    );

    return {
      name: skillName,
      value: character.attributes[attributeName].value,
      proficiency: skill.proficiency,
      expertise: skill.expertise,
      modifier,
    };
  }
}
