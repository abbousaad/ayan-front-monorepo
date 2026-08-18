export type LocaleCode = 'en' | 'fr' | 'ar';

/**
 * A translatable field as the API delivers it. Some backends return a plain
 * string (legacy), newer ones return an { en, fr, ar } map whose values may be
 * null when a translation is missing.
 */
export type LocalizedText = {
  en: string | null;
  fr: string | null;
  ar: string | null;
};

/** Normalise an API localized field (string | map | absent) into LocalizedText. */
export const toLocalizedText = (value: unknown): LocalizedText => {
  if (typeof value === 'string') {
    return { en: value, fr: null, ar: null };
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const pick = (key: LocaleCode) => (typeof record[key] === 'string' ? (record[key] as string) : null);
    return { en: pick('en'), fr: pick('fr'), ar: pick('ar') };
  }

  return { en: null, fr: null, ar: null };
};

/**
 * Resolve a localized value to one string for the given locale, falling back
 * through the fallback locale, then en → fr → ar, then ''.
 */
export const resolveLocalizedText = (
  value: LocalizedText | string | null | undefined,
  locale: LocaleCode,
  fallback: LocaleCode = 'en'
): string => {
  if (value == null) {
    return '';
  }

  const text = typeof value === 'string' ? toLocalizedText(value) : value;
  return text[locale] ?? text[fallback] ?? text.en ?? text.fr ?? text.ar ?? '';
};

/** True when a value is an acceptable localized input: a string or an {en,fr,ar}-ish object. */
export const isLocalizedInput = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return true;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return (['en', 'fr', 'ar'] as const).every(
      (key) => record[key] === undefined || record[key] === null || typeof record[key] === 'string'
    );
  }

  return false;
};
