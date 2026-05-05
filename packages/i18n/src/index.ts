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

  return key.split(".").reduce<any>((obj, k) => obj?.[k], dict) ?? key;
}
