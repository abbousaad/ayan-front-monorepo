# Active Tasks

Current session tasks. Written by `planner`, updated by agents as work progresses.

> Update this file at the start and end of every session.

---

## In Progress

### Feature: Guest Checkout MVP

**Goal:** Complete the end-to-end guest checkout flow in the web app — from cart sidebar → auth choice modal → checkout page with editable cart and form → order submission → success confirmation.

**Branch:** `feature/web-cart-foundation`
**Last updated:** 2026-04-01

---

### Sub-tasks

#### ST-1 — Wire CartSidebar "Continue" button to AuthChoiceModal
- **Status:** `[x]`
- **Files to edit:** `apps/web/src/components/cart/cart-sidebar.tsx`
- **What to do:**
  - Add local state `showAuthModal` (boolean) to `CartSidebar`.
  - On the "Continue" button `onClick`, set `showAuthModal = true`.
  - Render `<AuthChoiceModal onClose={() => setShowAuthModal(false)} />` conditionally when `showAuthModal` is true.
  - Import `AuthChoiceModal` from `../../components/checkout/auth-choice-modal`.
  - No new files needed for this sub-task.
- **Notes:**
  - `AuthChoiceModal` is already built at `apps/web/src/components/checkout/auth-choice-modal.tsx`. It already calls `navigate('/checkout')` on guest selection and accepts a single `onClose` prop.
  - The modal's own backdrop `onClick` calls `onClose`, so closing is handled internally.

---

#### ST-2 — Add `/checkout` route to the router
- **Status:** `[x]`
- **Files to edit:** `apps/web/src/router.tsx`
- **Files to create:** `apps/web/src/routes/checkout-page.tsx` (stub — full component built in ST-4)
- **What to do:**
  - Create `apps/web/src/routes/checkout-page.tsx` exporting `CheckoutPage` (can be a stub `<div>Checkout</div>` initially, filled out in ST-4).
  - In `apps/web/src/router.tsx`, add a child route `{ path: 'checkout', element: <CheckoutPage /> }` under the root `/` layout so `AppLayout` (Navbar + Outlet + CartSidebar) still wraps it.
  - Import `CheckoutPage` at the top of `router.tsx`.
- **Notes:**
  - Route must be a child of the existing root `/` route so the layout (Navbar) is preserved.
  - The cart sidebar will still be mounted but the user is on the checkout page; this is acceptable for MVP.

---

#### ST-3 — Add `createPublicOrder()` to `@acme/api-client`
- **Status:** `[x]`
- **Files to create:**
  - `packages/api-client/src/orders/types.ts`
  - `packages/api-client/src/orders/validators.ts`
  - `packages/api-client/src/orders/create-public-order.ts`
  - `packages/api-client/src/orders/index.ts`
- **Files to edit:**
  - `packages/api-client/src/index.ts` — re-export from `./orders`
  - `packages/api-client/package.json` — add `"./orders"` subpath export pointing at `./src/orders/index.ts`
- **What to do:**

  **`types.ts`** — define these TypeScript types:
  ```ts
  export type DeliveryMode = 'instant' | 'scheduled';

  export interface GuestInfo {
    name: string;
    phone: string;
    address: string;
    email?: string;
  }

  export interface CreatePublicOrderItem {
    productId: string;
    quantity: number;
  }

  export interface CreatePublicOrderRequest {
    guest: GuestInfo;
    deliveryMode: DeliveryMode;
    scheduledAt?: string;   // ISO date-time, required when deliveryMode === 'scheduled'
    couponCode?: string;
    items: CreatePublicOrderItem[];
  }

  export interface PublicOrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }

  export interface PublicOrder {
    id: string;
    guestName: string;
    guestPhone: string;
    guestAddress: string;
    deliveryMode: DeliveryMode;
    status: string;
    subtotal?: number;
    deliveryFee?: number;
    grandTotal?: number;
    totalAmount?: number;
    items?: PublicOrderItem[];
  }

  export interface CreatePublicOrderResponse {
    data: PublicOrder;
  }
  ```

  **`validators.ts`** — write a Zod schema for `PublicOrder` and a parse helper `parseCreatePublicOrderResponse`. Follow the pattern in `packages/api-client/src/products/validators.ts`. Import `zod` (already a dependency).

  **`create-public-order.ts`** — implement:
  ```ts
  export const createPublicOrder = async (body: CreatePublicOrderRequest): Promise<PublicOrder>
  ```
  Use `requestJson` with `{ baseUrl: API_BASE_URL }`, path `/public/orders`, and `init: { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }`. Parse the response with the Zod validator.

  **`index.ts`** — re-export everything from the three files above.

