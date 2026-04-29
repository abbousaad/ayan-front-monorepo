# MT-1: Mobile cart context provider

## Goal
Create a CartProvider and useCart hook for the mobile app that mirrors the web pattern, using AsyncStorage for persistence.

## Files to create
- `apps/mobile/src/cart/cart-storage-mobile.ts` — AsyncStorage load/save helpers (key: `'ayan-market-cart'`)
- `apps/mobile/src/cart/cart-provider.tsx` — React Context + `useReducer(cartReducer)`, hydrates from AsyncStorage on mount, persists on every state change
- `apps/mobile/src/cart/use-cart.ts` — `useCart()` hook (throws if used outside CartProvider)

## Files to modify
- `apps/mobile/App.tsx` — wrap the root with `<CartProvider>`

## Context
- Shared reducer: `packages/cart/src/cart-reducer.ts` exports `cartReducer`, `createCartState`
- Shared types: `CartState`, `CartItem`, `CartItemInput` from `packages/cart/src/types.ts`
- Web reference: `apps/web/src/cart/cart-provider.tsx` and `apps/web/src/cart/cart-storage-web.ts`
- AsyncStorage package: `@react-native-async-storage/async-storage` (standard in Expo)

## Context value shape
Expose the same interface as the web provider:
```ts
{
  state: CartState;
  isHydrated: boolean;
  cartCount: number;
  addCartItem(item: CartItemInput): void;
  removeCartItem(productId: string): void;
  incrementCartItem(productId: string): void;
  decrementCartItem(productId: string): void;
  setCartItemQuantity(productId: string, quantity: number): void;
  clearCartItems(): void;
}
```
No `openCart`/`closeCart` (web sidebar concept, not needed on mobile).

## Hydration & persistence rules
- On `JSON.parse` failure (corrupt storage), log and fall back to `createCartState()` — never crash.
- **Only persist after `isHydrated === true`.** Otherwise the empty initial state overwrites stored data on the first effect run before hydration completes.
- Expose `subtotal` (from `getCartSubtotal`) and `getItemQuantity(productId)` on the context value to match web parity.

## Acceptance criteria
- `useCart()` returns live state after hydration
- Adding/removing items persists across app restarts
- `isHydrated` is `false` until AsyncStorage read completes
- Corrupt stored data falls back to empty cart (no crash)
- Done: tick `[x] MT-1` in `.claude/tasks/activemobile.md` and commit per CLAUDE.md
