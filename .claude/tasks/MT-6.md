# MT-6: Guest checkout screen

## Goal
Build a checkout screen with a guest info form and delivery mode selector. Submits the order via the API and navigates to confirmation on success.

## Files to create
- `apps/mobile/src/checkout-screen.tsx`

## Files to modify
- `apps/mobile/App.tsx` — add `'checkout'` to `ActiveScreen` union; render `<CheckoutScreen>` when active; pass `onSuccess` → navigate to `'order-confirmation'`, `onBack` → navigate back to `'cart'`

## Form fields
| Field | Required | Type |
|-------|----------|------|
| Full name | Yes | text input |
| Phone number | Yes | phone input (`keyboardType="phone-pad"`) |
| Delivery address | Yes | text input |
| Email | No | email input (`keyboardType="email-address"`) |
| Delivery mode | Yes | toggle / segmented control: "Instant" \| "Scheduled" |
| Scheduled date/time | Only if scheduled | date + time picker (use `@react-native-community/datetimepicker` or a simple TextInput with ISO hint for now) |

## Behaviour
- Validate required fields before submission; show inline error messages
- On submit: call `createPublicOrder({ guest, deliveryMode, scheduledAt?, items })` from `@acme/api-client/orders`
- Items mapped from `state.items` as `{ productId, quantity }[]`
- On success: call `onSuccess(order)` → clears cart via `clearCartItems()` in the screen before navigating
- On API error: display error message below submit button
- Loading state: disable form and show spinner on submit button

## Props
```ts
type CheckoutScreenProps = {
  onBack(): void;
  onSuccess(order: PublicOrder): void;
};
```

## Context
- `createPublicOrder`, `PublicOrder` from `packages/api-client/src/orders/`
- `useCart()` from MT-1: `state.items`, `clearCartItems`

## Acceptance criteria
- Required field validation prevents submission
- Successful submission clears cart and passes `order` to `onSuccess`
- API error displayed inline
- "Scheduled" mode reveals date/time input
