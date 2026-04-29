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
| Scheduled date/time | Only if scheduled | **v1: plain `TextInput` with placeholder `"YYYY-MM-DDTHH:mm"` and a helper line "Enter date/time in your local timezone — we'll convert to UTC"**. Do NOT add `@react-native-community/datetimepicker` (not installed; defer the native picker to a follow-up). |

## API payload (verified against `packages/api-client/src/orders/types.ts`)
```ts
// CreatePublicOrderRequest:
{
  guest: { name, phone, address?, email? },          // GuestInfo — note nested under `guest`
  deliveryMode: 'instant' | 'scheduled',
  scheduledAt?: string,                               // ISO 8601 UTC, e.g. "2026-04-29T15:30:00.000Z"
  couponCode?: string,                                // not used in v1
  items: { productId: string; quantity: number }[],  // CreatePublicOrderItem — quantity & productId only
}
```
Items are NOT snapshotted with price/name — the API computes line totals server-side.

## Behaviour
- Validate required fields (name, phone, address; scheduledAt when delivery mode is 'scheduled') before submission; show inline error messages.
- Wrap the form in `<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>` so the keyboard doesn't cover inputs.
- Convert the user's local-timezone scheduled string to ISO 8601 UTC before sending: `new Date(localString).toISOString()`. Reject with an inline error if `Number.isNaN(Date.parse(localString))`.
- On submit: call `createPublicOrder({ guest: { name, phone, address, email }, deliveryMode, scheduledAt, items })`.
- Items mapped from `state.items` as `{ productId, quantity }[]`.
- On success: call `onSuccess(order)` and let the parent navigate to the confirmation screen. **Do NOT call `clearCartItems()` here** — clear it from `OrderConfirmationScreen` on mount (MT-7) to avoid an empty-cart flicker during the navigation transition.
- On API error:
  - 4xx: show the server error message ("Please check your details and try again.") inline below the submit button.
  - 5xx / network: show "Couldn't reach our servers. Please try again." with a retry affordance (button stays enabled).
- Loading state: disable form fields and show spinner on submit button while in flight.

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
- Successful submission passes `order` to `onSuccess` (cart is cleared by MT-7 on confirmation mount, not here)
- 4xx and 5xx errors display distinct inline messages
- Keyboard does not cover inputs on iOS or Android
- "Scheduled" mode reveals date/time input; invalid date strings are rejected with an inline error
- `scheduledAt` is sent as ISO 8601 UTC
- Done: tick `[x] MT-6` in `.claude/tasks/activemobile.md` and commit
