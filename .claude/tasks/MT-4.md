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
- Pricing: call `getPublicPricingConfig()` from `@acme/api-client/orders` on mount.
  - While loading: render a "Calculating totals…" placeholder in the totals footer (do NOT render zeros; avoids flicker once real values arrive).
  - On error: fall back to `{ deliveryFee: 0, discountRate: 0 }` and surface a small inline note ("Couldn't load delivery fee — using default.").
  - `PricingConfig` shape: `{ deliveryFee: number; discountRate: number }`.
- Pricing selectors: `getCartSubtotal`, `getTotalWithPricing`, `getDiscountAmount` from `@acme/cart`
- `onProceed` prop triggers auth choice (MT-5); `onBack` prop navigates back

## Currency assumption
- v1 assumes a single currency per cart. If items in `state.items` carry mixed `currencyCode` values, log a warning and use the first item's `currencyCode` for display (don't try to convert). The mobile app should ideally prevent mixed-currency carts upstream, but this screen must not crash if it happens.

## Props
```ts
type CartScreenProps = {
  onBack(): void;
  onProceed(): void;
};
```

## Acceptance criteria
- All cart items shown with correct quantities and line totals (formatted with item's `currencyCode`)
- Incrementing/decrementing updates totals instantly
- Grand total matches `getTotalWithPricing(subtotal, deliveryFee, discountRate)`
- Totals footer shows a placeholder while `getPublicPricingConfig` is in flight (no flicker)
- "Proceed" disabled while pricing is loading and when cart is empty; calls `onProceed` otherwise
- Empty state shown when cart is empty
- Done: tick `[x] MT-4` in `.claude/tasks/activemobile.md` and commit
