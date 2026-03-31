# Pending Tasks for Guest Checkout MVP Implementation

## Completed Tasks
- [x] Create session directory and load context standards
- [x] Propose guest checkout implementation plan based on existing docs and codebase
- [x] Get user approval for the proposed approach
- [x] Check current authentication state management
- [x] Modify cart sidebar Continue button to show auth choice modal
- [x] Create auth choice modal component

## In Progress Tasks
- [ ] Create guest checkout form component
- [ ] Create cart summary component for checkout
- [ ] Add API client function for public orders
- [ ] Add checkout route to router
- [ ] Update cart provider to expose removeCartItem if needed

## Detailed Pending Tasks

### 1. Create guest checkout form component
- File: `apps/web/src/components/checkout/guest-checkout-form.tsx`
- Should include form fields for guest info (name, phone, email, address)
- Delivery mode selection (instant/scheduled)
- Scheduled date/time picker (when scheduled mode selected)
- Coupon code input (optional)
- Cart items display with edit/delete capabilities
- Form validation
- Submit handler that calls API client function

### 2. Create cart summary component for checkout
- File: `apps/web/src/components/checkout/cart-summary.tsx`
- Display cart items summary
- Show pricing breakdown (subtotal, delivery fee, service fee, tax, grand total)
- Should match the styling from the cart sidebar but optimized for checkout page

### 3. Add API client function for public orders
- File: `packages/api-client/src/orders/index.ts`
- Create `createPublicOrder` function that POSTs to `/public/orders`
- Follow the pattern from existing API client functions
- Handle proper typing based on API docs

### 4. Add checkout route to router
- File: `apps/web/src/router.tsx`
- Add new route for `/checkout` path
- Should render checkout layout with guest checkout form

### 5. Update cart provider to expose removeCartItem if needed
- File: `apps/web/src/cart/cart-provider.tsx`
- Verify `removeCartItem` is already exposed (it appears to be)
- If not, add it to the context value

## Notes
- The `removeCartItem` function is already exposed in the cart provider (lines 115-122)
- Need to check if any additional state management is needed for auth state
- For MVP, we're handling unauthenticated users only - authenticated flow will be implemented later