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
      <div aria-hidden="true" className="fixed inset-0 z-[80] bg-encre/60" onClick={onClose} />

      <div
        aria-modal="true"
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        role="dialog"
      >
        <div className="relative w-full max-w-md space-y-6 border border-brume bg-papier p-8 text-center shadow-2xl">
          <button
            aria-label={copy.close}
            className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-brume text-encre-45 transition hover:text-encre focus:outline-none focus:ring-2 focus:ring-encre"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" size={16} />
          </button>

          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-brume bg-blanc text-encre">
            <FiCheckCircle aria-hidden="true" size={40} />
          </div>

          <div className="space-y-2">
            <p className="eyebrow">{copy.orderConfirmed}</p>
            <h2 className="font-display text-3xl font-semibold uppercase text-encre">
              {interpolateCopy(copy.thankYou, { name: order.guestName })}
            </h2>
            <p className="text-sm text-encre-70">{copy.orderReceived}</p>
          </div>

          <div className="space-y-3 border border-brume bg-blanc p-6 text-start">
            <dl className="space-y-3 text-sm">
              <Row label={copy.orderId} value={<span className="break-all text-end font-data">{order.id}</span>} />
              <Row label={copy.status} value={<span className="capitalize">{order.status}</span>} />
              <Row label={copy.delivery} value={copy.instantDelivery} />
              {order.guestAddress && <Row label={copy.address} value={<span className="text-end">{order.guestAddress}</span>} />}
              {total !== undefined && (
                <div className="flex justify-between gap-4 border-t border-brume pt-3">
                  <dt className="text-encre-70">{copy.total}</dt>
                  <dd className="text-lg font-semibold text-encre">{formatPrice(total, locale)}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link className="btn justify-center" to="/shop">
              {copy.continueShopping}
            </Link>
            <button className="btn btn--ghost justify-center" onClick={onClose} type="button">
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
      <dt className="text-encre-70">{label}</dt>
      <dd className="font-semibold text-encre">{value}</dd>
    </div>
  );
}
