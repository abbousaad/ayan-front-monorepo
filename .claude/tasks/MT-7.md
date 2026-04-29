# MT-7: Order confirmation screen

## Goal
Display a success screen after a guest order is placed, showing order details and a button to return to home.

## Files to create
- `apps/mobile/src/order-confirmation-screen.tsx`

## Files to modify
- `apps/mobile/App.tsx` — add `'order-confirmation'` to `ActiveScreen` union (with `order: PublicOrder` payload); render `<OrderConfirmationScreen>` when active; pass `onBackToHome` → `setActiveScreen({ name: 'home' })`

## Screen content
1. Large checkmark icon (Ionicons `checkmark-circle` in brand green)
2. Title: "Order placed!"
3. Order ID: `#<last-8-of-order.id, uppercased>` — e.g. `#A1B2C3D4`
4. Delivery mode and address (from `order.deliveryMode`, `order.guestAddress`)
5. **Line items list** — render `order.items` (productId, quantity, unitPrice, lineTotal) for parity with the web confirmation page
6. Grand total (use `order.grandTotal ?? order.totalAmount`)
7. "Back to shopping" button → calls `onBackToHome()`

## Behaviour
- On mount: call `clearCartItems()` from `useCart()` (deferred from MT-6 to avoid mid-navigation flicker).
- Disable Android hardware back button via `BackHandler` listener and route it through `onBackToHome` instead — never let the user return to the cleared checkout/cart state.

## Props
```ts
type OrderConfirmationScreenProps = {
  order: PublicOrder;
  onBackToHome(): void;
};
```

## Context
- `PublicOrder` type from `packages/api-client/src/orders/types.ts`
- Cart was already cleared by MT-6 before navigating here

## Acceptance criteria
- Order ID (last 8 chars, uppercased), delivery info, line items, and grand total rendered correctly
- "Back to shopping" returns to home screen
- Cart is cleared on mount; cart badge shows 0
- Android hardware back goes home, not back to checkout
- Done: tick `[x] MT-7` in `.claude/tasks/activemobile.md` and commit
