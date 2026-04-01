# Backlog

Upcoming features and improvements, roughly prioritised top to bottom.

---

## High Priority

### Guest Checkout MVP — COMPLETE
All sub-tasks shipped and reviewed (APPROVE WITH SUGGESTIONS).

- [x] Connect CartSidebar "Continue" button → `AuthChoiceModal`
- [x] Create `/checkout` route in `apps/web/src/router.tsx`
- [x] Build guest checkout form component (name, phone, address, email, delivery mode)
- [x] Build cart summary component for checkout page
- [x] Add `createPublicOrder()` to `@acme/api-client` — `POST /public/orders`
- [x] Order confirmation display after successful submission
- [x] Update CLAUDE.md with new route and API function

### Bring `PublicOrder` type to full OpenAPI spec fidelity
`packages/api-client/src/orders/` — the `PublicOrder` type is missing optional fields from the spec: `guestEmail`, `serviceFee`, `taxAmount`, `discountAmount`, `couponId`, `couponCode`, `scheduledAt`. Add them with correct Zod validators and TypeScript types.

### Fix `aria-labelledby` on `AuthChoiceModal` dialog
`apps/web/src/components/checkout/auth-choice-modal.tsx` — the `role="dialog"` element is missing an `aria-labelledby` attribute pointing at the modal's visible title. Required for screen-reader accessibility compliance.

---

## Medium Priority

### API base URL via env variable
Make `packages/api-client/src/client/config.ts` read from `VITE_API_BASE_URL` with localhost fallback. Required before staging/production deployment.

### Cart integration — mobile
Wire `@acme/cart` into `apps/mobile`. Implement `CartProvider` equivalent or adapt the reducer for mobile state management.

---

## Low Priority

### Unit tests for `@acme/cart`
Add a test runner (Vitest) and write unit tests for the pure reducer functions and selectors. Highest ROI in the codebase — zero DOM dependency.

### Error boundaries — web
Add React Error Boundaries to the root layout in `apps/web` to prevent full-page crashes from component errors.
