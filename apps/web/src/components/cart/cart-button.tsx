import { brandColors } from '@acme/shared';
import { FiShoppingBag } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';

export function CartButton() {
  const { cartCount, openCart } = useCart();
  const { t } = useI18n();

  return (
    <button
      aria-label={`${t('nav.cart')} (${cartCount})`}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-stone-950 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
      onClick={openCart}
      type="button"
    >
      <FiShoppingBag aria-hidden="true" size={18} />
      <span className="ms-2 hidden text-sm font-semibold sm:inline">{t('nav.cart')}</span>
      {cartCount > 0 && (
        <span
          className="absolute -end-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold"
          style={{ backgroundColor: 'var(--color-sec-button-bg)', color: '#ffffff' }}
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}
