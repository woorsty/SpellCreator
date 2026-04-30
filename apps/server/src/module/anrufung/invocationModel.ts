import path from "path";
import type { Spell } from "@domain/model/spell";

export interface Invocation {
  Stufe: number;
  Name: string;
  Text: string;
  Zauber?: Spell | string;
  [key: string]: any;
}

export const JsonFilePath = path.resolve("../../data/invocation.json");
