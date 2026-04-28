import path from "path";
import { Model } from "../util/modelData";

export interface Spell extends Model {
  Stufe: number;
  Name: string;
  Schule: string;
  Zeitaufwand: string;
  Reichweite: string;
  Konzentration?: boolean;
  Dauer: string;
  Ritual?: boolean;
  Verbal?: boolean;
  Gestik?: boolean;
  Material?: string | null;
  Text: string;
  Klasse: string[];
  HöhereLevel?: string | null;
  [key: string]: any;
}

export const JsonFilePath = path.join(__dirname, "../../assets/spells.json");
