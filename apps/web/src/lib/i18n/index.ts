import { es } from './es';

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type TranslationKey = Leaves<typeof es>;
export type TranslateParams = Record<string, string | number>;
export type Translate = (key: TranslationKey, params?: TranslateParams) => string;

function lookup(key: string): string {
  let node: unknown = es;
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : key;
}

/** Translates `key` in the active locale, replacing `{name}` placeholders. */
export const t: Translate = (key, params) =>
  lookup(key).replace(/\{(\w+)\}/g, (match, name: string) =>
    params && name in params ? String(params[name]) : match,
  );

/** Entry point for components; the locale will become reactive when a selector is added. */
export function useT(): Translate {
  return t;
}
