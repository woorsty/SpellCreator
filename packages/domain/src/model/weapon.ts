import { Attack } from "./attack";

export type Weapon = Attack & {
  name: string;
};
