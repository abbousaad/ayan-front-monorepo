import { brandColors } from '@acme/shared';
import { getDiscountAmount, getTotalWithPricing } from '@acme/cart';
import { useEffect, useState } from 'react';
import { FiShoppingBag, FiX } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';
import { usePricingConfig } from '../../hooks/use-pricing-config';
import { AuthChoiceModal } from '../checkout/auth-choice-modal';
import { CartLineItem } from './cart-line-item';

const formatPrice = (price: number, currencyCode = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(price);

export function CartSidebar() {
  const { clearCartItems, closeCart, isCartEmpty, isOpen, state, subtotal } = useCart();
  const { t } = useI18n();
  const { pricingConfig } = usePricingConfig();
  const currencyCode = state.items[0]?.currencyCode ?? 'USD';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const discountAmount = getDiscountAmount(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
  const total = getTotalWithPricing(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
  const formattedDiscount = discountAmount > 0
    ? `-${formatPrice(discountAmount, currencyCode)}`
    : formatPrice(0, currencyCode);

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

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-stone-950/35 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={closeCart}
      />

      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-[0_18px_45px_rgba(120,98,70,0.18)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--color-accent)' }}>{t('nav.cart')}</p>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-cart-title)' }}>Your selections</h2>
          </div>

          <button
            aria-label="Close cart"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
            onClick={closeCart}
            type="button"
          >
            <FiX aria-hidden="true" size={18} />
          </button>
        </div>

        {isCartEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-700">
              <FiShoppingBag aria-hidden="true" size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-stone-950">{t('cart.empty')}</h3>
              <p className="text-sm leading-6 text-stone-600">Add a few items and they will appear here with live totals.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {state.items.map((item) => (
                <CartLineItem key={item.productId} item={item} />
              ))}
            </div>

            <div className="border-t border-stone-200 px-5 py-5">
              <div className="space-y-4 rounded-[1.75rem] p-4" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-lg font-semibold text-stone-950">{formatPrice(subtotal, currencyCode)}</span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
                  <span>Discount</span>
                  <span className="text-sm font-semibold text-stone-950">{formattedDiscount}</span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="text-sm font-semibold text-stone-950">
                    {formatPrice(pricingConfig.deliveryFee, currencyCode)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
                  <span>Total</span>
                  <span className="text-lg font-semibold text-stone-950">{formatPrice(total, currencyCode)}</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    onClick={() => setShowAuthModal(true)}
                    style={{ backgroundColor: 'var(--color-checkout-button-bg)', color: '#ffffff' }}
                    type="button"
                  >
                    {t('cart.checkout')}
                  </button>

                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    onClick={clearCartItems}
                    type="button"
                  >
                    Clear cart
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {showAuthModal && (
        <AuthChoiceModal
          onClose={() => {
            setShowAuthModal(false);
            closeCart();
          }}
        />
      )}
    </>
  );
}
