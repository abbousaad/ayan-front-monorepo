import type { PublicOrder } from '@acme/api-client';
import { useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useCart } from '../../cart/use-cart';

type OrderConfirmationProps = {
  order: PublicOrder;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const { clearCartItems } = useCart();

  useEffect(() => {
    clearCartItems();
  }, [clearCartItems]);

  const total = order.grandTotal ?? order.totalAmount;
  const deliveryLabel = order.deliveryMode === 'instant' ? 'Instant delivery' : 'Scheduled delivery';

  return (
    <div className="mx-auto max-w-md space-y-6 py-12 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <FiCheckCircle aria-hidden="true" size={40} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Order confirmed</p>
        <h1 className="text-2xl font-semibold text-stone-950">Thank you, {order.guestName}!</h1>
        <p className="text-sm text-stone-500">
          Your order has been received and is being processed.
        </p>
      </div>

      <div className="rounded-[2rem] border border-stone-200 bg-[#fbf7f1] p-6 text-left space-y-3">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Order ID</dt>
            <dd className="font-mono font-medium text-stone-950 break-all text-right">{order.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Status</dt>
            <dd className="font-semibold text-stone-950 capitalize">{order.status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Delivery</dt>
            <dd className="font-semibold text-stone-950">{deliveryLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Address</dt>
            <dd className="font-semibold text-stone-950 text-right">{order.guestAddress}</dd>
          </div>
          {total !== undefined && (
            <div className="flex justify-between gap-4 border-t border-stone-200 pt-3">
              <dt className="text-stone-500">Total</dt>
              <dd className="text-lg font-semibold text-stone-950">{formatPrice(total)}</dd>
            </div>
          )}
        </dl>
      </div>

      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
        to="/"
      >
        Back to shopping
      </Link>
    </div>
  );
}
