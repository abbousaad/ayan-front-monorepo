import { createImageUrl } from '@acme/api-client';
import type { CartItem } from '@acme/cart';
import { FiTrash2 } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { useI18n } from '../../contexts/i18n-context';
import { formatPrice } from '../../lib/format';
import { QuantityControl } from './quantity-control';

type CartLineItemProps = {
  item: CartItem;
};

export function CartLineItem({ item }: CartLineItemProps) {
  const { decrementCartItem, incrementCartItem, removeCartItem, setCartItemQuantity } = useCart();
  const { locale } = useI18n();
  const lineTotal = item.price * item.quantity;

  return (
    <article className="flex gap-3 rounded-[1.25rem] border border-brand-line bg-brand-charcoal p-3">
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
              {formatPrice(item.price, locale, item.currencyCode)}
              {item.unit ? <span> / {item.unit}</span> : null}
            </p>
          </div>

          <button
            aria-label={`✕ ${item.name}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-muted transition hover:bg-brand-panel hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold"
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

          <p className="text-sm font-semibold text-brand-gold">
            {formatPrice(lineTotal, locale, item.currencyCode)}
          </p>
        </div>
      </div>
    </article>
  );
}
