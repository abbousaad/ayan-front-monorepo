---
name: Project Status
description: Current branch, active features, what is done and what is pending
type: project
---

## Current branch
`feature/web-cart-foundation`

## Completed
- Cart reducer + selectors (`@acme/cart`) — pure TS, no React
- CartProvider + Context with localStorage hydration (`apps/web/src/cart/`)
- Cart sidebar, CartLineItem, QuantityControl, CartButton components
- Add-to-cart from ProductCard — opens sidebar on add
- Multi-store cart support (items from different storeIds coexist)
- AuthChoiceModal component (guest vs login) — wired into CartSidebar flow; a11y attrs added (role, aria-modal); `isLoading` prop removed
- Dev team agents created: planner, web-react-js-dev, mobile-react-native-expo-dev, code-reviewer, doc-writer, git-manager (in `.claude/agents/`)
- Guest Checkout MVP — all sub-tasks complete (see below)

## Completed (guest checkout MVP)
- CartSidebar "Continue" button → `AuthChoiceModal` → `/checkout` route wired
- `/checkout` route added to `apps/web/src/router.tsx` → `CheckoutPage`
- `GuestCheckoutForm` component (`apps/web/src/components/checkout/guest-checkout-form.tsx`)
- `CheckoutCartSummary` component (`apps/web/src/components/checkout/checkout-cart-summary.tsx`)
- `createPublicOrder()` added to `@acme/api-client/orders` — `POST /public/orders`
- `OrderConfirmation` component (`apps/web/src/components/checkout/order-confirmation.tsx`)
- `CartProvider` mounted in `apps/web/src/App.tsx` (was missing)

## Pending (from reviewer — backlog items)
- Bring `PublicOrder` type to full OpenAPI spec fidelity: add optional fields `guestEmail`, `serviceFee`, `taxAmount`, `discountAmount`, `couponId`, `couponCode`, `scheduledAt`
- Add `aria-labelledby` to `role="dialog"` element in `apps/web/src/components/checkout/auth-choice-modal.tsx`

## API
Backend runs at `http://localhost:3000/api/v1` (hardcoded in `packages/api-client/src/client/config.ts` — no env override yet).
