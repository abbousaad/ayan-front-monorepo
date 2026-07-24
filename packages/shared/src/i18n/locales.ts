export type Locale = 'en' | 'fr' | 'ar';

export type TextDirection = 'ltr' | 'rtl';

export type LocaleMeta = {
  code: Locale;
  label: string;
  nativeName: string;
  dir: TextDirection;
};

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALES: readonly LocaleMeta[] = [
  { code: 'en', label: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'fr', label: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', dir: 'rtl' }
];

export const LOCALE_CODES: readonly Locale[] = LOCALES.map((locale) => locale.code);

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && LOCALE_CODES.includes(value as Locale);

export const getLocaleMeta = (code: Locale): LocaleMeta =>
  LOCALES.find((locale) => locale.code === code) ?? LOCALES[0];

export const getDirection = (code: Locale): TextDirection => getLocaleMeta(code).dir;
