import path from "path";
import { Spell } from "../spell/spellModel";
import { Mode } from "fs";
import { Model as Model } from "../util/modelData";

export interface Invocation extends Model {
  Stufe: number;
  Name: string;
  Text: string;
  Zauber?: Spell | string;
  [key: string]: any;
}

export const JsonFilePath = path.join(
  __dirname,
  "../../assets/invocation.json"
);
