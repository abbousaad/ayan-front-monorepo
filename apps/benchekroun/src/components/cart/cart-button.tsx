import { FiShoppingBag } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';

export function CartButton() {
  const { cartCount, openCart } = useCart();
  const { t } = useI18n();

  return (
    <button
      aria-label={`${t('nav.cart')} (${cartCount})`}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-brand-line bg-brand-charcoal px-4 text-brand-ink transition hover:border-brand-gold-dim hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black"
      onClick={openCart}
      type="button"
    >
      <FiShoppingBag aria-hidden="true" size={18} />
      {cartCount > 0 && (
        <span className="absolute -end-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[11px] font-bold text-brand-black">
          {cartCount}
        </span>
      )}
    </button>
  );
}
