import { enBaseline, type TranslationKey } from './baseline';
import type { Locale } from './locales';

export type TranslationBundle = Partial<Record<TranslationKey, string>> & Record<string, string>;

export type TranslateParams = Record<string, string | number>;

const interpolate = (template: string, params?: TranslateParams): string => {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
};

/**
 * Resolve a translation key against a server bundle, falling back to the
 * English baseline (and finally the key itself) so the UI always renders.
 * Supports `{param}` interpolation.
 */
export const translate = (
  bundle: TranslationBundle | undefined,
  key: TranslationKey,
  params?: TranslateParams
): string => {
  const template = bundle?.[key] ?? enBaseline[key] ?? key;
  return interpolate(template, params);
};

/** Locale-aware currency formatting built on `Intl.NumberFormat`. */
export const formatCurrency = (amount: number, currencyCode: string, locale: Locale): string => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
};

/** Locale-aware number formatting built on `Intl.NumberFormat`. */
export const formatNumber = (
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
};
