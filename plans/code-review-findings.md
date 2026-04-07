# Code Review Findings & Optimization Plan

## Overview

This document outlines bugs, potential issues, and optimization opportunities identified in the `ayan-front-monorepo-oac` repository.

---

## 🔴 Critical Issues

### 1. Hardcoded API Base URL
**Location:** [`packages/api-client/src/client/config.ts:1`](packages/api-client/src/client/config.ts:1)

```typescript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

**Problem:** The API URL is hardcoded to localhost, which will break in production, staging, or any non-local environment.

**Recommendation:** Use environment variables:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
```

---

### 2. Mobile App: Non-functional Add to Cart Button
**Location:** [`apps/mobile/src/components/product-card.tsx:51`](apps/mobile/src/components/product-card.tsx:51)

```tsx
<Pressable accessibilityLabel={`Add ${product.name} to cart`} style={styles.iconButton}>
  <Ionicons color={brandColors.white} name="bag-handle-outline" size={18} />
</Pressable>
```

**Problem:** The "Add to Cart" button in the mobile app has no `onPress` handler. The cart functionality exists in `@acme/cart` package but is not integrated into the mobile app at all.

**Recommendation:** Implement cart context/provider for mobile similar to the web app's [`CartProvider`](apps/web/src/cart/cart-provider.tsx:46).

---

### 3. Currency Inconsistency
**Locations:**
- [`apps/web/src/components/product-card.tsx:12`](apps/web/src/components/product-card.tsx:12) - Uses `USD` as default
- [`apps/web/src/routes/admin/admin-products-page.tsx:143`](apps/web/src/routes/admin/admin-products-page.tsx:143) - Hardcodes `MAD` (Moroccan Dirham)
- [`apps/web/src/components/checkout/order-confirmation.tsx:12`](apps/web/src/components/checkout/order-confirmation.tsx:12) - Hardcodes `USD`

**Problem:** Currency handling is inconsistent across the application. The admin page shows prices in MAD while the customer-facing pages show USD.

**Recommendation:** Create a centralized currency configuration/formatting utility that respects the store's or user's preferred currency.

---

## 🟡 Medium Priority Issues

### 4. Search Functionality Not Implemented
**Location:** [`apps/mobile/src/home-screen.tsx:185`](apps/mobile/src/home-screen.tsx:185)

```tsx
const [searchQuery, setSearchQuery] = useState('');
```

**Problem:** The mobile app has a search input that updates `searchQuery` state, but this state is never used to filter products or stores.

**Recommendation:** Implement search filtering logic or remove the non-functional search UI.

---

### 5. No React Error Boundaries
**Locations:** Both `apps/web` and `apps/mobile`

**Problem:** Neither application implements error boundaries to gracefully catch and handle React component errors. A single component error could crash the entire app.

**Recommendation:** Add error boundaries at the route level and around critical components.

---

### 6. Cart Storage Lacks Data Validation
**Location:** [`apps/web/src/cart/cart-storage-web.ts:17`](apps/web/src/cart/cart-storage-web.ts:17)

```typescript
const parsedValue = JSON.parse(rawValue) as Partial<CartState>;

if (!Array.isArray(parsedValue.items)) {
  return createCartState();
}
```

**Problem:** The cart storage only validates that `items` is an array, but doesn't validate the structure of individual cart items. Corrupted or outdated data structures could cause runtime errors.

**Recommendation:** Add schema validation for cart items (e.g., using Zod or custom validators).

---

### 7. Missing Loading States in Admin Pages
**Location:** [`apps/web/src/routes/admin/admin-products-page.tsx`](apps/web/src/routes/admin/admin-products-page.tsx)

**Problem:** When `fetchStores()` fails silently (line 32-36), there's no error state shown to the user. The store dropdown would just be empty without explanation.

**Recommendation:** Add proper error states and user feedback for all admin data fetching operations.

---

