# MT-2: Wire ProductCard "Add to cart"

## Goal
Connect the dormant "Add to cart" button in ProductCard to the cart context.

## Files to modify
- `apps/mobile/src/components/product-card.tsx`

## Context
- Current state: ProductCard renders an "Add to cart" button with no handler (dead UI)
- `useCart()` is available after MT-1 is merged
- Cart item input shape:
  ```ts
  { productId, name, price, storeId, imageUrl?, unit?, quantity? }
  ```
- Product type (`@acme/api-client/products`): `{ id, storeId, name, price, imageUrl, unit, ... }`

## Behaviour
- Pressing "Add to cart" calls `addCartItem({ productId: product.id, name: product.name, price: product.price, storeId: product.storeId, imageUrl: product.imageUrl, unit: product.unit })`
- If the item is already in the cart, show the current quantity with `+` / `−` buttons (using `getCartItemQuantity` selector) instead of the "Add" button

## Acceptance criteria
- Tapping "Add to cart" adds item to cart (badge increments in MT-3)
- Already-in-cart items show quantity control in the card
- Pressing `−` down to 0 removes the item (calls `removeCartItem`)
