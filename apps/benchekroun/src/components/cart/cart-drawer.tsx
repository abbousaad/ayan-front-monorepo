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
  const { t, locale } = useI18n();
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
        className={`fixed inset-0 z-40 bg-black/60 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeCart}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed end-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-s border-brand-line bg-brand-charcoal shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{t('nav.cart')}</p>
            <h2 className="font-display text-xl font-semibold text-brand-ink">{copy.yourSelections}</h2>
          </div>

          <button
            aria-label={t('common.close')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-brand-panel text-brand-ink transition hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
            onClick={closeCart}
            type="button"
          >
            <FiX aria-hidden="true" size={18} />
          </button>
        </div>

        {isCartEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-panel text-brand-gold">
              <FiShoppingBag aria-hidden="true" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-brand-ink">{copy.cartEmpty}</h3>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {state.items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>

            <div className="border-t border-brand-line px-5 py-5">
              <div className="space-y-3 rounded-[1.5rem] bg-brand-panel p-4">
                <Row label={copy.subtotal} value={price(subtotal)} />
                <Row label={copy.discount} value={formattedDiscount} />
                <Row label={copy.deliveryFee} value={price(pricingConfig.deliveryFee)} />
                <div className="gold-rule my-1" />
                <Row emphasize label={copy.total} value={price(total)} />

                <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand-burgundy px-5 py-3 text-sm font-semibold text-brand-ivory transition hover:bg-brand-burgundy-soft focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal"
                    onClick={goToCheckout}
                    type="button"
                  >
                    {t('cart.checkout')}
                  </button>

                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-line px-5 py-3 text-sm font-semibold text-brand-muted transition hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-gold"
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
    <div className="flex items-center justify-between gap-3 text-sm text-brand-muted">
      <span>{label}</span>
      <span className={emphasize ? 'text-lg font-semibold text-brand-gold' : 'font-semibold text-brand-ink'}>
        {value}
      </span>
    </div>
  );
}
