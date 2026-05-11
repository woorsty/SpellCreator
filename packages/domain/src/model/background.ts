import { AllSkills, Attribute } from "./skill";

export type Background = {
  id: string;
  attributes: Attribute[];
  talent: string;
  skillProficiencies: AllSkills[];
  toolProficiencies: [];
  equipment: [];
};
