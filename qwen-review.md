# Code Review: `feature/web-cart-foundation`

**Date:** 2026-04-15
**Target:** Local uncommitted changes on `feature/web-cart-foundation`
**Files Changed:** 6
- `apps/web/src/components/checkout/guest-checkout-form.tsx`
- `apps/web/src/routes/product-page.tsx`
- `apps/web/src/routes/products-page.tsx`
- `docs/api/openapi.json`
- `packages/api-client/src/orders/types.ts`
- `.claude/tasks/active.md`

---

## Summary

This PR simplifies the guest checkout flow by removing address and delivery mode fields, redesigns the products page with a white background and store filtering, and updates API types to reflect the changes. **3 Critical issues** must be addressed before merging, plus **5 Suggestions** for improvement.

---

## Findings

### Critical

#### 1. `[linter]` `isPublicOrder` validator rejects `null` `guestAddress` — orders will fail on response parsing

- **File:** `packages/api-client/src/orders/validators.ts:34`
- **What's wrong:** The validator checks `typeof value.guestAddress === 'string'`, but the API spec now allows `guestAddress` to be `null` (since `address` is optional in the request). When a guest checkout without an address succeeds on the server, the client will throw `ApiClientError('INVALID_ORDER_RESPONSE')` when parsing the response.
- **Why it matters:** Silent order-loss bug. The server creates the order successfully, but the client throws, making checkout appear to fail.
- **Suggested fix:**
  ```ts
  // Line 34: Change from:
  typeof value.guestAddress === 'string'
  // To:
  (value.guestAddress === null || value.guestAddress === undefined || typeof value.guestAddress === 'string')
  ```

---

#### 2. `[typecheck]` `PublicOrder.guestAddress` type doesn't reflect nullable field — downstream code assumes string

- **File:** `packages/api-client/src/orders/types.ts:32`
- **What's wrong:** `PublicOrder` declares `guestAddress: string` (required), but the OpenAPI spec marks it as `nullable: true`. TypeScript won't allow handling the null case at compile time.
- **Why it matters:** `order-confirmation.tsx:58` renders `{order.guestAddress}` unconditionally. If it's `null`, this shows as blank, confusing the user.
- **Suggested fix:**
  ```ts
  export interface PublicOrder {
    // ...
    guestAddress?: string | null;  // was: guestAddress: string;
  }
  ```

---

#### 3. `[review]` Race condition: rapid store selection can show wrong products

- **File:** `apps/web/src/routes/products-page.tsx:177-196`
- **What's wrong:** `syncProducts` has no request cancellation. If a user clicks store A, then immediately clicks store B before A's response arrives, the stale response from A may overwrite B's data. The `isSubscribed` flag (lines 231/240) is declared but never actually checked before state updates.
- **Why it matters:** User selects store B but sees store A's products — a silent data corruption bug.
- **Suggested fix:** Use a request ID ref to guard stale updates:
  ```ts
  const requestIdRef = useRef(0);

  const syncProducts = useCallback(async (storeId: string | null) => {
    const thisRequest = ++requestIdRef.current;
    setProductsState((s) => ({ ...s, errorMessage: null, isLoading: true }));
    try {
      const response = await getProducts(storeId ? { storeId } : undefined);
      if (thisRequest === requestIdRef.current) {
        setProductsState({ products: response.data, errorMessage: null, isLoading: false });
      }
    } catch (error) {
      if (thisRequest === requestIdRef.current) {
        setProductsState({ products: [], errorMessage: getErrorMessage(error), isLoading: false });
      }
    }
  }, []);
  ```

---

### Suggestion

#### 4. `[review]` `order-confirmation.tsx` renders `guestAddress` unconditionally — will show blank after address removal

- **File:** `apps/web/src/components/checkout/order-confirmation.tsx:57-58`
- **What's wrong:** Always displays an "Address" row with `{order.guestAddress}`, but since address is no longer collected, this will render as `undefined`/empty.
- **Why it matters:** Poor UX — customer sees an incomplete order summary.
- **Suggested fix:**
  ```tsx
  {order.guestAddress && (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500">Address</dt>
      <dd className="font-semibold text-stone-950 text-right">{order.guestAddress}</dd>
    </div>
  )}
  ```

