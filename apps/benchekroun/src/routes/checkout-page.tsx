import type { PublicOrder } from '@acme/api-client';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useCart } from '../cart/use-cart';
import { useBrandCopy } from '../i18n/use-brand-copy';
import { CheckoutCartSummary } from '../components/checkout/checkout-cart-summary';
import { GuestCheckoutForm } from '../components/checkout/guest-checkout-form';
import { OrderConfirmation } from '../components/checkout/order-confirmation';

export function CheckoutPage() {
  const { isCartEmpty, isHydrated, clearCartItems } = useCart();
  const navigate = useNavigate();
  const copy = useBrandCopy();
  const [confirmedOrder, setConfirmedOrder] = useState<PublicOrder | null>(null);

  const handleModalClose = () => {
    clearCartItems();
    navigate('/');
  };

  if (isHydrated && isCartEmpty && confirmedOrder === null) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      <main className="surface-light min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-ink">{copy.checkoutEyebrow}</p>
          <h1 className="font-display text-3xl font-semibold text-brand-ink">{copy.checkoutTitle}</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <CheckoutCartSummary />
          </div>

          <div className="rounded-[1.75rem] border border-brand-line bg-brand-charcoal p-6">
            <GuestCheckoutForm onSuccess={(order) => setConfirmedOrder(order)} />
          </div>
        </div>
        </div>
      </main>

      {confirmedOrder !== null && (
        <OrderConfirmation
          order={confirmedOrder}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
