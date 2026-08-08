import { formatCurrency } from '@acme/shared';
import type { Locale } from '@acme/shared';

import { CURRENCY_CODE } from '../config';

/**
 * Locale-aware MAD price formatting. Defaults to the site currency (MAD) but
 * honours an explicit product `currencyCode` when one is present.
 */
export const formatPrice = (
  amount: number,
  locale: Locale,
  currencyCode: string = CURRENCY_CODE
): string => formatCurrency(amount, currencyCode || CURRENCY_CODE, locale);
