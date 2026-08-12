import { createImageUrl } from '@acme/api-client';
import { getDiscountAmount, getTotalWithPricing } from '@acme/cart';
import { FiTrash2 } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';
import { useBrandCopy } from '../../i18n/use-brand-copy';
import { formatPrice } from '../../lib/format';
import { usePricingConfig } from '../../hooks/use-pricing-config';
import { QuantityControl } from '../cart/quantity-control';

export function CheckoutCartSummary() {
  const {
    decrementCartItem,
    incrementCartItem,
    removeCartItem,
    setCartItemQuantity,
    state,
    subtotal
  } = useCart();
  const { locale } = useI18n();
  const copy = useBrandCopy();
  const currencyCode = state.items[0]?.currencyCode;
  const price = (amount: number, code = currencyCode) => formatPrice(amount, locale, code);
  const { pricingConfig } = usePricingConfig();
  const discountAmount = getDiscountAmount(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
  const total = getTotalWithPricing(subtotal, pricingConfig.deliveryFee, pricingConfig.discountRate);
  const formattedDiscount = discountAmount > 0 ? `-${price(discountAmount)}` : price(0);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-brand-ink">{copy.yourOrder}</h2>

      <div className="space-y-3">
        {state.items.map((item) => {
          const lineTotal = item.price * item.quantity;

          return (
            <article key={item.productId} className="flex gap-3 rounded-[1.25rem] border border-brand-line bg-brand-charcoal p-3">
              <img
                alt={item.name}
                className="h-20 w-20 rounded-[0.9rem] object-cover"
                src={createImageUrl(item.imageUrl ?? '')}
              />

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-brand-ink">{item.name}</h3>
                    <p className="mt-1 text-xs text-brand-muted">
                      {price(item.price, item.currencyCode)}
                      {item.unit ? <span> / {item.unit}</span> : null}
                    </p>
                  </div>

                  <button
                    aria-label={`✕ ${item.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-muted transition hover:bg-brand-panel hover:text-gold-ink focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    onClick={() => removeCartItem(item.productId)}
                    type="button"
                  >
                    <FiTrash2 aria-hidden="true" size={15} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <QuantityControl
                    onDecrement={() => decrementCartItem(item.productId)}
                    onIncrement={() => incrementCartItem(item.productId)}
                    onQuantityChange={(quantity) => setCartItemQuantity(item.productId, quantity)}
                    quantity={item.quantity}
                  />

                  <p className="text-sm font-semibold text-gold-ink">{price(lineTotal, item.currencyCode)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="space-y-3 rounded-[1.5rem] bg-brand-panel p-4">
        <SummaryRow label={copy.subtotal} value={price(subtotal)} />
        <SummaryRow label={copy.discount} value={formattedDiscount} />
        <SummaryRow label={copy.deliveryFee} value={price(pricingConfig.deliveryFee)} />
        <div className="gold-rule my-1" />
        <SummaryRow emphasize label={copy.total} value={price(total)} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-brand-muted">
      <span>{label}</span>
      <span className={emphasize ? 'text-lg font-semibold text-gold-ink' : 'font-semibold text-brand-ink'}>
        {value}
      </span>
    </div>
  );
}
