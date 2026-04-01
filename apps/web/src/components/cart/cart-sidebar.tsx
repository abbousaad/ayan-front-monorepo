import { brandColors } from '@acme/shared';
import { useEffect, useState } from 'react';
import { FiShoppingBag, FiX } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { AuthChoiceModal } from '../checkout/auth-choice-modal';
import { CartLineItem } from './cart-line-item';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);

export function CartSidebar() {
  const { clearCartItems, closeCart, isCartEmpty, isOpen, state, subtotal } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Cart</p>
            <h2 className="text-xl font-semibold text-stone-950">Your selections</h2>
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
              <h3 className="text-lg font-semibold text-stone-950">Your cart is empty</h3>
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
              <div className="space-y-4 rounded-[1.75rem] bg-[#fbf7f1] p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
                  <span>Subtotal</span>
                  <span className="text-lg font-semibold text-stone-950">{formatPrice(subtotal)}</span>
                </div>

                <p className="text-sm leading-6 text-stone-500">Delivery fee and final confirmation will be handled at checkout.</p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                    onClick={() => setShowAuthModal(true)}
                    style={{ backgroundColor: brandColors.logoGreen, color: brandColors.white }}
                    type="button"
                  >
                    Continue
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

      {showAuthModal && <AuthChoiceModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
