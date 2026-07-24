export type { DemoCategory, DemoRecord } from './types/demo';
export { DEMO_CATEGORIES, demoRecords } from './demo/demo-data';
export { brandColors } from './theme/colors';
export type { BrandColorName } from './theme/colors';
export { formatDemoValue } from './utils/format-demo-value';

// ── i18n ──────────────────────────────────────────────────────────────────────
export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CODES,
  isLocale,
  getLocaleMeta,
  getDirection
} from './i18n/locales';
export type { Locale, LocaleMeta, TextDirection } from './i18n/locales';
export { enBaseline } from './i18n/baseline';
export type { TranslationKey } from './i18n/baseline';
export { translate, formatCurrency, formatNumber } from './i18n/translate';
export type { TranslationBundle, TranslateParams } from './i18n/translate';