### 8. No API Request Retry Logic
**Location:** [`packages/api-client/src/shared/request-json.ts`](packages/api-client/src/shared/request-json.ts)

**Problem:** Network requests have no retry mechanism for transient failures (network timeouts, 5xx errors).

**Recommendation:** Implement exponential backoff retry logic for idempotent requests.

---

## 🟢 Low Priority / Optimizations

### 9. No Test Coverage
**Locations:** All `package.json` files

```json
"test": "node --eval \"console.log('No tests for web yet')\""
```

**Problem:** No actual tests exist in the codebase.

**Recommendation:** Add unit tests for:
- Cart reducer logic (`@acme/cart`)
- API client functions
- Form validation
- Utility functions

---

### 10. Duplicate Code Patterns
**Locations:**
- [`apps/web/src/routes/home-page.tsx`](apps/web/src/routes/home-page.tsx)
- [`apps/mobile/src/home-screen.tsx`](apps/mobile/src/home-screen.tsx)

**Problem:** Similar loading/error state patterns are duplicated across web and mobile. The `AsyncState` pattern could be extracted to a shared package.

**Recommendation:** Create a shared `@acme/hooks` or `@acme/utils` package with common async state management.

---

### 11. Inline Styles in Admin Pages
**Location:** [`apps/web/src/routes/admin/admin-products-page.tsx`](apps/web/src/routes/admin/admin-products-page.tsx)

**Problem:** Admin pages use inline styles extensively while the rest of the app uses Tailwind CSS. This creates inconsistency and makes maintenance harder.

**Recommendation:** Refactor admin pages to use Tailwind CSS classes consistent with the rest of the web app.

---

### 12. Unused Variables in useMemo Dependencies
**Location:** [`apps/mobile/src/home-screen.tsx:252`](apps/mobile/src/home-screen.tsx:252)

```tsx
[loadHomeContent, onSelectStore, searchQuery, storesState.errorMessage, storesState.isLoading, storesState.stores]
```

**Problem:** `loadHomeContent` is included in useMemo dependencies but the function itself is stable (wrapped in useCallback with empty deps). This is unnecessary.

---

### 13. Potential Memory Leak in useEffect
**Location:** [`apps/web/src/cart/cart-provider.tsx:51`](apps/web/src/cart/cart-provider.tsx:51)

**Problem:** The useEffect for hydration doesn't have a cleanup function. While not critical, it's a good practice to handle potential cleanup.

---

### 14. Missing Accessibility Features
**Locations:** Various components

**Problems:**
- Some buttons lack proper `aria-label` or `aria-describedby`
- Form inputs in admin pages lack proper `id`-`htmlFor` associations
- Modal dialogs don't trap focus

**Recommendation:** Audit and improve accessibility across all interactive components.

---

## Architecture Recommendations

### 1. Environment Configuration
Create a proper environment configuration system:

```
packages/config/
  src/
    index.ts
    env.ts
```

### 2. Shared Hooks Package
Extract common hooks and utilities:

```
packages/hooks/
  src/
    use-async-state.ts
    use-local-storage.ts
    index.ts
```

### 3. Mobile Cart Implementation
Implement cart functionality for mobile app using the existing `@acme/cart` package with React Native-compatible storage (AsyncStorage).

---

## Summary

| Priority | Count | Category |
|----------|-------|----------|
| 🔴 Critical | 3 | Production blockers |
| 🟡 Medium | 5 | User experience issues |
| 🟢 Low | 6 | Code quality improvements |

---

## Recommended Action Order

1. **Fix hardcoded API URL** - Required for any deployment
2. **Implement mobile cart** - Core feature missing
3. **Fix currency inconsistency** - Business logic issue
4. **Add error boundaries** - Prevent app crashes
5. **Implement search or remove UI** - Non-functional feature
6. **Add cart data validation** - Prevent runtime errors
7. **Add tests** - Long-term stability
8. **Refactor inline styles** - Code consistency