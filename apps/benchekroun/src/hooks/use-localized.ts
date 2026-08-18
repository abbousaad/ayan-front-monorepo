import { resolveLocalizedText } from '@acme/api-client';
import type { LocalizedText } from '@acme/api-client';

import { useI18n } from '../contexts/i18n-context';

/**
 * Returns a resolver bound to the active locale. Pass an API `*Localized` map
 * and a flat fallback (the resolved `name`/`description`); the fallback covers
 * older API responses that predate the { en, fr, ar } shape.
 */
export function useLocalized() {
  const { locale } = useI18n();
  return (value: LocalizedText | undefined, fallback = ''): string =>
    resolveLocalizedText(value, locale) || fallback;
}
