import type { PublicOrder } from '@acme/api-client';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useCart } from '../cart/use-cart';
import { CheckoutCartSummary } from '../components/checkout/checkout-cart-summary';
import { GuestCheckoutForm } from '../components/checkout/guest-checkout-form';
import { OrderConfirmation } from '../components/checkout/order-confirmation';

export function CheckoutPage() {
  const { isCartEmpty, isHydrated } = useCart();
  const [confirmedOrder, setConfirmedOrder] = useState<PublicOrder | null>(null);

  if (isHydrated && isCartEmpty && confirmedOrder === null) {
    return <Navigate replace to="/" />;
  }

  if (confirmedOrder !== null) {
    return (
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <OrderConfirmation order={confirmedOrder} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Checkout</p>
        <h1 className="text-2xl font-semibold text-stone-950">Complete your order</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <CheckoutCartSummary />
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <GuestCheckoutForm onSuccess={(order) => setConfirmedOrder(order)} />
        </div>
      </div>
    </main>
  );
}
