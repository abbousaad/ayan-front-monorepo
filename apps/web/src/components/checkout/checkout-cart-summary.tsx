import { createImageUrl } from '@acme/api-client';
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useCart } from '../../cart/use-cart';
import { QuantityControl } from '../cart/quantity-control';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);

export function CheckoutCartSummary() {
  const {
    decrementCartItem,
    incrementCartItem,
    isCartEmpty,
    removeCartItem,
    setCartItemQuantity,
    state,
    subtotal
  } = useCart();

  if (isCartEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-stone-200 bg-[#fbf7f1] px-6 py-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-700">
          <FiShoppingBag aria-hidden="true" size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-stone-950">Your cart is empty</h3>
          <p className="text-sm leading-6 text-stone-600">
            Head back to{' '}
            <Link className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800" to="/products">
              browse products
            </Link>{' '}
            and add some items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-950">Your order</h2>

      <div className="space-y-3">
        {state.items.map((item) => {
          const lineTotal = item.price * item.quantity;

          return (
            <article key={item.productId} className="flex gap-3 rounded-[1.5rem] border border-stone-200 bg-[#fbf7f1] p-3">
              <img
                alt={item.name}
                className="h-20 w-20 rounded-[1rem] object-cover"
                src={createImageUrl(item.imageUrl ?? '')}
              />

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-stone-950">{item.name}</h3>
                    <p className="mt-1 text-xs text-stone-500">
                      {formatPrice(item.price)}
                      {item.unit ? <span> / {item.unit}</span> : null}
                    </p>
                  </div>

                  <button
                    aria-label={`Remove ${item.name} from cart`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-1"
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

                  <p className="text-sm font-semibold text-stone-950">{formatPrice(lineTotal)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] bg-[#fbf7f1] p-4">
        <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
          <span>Subtotal</span>
          <span className="text-lg font-semibold text-stone-950">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-stone-500">Delivery fee calculated at confirmation.</p>
      </div>
    </div>
  );
}
