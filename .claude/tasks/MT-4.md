# MT-4: Cart screen

## Goal
Build the cart screen that lists cart items, allows quantity edits, shows pricing totals, and has a "Proceed" button.

## Files to create
- `apps/mobile/src/cart-screen.tsx`

## Files to modify
- `apps/mobile/App.tsx` — add `'cart'` to `ActiveScreen` union and render `<CartScreen>` when active

## Screen layout
1. **Header** — "Your cart" title + back arrow (→ home) + "Clear cart" text button (only when cart non-empty)
2. **Items list** — ScrollView of cart items: image, name, unit price, quantity control (+/−), line total, remove button
3. **Empty state** — "Your cart is empty" message + "Browse products" button back to home
4. **Totals footer** (sticky bottom) — subtotal, delivery fee, discount, grand total (use `getTotalWithPricing` from `@acme/cart`), + "Proceed" button

## Context
- `useCart()` from MT-1: `state`, `cartCount`, `incrementCartItem`, `decrementCartItem`, `removeCartItem`, `clearCartItems`
- Pricing: call `getPublicPricingConfig()` from `@acme/api-client/orders` on mount; fall back to `{ deliveryFee: 0, discountRate: 0 }` on error
- Pricing selectors: `getCartSubtotal`, `getTotalWithPricing`, `getDiscountAmount` from `@acme/cart`
- `onProceed` prop triggers auth choice (MT-5); `onBack` prop navigates back

## Props
```ts
type CartScreenProps = {
  onBack(): void;
  onProceed(): void;
};
```

## Acceptance criteria
- All cart items shown with correct quantities and line totals
- Incrementing/decrementing updates totals instantly
- Grand total matches `getTotalWithPricing(subtotal, deliveryFee, discountRate)`
- "Proceed" calls `onProceed`
- Empty state shown when cart is empty
