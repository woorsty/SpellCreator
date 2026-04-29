import path from "path";
import { Model } from "../util/modelData";
import { Util } from "../util";

export class Spell extends Model {
  public static readonly JsonFilePath = path.join(
    __dirname,
    "../assets/spells.json",
  );
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
  Notizen?: string | null;
  [key: string]: any;

  public constructor(
    stufe: number,
    name: string,
    schule: string,
    zeitaufwand: string,
    reichweite: string,
    dauer: string,
    text: string,
    klasse: string[],
    konzentration?: boolean,
    ritual?: boolean,
    verbal?: boolean,
    gestik?: boolean,
    material?: string | null,
    notizen?: string | null,
    init?: Partial<Spell>,
  ) {
    super();
    this.Stufe = stufe;
    this.Name = name;
    this.Schule = schule;
    this.Zeitaufwand = zeitaufwand;
    this.Reichweite = reichweite;
    this.Dauer = dauer;
    this.Text = text;
    this.Klasse = klasse;
    this.Konzentration = konzentration;
    this.Ritual = ritual;
    this.Verbale = verbal;
    this.Gestik = gestik;
    this.Materialien = material;
    this.Notizen = notizen;
    Object.assign(this, init);
  }

  public static getTestSpell(): Spell {
    return new Spell(
      1,
      "Testzauber",
      "Evokation",
      "1 Aktion",
      "60 Fuß",
      "1 Minute",
      "Dies ist ein Testzauber, um die Anzeige zu überprüfen.",
      ["Zauberer"],
      false,
      true,
      false,
      true,
      "a feather, a small piece of fleece, and a drop of honey",
      "Durch Talent",
    );
  }
}
