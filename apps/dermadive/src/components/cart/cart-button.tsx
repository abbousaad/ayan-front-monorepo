import { FiShoppingBag } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useBrandCopy } from '../../i18n/use-brand-copy';

export function CartButton() {
  const { cartCount, openCart } = useCart();
  const copy = useBrandCopy();

  return (
    <button
      aria-label={`${copy.cartLabel} (${cartCount})`}
      className="relative inline-flex h-10 w-10 items-center justify-center border border-brume bg-blanc text-encre transition hover:border-encre focus:outline-none focus:ring-2 focus:ring-encre focus:ring-offset-2 focus:ring-offset-papier"
      onClick={openCart}
      type="button"
    >
      <FiShoppingBag aria-hidden="true" size={17} />
      {cartCount > 0 && (
        <span className="absolute -end-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-encre px-1 font-data text-[10px] font-semibold text-blanc">
          {cartCount}
        </span>
      )}
    </button>
  );
}
