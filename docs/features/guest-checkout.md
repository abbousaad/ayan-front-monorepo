# Guest Checkout Workflow — MVP Plan

## Flow

```
Cart sidebar → "Continue" button
  ├─ Authenticated? → Regular checkout (future)
  └─ Unauthenticated → Choice modal
      ├─ "Continue as guest" → Guest checkout form
      └─ "Login / Sign up" → Auth flow (future)
```

## Guest Checkout Form

**Fields:**
- Name (required)
- Phone (required)
- Address (required)
- Email (optional)
- Delivery mode: instant | scheduled
- Scheduled at (if scheduled)
- Coupon code (optional)

**Cart items:** Editable list with quantity controls and remove button.

**Submit:** POST `/public/orders`

**Request body:**
```json
{
  "guest": {
    "name": "John",
    "phone": "+1234567890",
    "email": "john@example.com",
    "address": "123 Main St"
  },
  "deliveryMode": "instant",
  "items": [
    { "productId": "abc123", "quantity": 2 }
  ]
}
```

**Response:** `PublicOrder` with pricing breakdown (subtotal, deliveryFee, serviceFee, tax, grandTotal).

## Files to Create

| File | Purpose |
|------|---------|
| `apps/web/src/routes/checkout.tsx` | Checkout route |
| `apps/web/src/components/checkout/guest-checkout-form.tsx` | Form component |
| `apps/web/src/components/checkout/cart-summary.tsx` | Editable cart items list |
| `apps/web/src/components/checkout/continue-modal.tsx` | Guest vs login choice |
| `packages/api-client/src/orders/index.ts` | `createPublicOrder` API call |

## Files to Modify

| File | Change |
|------|--------|
| `apps/web/src/router.tsx` | Add `/checkout` route |
| `apps/web/src/components/cart/cart-sidebar.tsx` | "Continue" button → navigate to checkout |
| `apps/web/src/cart/cart-provider.tsx` | Expose `removeCartItem` for checkout edits |

## API Client

```ts
// packages/api-client/src/orders/index.ts

type GuestInfo = {
  name: string;
  phone: string;
  email?: string;
  address: string;
};

type PublicOrderPayload = {
  guest: GuestInfo;
  deliveryMode: 'instant' | 'scheduled';
  scheduledAt?: string;
  couponCode?: string;
  items: { productId: string; quantity: number }[];
};

export async function createPublicOrder(payload: PublicOrderPayload) {
  const res = await fetch(`${BASE_URL}/public/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Order failed: ${res.status}`);
  return res.json(); // { data: PublicOrder }
}
```

## Acceptance Criteria

- [ ] "Continue" in cart sidebar navigates to `/checkout`
- [ ] Unauthenticated users see guest vs login choice
- [ ] "Continue as guest" shows checkout form with cart items
- [ ] Cart items are editable (quantity) and removable
- [ ] Form validates required fields before submit
- [ ] Submit calls `POST /public/orders` and shows confirmation
- [ ] Order response displays pricing breakdown
