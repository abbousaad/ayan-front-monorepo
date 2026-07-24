import { createImageUrl } from '@acme/api-client';
import { type CartItem } from '@acme/cart';
import { FiTrash2 } from 'react-icons/fi';

import { useCart } from '../../cart/use-cart';
import { QuantityControl } from './quantity-control';

type CartLineItemProps = {
  item: CartItem;
};

const formatPrice = (price: number, currencyCode = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(price);

export function CartLineItem({ item }: CartLineItemProps) {
  const { decrementCartItem, incrementCartItem, removeCartItem, setCartItemQuantity } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <article className="flex gap-3 rounded-[1.5rem] border border-stone-200 p-3" style={{ backgroundColor: 'var(--color-card-bg)' }}>
      <img alt={item.name} className="h-24 w-24 rounded-[1rem] object-cover" src={createImageUrl(item.imageUrl ?? '')} />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-stone-950">{item.name}</h3>
            <p className="mt-1 text-xs text-stone-500">
              {formatPrice(item.price, item.currencyCode ?? 'USD')}
              {item.unit ? <span> / {item.unit}</span> : null}
            </p>
          </div>

          <button
            aria-label={`Remove ${item.name} from cart`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1"
            onClick={() => {
              removeCartItem(item.productId);
            }}
            type="button"
          >
            <FiTrash2 aria-hidden="true" size={15} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityControl
            onDecrement={() => {
              decrementCartItem(item.productId);
            }}
            onIncrement={() => {
              incrementCartItem(item.productId);
            }}
            onQuantityChange={(quantity) => {
              setCartItemQuantity(item.productId, quantity);
            }}
            quantity={item.quantity}
          />

          <p className="text-sm font-semibold text-stone-950">{formatPrice(lineTotal, item.currencyCode ?? 'USD')}</p>
        </div>
      </div>
    </article>
  );
}
