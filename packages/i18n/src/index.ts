import { de } from "./locales/de";
import type { DeepKeys } from "./types";

export type TranslationKeys = DeepKeys<typeof de>;
export type Locale = "de";

const locales = {
  de,
};

let current = "de" as keyof typeof locales;

export function setLocale(locale: Locale) {
  current = locale;
}

export function translate(key: TranslationKeys | string): string {
  const dict = locales[current];

  if (!key) {
    return "Key is undefined";
  }

  const result = key.split(".").reduce<any>((obj, k) => obj?.[k], dict) ?? key;
  console.log("key: ", key, "result", result);
  if (typeof result != "string") {
    return key + " returns " + typeof result;
  }
  return result;
}

export class Translator {
  private basePath: string;

  public constructor(basePath = "") {
    this.basePath = basePath;
  }

  public translate(key: TranslationKeys | string): string {
    const dict = locales[current];
    if (key.startsWith(".")) {
      key = this.basePath + key;
    }

    if (!key) {
      return "Key is undefined";
    }

    const result =
      key.split(".").reduce<any>((obj, k) => obj?.[k], dict) ?? key;
    console.log("key: ", key, "result", result);
    if (typeof result != "string") {
      return key + " returns " + typeof result;
    }
    return result;
  }
}
