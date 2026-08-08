import { useI18n } from '../contexts/i18n-context';
import { getBrandCopy, type BrandCopy } from './brand-copy';

/** Locale-aware bespoke brand copy for دار بنشقرون. */
export const useBrandCopy = (): BrandCopy => {
  const { locale } = useI18n();
  return getBrandCopy(locale);
};
