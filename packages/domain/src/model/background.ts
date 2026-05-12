import { OriginFeat } from "./feat";
import { AllSkills, Attribute } from "./skill";

export type Background = {
  id: string;
  attributes: Attribute[];
  feat: OriginFeat;
  skillProficiencies: AllSkills[];
  toolProficiencies: [];
  equipment: [];
};
