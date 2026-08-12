import type { PublicOrder } from '@acme/api-client';
import { useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useI18n } from '../../contexts/i18n-context';
import { useBrandCopy } from '../../i18n/use-brand-copy';
import { interpolateCopy } from '../../i18n/brand-copy';
import { formatPrice } from '../../lib/format';

type OrderConfirmationProps = {
  order: PublicOrder;
  onClose: () => void;
};

export function OrderConfirmation({ order, onClose }: OrderConfirmationProps) {
  const { locale } = useI18n();
  const copy = useBrandCopy();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const total = order.grandTotal ?? order.totalAmount;

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/70"
        onClick={onClose}
      />

      <div
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
      >
        <div className="surface-light relative w-full max-w-md space-y-6 rounded-[2rem] border border-brand-line bg-brand-charcoal p-8 text-center shadow-2xl">
          <button
            aria-label="Fermer"
            className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-brand-muted transition hover:text-gold-ink focus:outline-none focus:ring-2 focus:ring-brand-gold"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" size={16} />
          </button>

          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-brand-gold-dim bg-brand-charcoal text-gold-ink">
            <FiCheckCircle aria-hidden="true" size={40} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-ink">{copy.orderConfirmed}</p>
            <h2 className="font-display text-3xl font-semibold text-brand-ink">
              {interpolateCopy(copy.thankYou, { name: order.guestName })}
            </h2>
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
                  <dd className="text-lg font-semibold text-gold-ink">{formatPrice(total, locale)}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              to="/shop"
            >
              {copy.continueShopping}
            </Link>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-line px-6 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-gold-dim hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
              onClick={onClose}
              type="button"
            >
              {copy.backToHome}
            </button>
          </div>
        </div>
      </div>
    </>
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