---

#### 5. `[review]` Stores fetch silently swallows errors — no feedback if API fails

- **File:** `apps/web/src/routes/products-page.tsx:200-207`
- **What's wrong:** The `catch` block sets `stores: []` with no error tracking. If the stores API fails, the filter bar shows only "All Products" with no indication something went wrong.
- **Why it matters:** Users can't filter by store and don't know why.
- **Suggested fix:** Add `storesError` to `StoresState` and display a subtle indicator in `StoreFilterBar`.

---

#### 6. `[review]` No phone validation pattern — invalid numbers accepted

- **File:** `apps/web/src/components/checkout/guest-checkout-form.tsx:93`
- **What's wrong:** Phone field only checks `{ required: '...' }` with no format validation. Since phone is now the only contact mechanism (no email, no address), an invalid number like "123" will be accepted.
- **Why it matters:** Merchant cannot contact the customer for order updates.
- **Suggested fix:**
  ```ts
  ...register('phone', {
    required: 'Phone number is required',
    pattern: {
      value: /^\+?[\d\s\-()]{7,15}$/,
      message: 'Enter a valid phone number'
    }
  })
  ```

---

#### 7. `[review]` `getProducts` query string building is fragile — no `URLSearchParams`

- **File:** `packages/api-client/src/products/get-products.ts:7-14`
- **What's wrong:** Manual string building (`searchParams.join('&')`) instead of `URLSearchParams`. Works for single params now but will break if more are added.
- **Why it matters:** Fragile — adding a second query param later will likely introduce bugs.
- **Suggested fix:**
  ```ts
  const createProductsSearchParams = (query?: ProductsQuery) => {
    const params = new URLSearchParams();
    if (query?.storeId) params.set('storeId', query.storeId);
    return params.toString();
  };
  ```

---

#### 8. `[review]` Dead `isSubscribed` variable — signals intent that was never implemented

- **File:** `apps/web/src/routes/products-page.tsx:219-231`
- **What's wrong:** `isSubscribed` is set to `false` in cleanup but never checked before `setProductsState` or `setStoresState` calls.
- **Why it matters:** Misleading — suggests race conditions are handled when they're not.
- **Suggested fix:** Either remove it entirely (React 18 handles unmount gracefully) or wire it into the async flow (as shown in finding #3).

---

### Nice to have

#### 9. `[review]` `StoreFilterBar` uses inline SVG instead of `react-icons` — inconsistent with codebase

- **File:** `apps/web/src/routes/products-page.tsx:105-117`
- **What's wrong:** The "All Products" button uses a raw `<svg>`, while the rest of the codebase uses `react-icons` (e.g., `FiGrid` exists).
- **Suggested fix:** Replace with `<FiGrid className="h-10 w-10 text-amber-600" />`.

---

#### 10. `[review]` Store images lack `loading="lazy"` — can compete with product images on initial load

- **File:** `apps/web/src/routes/products-page.tsx:141`
- **Suggested fix:** Add `loading="lazy"` and `decoding="async"` to store `<img>` tags.

---

#### 11. `[review]` `StoreFilterBar` has duplicated className logic for selected/unselected states

- **File:** `apps/web/src/routes/products-page.tsx:87-175`
- **What's wrong:** The active/inactive visual logic (`scale-105`, `ring-4`, `grayscale opacity-60`, etc.) is duplicated across the "All" button and every store button (~40 lines).
- **Suggested fix:** Extract a `getFilterItemClasses(isSelected)` helper to reduce duplication.

---

## Deterministic Analysis

- **TypeScript (`tsc --noEmit`):** Passed with no errors
- **Lint (`tsc --noEmit` via turbo):** Passed with no errors

---

## Verdict

**Request changes** — 3 Critical issues must be fixed before merging:

1. Fix `isPublicOrder` validator to accept `null` `guestAddress`
2. Update `PublicOrder` type to reflect nullable `guestAddress`
3. Add request cancellation to `syncProducts` to prevent race conditions on store selection
