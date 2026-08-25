import { getDiscountAmount, getTotalWithPricing } from '@acme/cart';
import { useEffect } from 'react';
import { FiShoppingBag, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';
import { useBrandCopy } from '../../i18n/use-brand-copy';
import { formatPrice } from '../../lib/format';
import { usePricingConfig } from '../../hooks/use-pricing-config';
import { CartLineItem } from './cart-line-item';

export function CartDrawer() {
  const { clearCartItems, closeCart, isCartEmpty, isOpen, state, subtotal } = useCart();
  const { locale } = useI18n();
  const copy = useBrandCopy();
  const navigate = useNavigate();
  const { pricingConfig } = usePricingConfig();
  const currencyCode = state.items[0]?.currencyCode;
  const price = (amount: number, code = currencyCode) => formatPrice(amount, locale, code);
  const discountAmount = getDiscountAmount(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
  const total = getTotalWithPricing(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
  const formattedDiscount = discountAmount > 0 ? `-${price(discountAmount)}` : price(0);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const goToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[60] bg-encre/50 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeCart}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed end-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-s border-brume bg-papier shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-brume px-5 py-4">
          <div className="space-y-1">
            <p className="eyebrow">{copy.cartLabel}</p>
            <h2 className="font-display text-xl font-semibold uppercase text-encre">{copy.yourSelections}</h2>
          </div>

          <button
            aria-label={copy.close}
            className="inline-flex h-10 w-10 items-center justify-center border border-brume bg-blanc text-encre transition hover:border-encre focus:outline-none focus:ring-2 focus:ring-encre"
            onClick={closeCart}
            type="button"
          >
            <FiX aria-hidden="true" size={18} />
          </button>
        </div>

        {isCartEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blanc text-encre-45">
              <FiShoppingBag aria-hidden="true" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-encre">{copy.cartEmpty}</h3>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {state.items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>

            <div className="border-t border-brume px-5 py-5">
              <div className="space-y-3 border border-brume bg-blanc p-4">
                <Row label={copy.subtotal} value={price(subtotal)} />
                <Row label={copy.discount} value={formattedDiscount} />
                <Row label={copy.deliveryFee} value={price(pricingConfig.deliveryFee)} />
                <div className="my-1 h-px bg-brume" />
                <Row emphasize label={copy.total} value={price(total)} />

                <div className="flex flex-col gap-3 pt-1">
                  <button className="btn w-full justify-center" onClick={goToCheckout} type="button">
                    {copy.checkout}
                  </button>

                  <button
                    className="btn btn--ghost w-full justify-center"
                    onClick={clearCartItems}
                    type="button"
                  >
                    {copy.clearCart}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Row({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-encre-70">
      <span>{label}</span>
      <span className={emphasize ? 'text-lg font-semibold text-encre' : 'font-semibold text-encre'}>
        {value}
      </span>
    </div>
  );
}
