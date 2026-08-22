import { formatCurrency } from '@acme/shared';
import type { Locale } from '@acme/shared';

import { CURRENCY_CODE } from '../config';

// MAD gets a locale-specific label instead of the default Intl symbol (د.م.‏).
const MAD_LABEL: Record<Locale, string> = { ar: 'دِرْهَم', fr: 'DH', en: 'MAD' };

const formatMad = (amount: number, locale: Locale): string => {
  // Drop the currency symbol and the literal parts (spacing / RTL marks) Intl
  // puts around it; keep only the numeric parts (integer, group, decimal, …).
  const number = new Intl.NumberFormat(locale, { style: 'currency', currency: 'MAD' })
    .formatToParts(amount)
    .filter((part) => part.type !== 'currency' && part.type !== 'literal')
    .map((part) => part.value)
    .join('')
    .trim();
  return `${number} ${MAD_LABEL[locale] ?? 'MAD'}`;
};

/**
 * Locale-aware price formatting. Defaults to the site currency (MAD) but honours
 * an explicit product `currencyCode` when one is present. MAD renders with a
 * localized label — دِرْهَم (AR), DH (FR) — rather than the default Intl symbol.
 */
export const formatPrice = (
  amount: number,
  locale: Locale,
  currencyCode: string = CURRENCY_CODE
): string => {
  const code = currencyCode || CURRENCY_CODE;
  return code === 'MAD' ? formatMad(amount, locale) : formatCurrency(amount, code, locale);
};