- **Notes:**
  - `POST /public/orders` requires no auth header.
  - Required request fields: `guest` (`name`, `phone`, `address`; `email` optional), `deliveryMode` (`'instant'` | `'scheduled'`), `items` (array, minItems 1, each `{ productId, quantity }`).
  - `scheduledAt` is only needed when `deliveryMode === 'scheduled'`; omit for MVP (default to `'instant'`).
  - API responds `201` with `{ data: PublicOrder }`. Treat `400`, `404`, `422` as thrown `ApiClientError`.
  - Follow the exact same module shape as `packages/api-client/src/products/` (types → validators → fetch function → index).

---

#### ST-4 — Build the CheckoutPage component
- **Status:** `[x]`
- **Files to create/edit:** `apps/web/src/routes/checkout-page.tsx` (replace stub from ST-2)
- **Sub-components to create (inline or in `apps/web/src/components/checkout/`):**
  - `CheckoutCartSummary` — editable cart items list
  - `GuestCheckoutForm` — react-hook-form checkout form
- **What to do:**

  **`CheckoutCartSummary`** (can live in `apps/web/src/components/checkout/checkout-cart-summary.tsx`):
  - Read cart state via `useCart()`.
  - Render each `CartItem` with product name, unit price, quantity, and line total.
  - Each line has a quantity control (increment / decrement) and a remove button, using the existing `CartContext` dispatch actions (`increment-item`, `decrement-item`, `remove-item`).
  - Show subtotal at the bottom (use `getCartSubtotal` selector via `useCart().subtotal`).
  - If cart becomes empty, show a message with a link back to `/products`.
  - Reuse `CartLineItem` component or extract shared quantity UI if appropriate. Do not duplicate Tailwind patterns; follow the visual style of the existing sidebar.

  **`GuestCheckoutForm`** (can live in `apps/web/src/components/checkout/guest-checkout-form.tsx`):
  - Use `react-hook-form` (already installed) with `useForm<FormValues>`.
  - Fields (all required unless noted):
    - `name` — text input, required
    - `phone` — text input, required
    - `address` — text/textarea, required
    - `email` — email input, optional
    - `deliveryMode` — radio group: `instant` (default) | `scheduled`
    - `scheduledAt` — datetime-local input, required only when `deliveryMode === 'scheduled'` (use `watch('deliveryMode')` to show/hide)
  - On submit: call `createPublicOrder()` from `@acme/api-client` with form values + mapped cart items.
  - Map cart items: `state.items.map(i => ({ productId: i.productId, quantity: i.quantity }))`.
  - Show a loading state on the submit button while the request is in flight.
  - On `ApiClientError`, display the error message inline (do not crash; use a `catch` block and set local error state).
  - On success: call a callback `onSuccess(order: PublicOrder)` passed as a prop.

  **`CheckoutPage`** (`apps/web/src/routes/checkout-page.tsx`):
  - Guard: if `isCartEmpty`, redirect to `/` with `<Navigate to="/" replace />`.
  - Render two-column layout on md+ screens: cart summary (left) | form (right). Single column on mobile.
  - When `GuestCheckoutForm` calls `onSuccess`, set local state `confirmedOrder` and render the success view instead of the form.

