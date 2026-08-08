import type { PublicOrder } from '@acme/api-client';
import { useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';
import { useBrandCopy } from '../../i18n/use-brand-copy';
import { interpolateCopy } from '../../i18n/brand-copy';
import { formatPrice } from '../../lib/format';

type OrderConfirmationProps = {
  order: PublicOrder;
};

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const { clearCartItems } = useCart();
  const { locale } = useI18n();
  const copy = useBrandCopy();

  useEffect(() => {
    clearCartItems();
  }, [clearCartItems]);

  const total = order.grandTotal ?? order.totalAmount;

  return (
    <div className="mx-auto max-w-md space-y-6 py-12 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-brand-gold-dim bg-brand-charcoal text-brand-gold">
        <FiCheckCircle aria-hidden="true" size={40} />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{copy.orderConfirmed}</p>
        <h1 className="font-display text-3xl font-semibold text-brand-ink">
          {interpolateCopy(copy.thankYou, { name: order.guestName })}
        </h1>
        <p className="text-sm text-brand-muted">{copy.orderReceived}</p>
      </div>

      <div className="space-y-3 rounded-[1.75rem] border border-brand-line bg-brand-charcoal p-6 text-start">
        <dl className="space-y-3 text-sm">
          <Row label={copy.orderId} value={<span className="font-mono break-all text-end">{order.id}</span>} />
          <Row label={copy.status} value={<span className="capitalize">{order.status}</span>} />
          <Row label={copy.delivery} value={copy.instantDelivery} />
          {order.guestAddress && <Row label={copy.address} value={<span className="text-end">{order.guestAddress}</span>} />}
          {total !== undefined && (
            <div className="flex justify-between gap-4 border-t border-brand-line pt-3">
              <dt className="text-brand-muted">{copy.total}</dt>
              <dd className="text-lg font-semibold text-brand-gold">{formatPrice(total, locale)}</dd>
            </div>
          )}
        </dl>
      </div>

      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-line px-5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-gold-dim hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
        to="/"
      >
        {copy.backToHome}
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-brand-muted">{label}</dt>
      <dd className="font-semibold text-brand-ink">{value}</dd>
    </div>
  );
}
