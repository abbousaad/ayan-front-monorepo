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
3. Order ID: `#<order.id>` (truncated or full)
4. Delivery mode and address
5. Grand total (use `order.grandTotal ?? order.totalAmount`)
6. "Back to shopping" button → calls `onBackToHome()`

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
- Order ID, delivery info, and total rendered correctly
- "Back to shopping" returns to home screen
- Cart badge shows 0 (cleared in MT-6)