---

#### ST-5 — Build the Order Confirmation / Success View
- **Status:** `[x]`
- **Files to create:** `apps/web/src/components/checkout/order-confirmation.tsx`
- **What to do:**
  - Accept props: `order: PublicOrder`.
  - Display: order ID, guest name, delivery mode, status, and grand total (or totalAmount).
  - Show a "Back to shopping" link to `/`.
  - After showing confirmation, clear the cart by calling `clearCartItems()` from `useCart()`. Use a `useEffect` that fires once on mount (when this component renders, the order is done).
  - Style consistently with the rest of the app (stone + amber palette, Tailwind v4).
- **Notes:**
  - `clearCartItems()` is already available on the cart context.
  - `PublicOrder` response shape: `{ id, guestName, guestPhone, guestAddress, deliveryMode, status, grandTotal?, totalAmount?, items? }`.

---

#### ST-6 — Fix styling bug in AuthChoiceModal
- **Status:** `[x]`
- **Files to edit:** `apps/web/src/components/checkout/auth-choice-modal.tsx`
- **What to do:**
  - The "Continue as guest" button currently tries to use inline CSS syntax inside a Tailwind `className` string, which is invalid:
    ```
    `background-color: ${brandColors.logoGreen}; color: ${brandColors.white}`
    ```
  - Fix by applying `style={{ backgroundColor: brandColors.logoGreen, color: brandColors.white }}` as a React `style` prop (same pattern used in `cart-sidebar.tsx` for the Continue button).
  - Also add hover/focus ring styles to the guest button to match the pattern used in `cart-sidebar.tsx`.
  - The modal's root `<div>` uses `border-l` (sidebar-style left border) but should use `rounded-2xl` since it is a centered modal. Fix border and add `rounded-2xl` to the modal container.

---

### Key Decisions (pre-resolved — DO agent must not re-derive)

| Decision | Resolution |
|---|---|
| Auth choice modal | Already exists at `apps/web/src/components/checkout/auth-choice-modal.tsx`. Wire only; do not rebuild. |
| Checkout route nesting | Child of root `/` layout — keeps Navbar visible on checkout page. |
| Delivery mode default | `'instant'` — no scheduling UI required for MVP unless user explicitly selects `'scheduled'`. |
| `scheduledAt` | Show `datetime-local` input only when `deliveryMode === 'scheduled'`; omit from request body when `'instant'`. |
| API client pattern | New `orders` module follows the same file shape as `products` module: `types.ts` → `validators.ts` → `create-public-order.ts` → `index.ts`. |
| No new packages | `react-hook-form` is already installed. `zod` is already installed. No additional installs. |
| Cart edit on checkout | Use existing cart dispatch actions — no new reducer logic needed. |
| Cart clearing | Call `clearCartItems()` inside `OrderConfirmation` on mount (after successful order). |
| State management | All state is local React state + existing `CartContext`. No new context or global state needed. |
| Error handling | Catch `ApiClientError` in the form submit handler; show message inline. Do not use error boundaries for this feature. |
| AuthChoiceModal "Login/Signup" | For MVP: calls `onClose()`. No login flow to implement. |

---

### Execution Order

```
ST-6 (fix modal bug) → ST-3 (api-client) → ST-2 (route stub) → ST-1 (wire modal) → ST-4 (checkout page) → ST-5 (confirmation)
```

ST-3 and ST-6 can be done in parallel. ST-2 depends on ST-6 being done (so modal is clean when tested). ST-4 depends on ST-2 and ST-3. ST-5 is built as part of ST-4 but listed separately for review granularity.

---

## Session Notes

- Branch: `feature/web-cart-foundation`
- Last updated: 2026-04-01
- Backlog item being addressed: "Guest Checkout MVP" (High Priority)
- After all sub-tasks are complete, `doc-writer` must update `CLAUDE.md` (new `/checkout` route row in the routing table, new `createPublicOrder()` entry in the API client section).
