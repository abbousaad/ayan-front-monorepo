# Active — Admin Panel

**Session start:** 2026-04-01
**Status:** PLAN complete — awaiting user approval before DO phase

- [x] [BUG-3] Cart icon with item count badge not showing in Navbar when cart has items

---

## Context: Previous session

All bug fixes from the prior session are done:
- [x] [BUG-1] CartSidebar + AuthChoiceModal close on guest checkout navigation
- [x] [BUG-2] "Continue shopping" button on OrderConfirmation navigates correctly

---

## 1. Endpoint Audit

Full inventory of every endpoint in `docs/api/openapi.json`, grouped by auth requirement.

### 1A. Public — No Authentication Required

| Method | Path | Summary |
|--------|------|---------|
| GET | `/public` | Public test route |
| GET | `/public/db-status` | Database connectivity check |
| POST | `/public/orders` | Create a guest order (no auth) |
| GET | `/products` | Get all products (optionally filtered by `?storeId`) |
| GET | `/products/{id}` | Get product by id |
| GET | `/stores` | Get all stores |
| GET | `/stores/{id}` | Get store by id |
| GET | `/stores/{id}/products` | Get products for one store |
| POST | `/auth/login` | Issue JWT — body: `{ username, password }` → response: `{ data: { token, user } }` |
| POST | `/auth/register` | Register a new user — body: `{ username, password }` |

### 1B. Authenticated (any valid JWT)

| Method | Path | Auth | Summary |
|--------|------|------|---------|
| GET | `/protected` | Bearer JWT | Protected test route |
| GET | `/protected/users/{id}` | Bearer JWT | Get user profile by id |
| PATCH | `/auth/change-password` | Bearer JWT | Change own password — body: `{ currentPassword, newPassword }` |
| GET | `/me/locations` | Bearer JWT | List saved locations for authenticated user |
| POST | `/me/locations` | Bearer JWT | Create saved location — body: `{ label, address?, latitude?, longitude? }` |
| GET | `/me/orders` | Bearer JWT | List orders for authenticated user |
| POST | `/orders` | Bearer JWT | Create authenticated order — body: `{ locationId, deliveryMode, scheduledAt?, couponCode?, items[] }` |

### 1C. Superadmin-Only (Bearer JWT + role: `superadmin`)

| Method | Path | Summary | Request Body / Params |
|--------|------|---------|----------------------|
| POST | `/products` | Create product | multipart/form-data: `storeId, name, price, stock, description?, unit?, image?` |
| PATCH | `/products/{id}` | Edit product | JSON: `{ storeId?, name?, price?, stock?, description?, unit? }` |
| DELETE | `/products/{id}` | Delete product | path param `id` |
| POST | `/stores` | Create store | multipart/form-data: `name, category, slug, image?` |
| PATCH | `/stores/{id}` | Update store | JSON: `{ name?, category?, slug? }` |
| DELETE | `/stores/{id}` | Delete store | path param `id` |
| GET | `/coupons` | List all coupons | — |
| POST | `/coupons` | Create coupon | JSON: `{ code, discountType, discountValue, startsAt, endsAt, isActive?, maxUses? }` |
| PATCH | `/coupons/{id}` | Update coupon | JSON: `{ code?, discountType?, discountValue?, startsAt?, endsAt?, isActive?, maxUses? }` |
| DELETE | `/coupons/{id}` | Delete coupon | path param `id` |
| GET | `/orders/pricing-config` | Get pricing configuration | — |
| PATCH | `/orders/pricing-config` | Update pricing configuration | JSON: `{ deliveryFee?, serviceFeeRate?, taxRate?, discountRate? }` |
| PATCH | `/orders/{id}/confirm` | Move order → `onpreparation` | path param `id` |

### 1D. Livreur-Only (Bearer JWT + role: `livreur`)

| Method | Path | Summary |
|--------|------|---------|
| PATCH | `/orders/{id}/accept-delivery` | Move order → `ondelivery` |
| PATCH | `/orders/{id}/mark-paid` | Move order → `paid` |

### Key Schema Notes

- **Auth:** JWT Bearer token, returned by `POST /auth/login` as `data.token`. User has `role` field: `"user" | "superadmin" | "livreur"`.
- **`mustChangePassword`:** Boolean on User — admin must prompt password change if true.
- **Store categories:** `"fruits" | "vegets" | "ham" | "fish" | "ingrediant"`
- **Product units:** `"g" | "kg" | "ml" | "l" | "unit"`
- **Order status flow:** `pending` → `onpreparation` (confirm, superadmin) → `ondelivery` (accept-delivery, livreur) → `paid` (mark-paid, livreur)
- **Coupon discount types:** `"fixed" | "percentage"`
- **Image uploads:** Products and stores use `multipart/form-data` with a binary `image` field.
- **PricingConfig schema:** `{ deliveryFee, serviceFeeRate, taxRate, discountRate }` — all numbers.

---

## 2. Admin Panel MVP Scope

Based on the superadmin endpoints, the MVP admin panel covers four domains:

### Screen 1 — Admin Login
Single login form using `POST /auth/login`. On success, stores JWT + user in sessionStorage. Guards all `/admin/*` routes. If `mustChangePassword` is true, redirect to a change-password screen.

### Screen 2 — Dashboard (landing)
Simple stat tiles with no dedicated API call — composed from data already fetched by other screens. Shows: total stores count, total products count, total coupons count, pending orders count.

### Screen 3 — Stores Management (`/admin/stores`)
- Table of all stores: `GET /stores` — columns: name, category, slug, image thumbnail.
- "New store" button → slide-over / modal form: `POST /stores` (multipart, with image).
- Row actions: Edit (inline form → `PATCH /stores/{id}`), Delete (confirm → `DELETE /stores/{id}`).

### Screen 4 — Products Management (`/admin/products`)
- Table of all products: `GET /products` — columns: name, store, price, stock, unit, image thumbnail.
- Store filter dropdown populated from `GET /stores`.
- "New product" button → form: `POST /products` (multipart, with image, storeId dropdown).
- Row actions: Edit (JSON patch → `PATCH /products/{id}`), Delete → `DELETE /products/{id}`.

### Screen 5 — Coupons Management (`/admin/coupons`)
- Table of all coupons: `GET /coupons` — columns: code, type, value, active, starts, ends, usedCount/maxUses.
- "New coupon" button → form: `POST /coupons`.
- Row actions: Edit (→ `PATCH /coupons/{id}`), Toggle active (inline PATCH), Delete (→ `DELETE /coupons/{id}`).

### Screen 6 — Orders Management (`/admin/orders`)
**Note:** The spec does not expose a `GET /orders` endpoint for superadmin to list all orders. However the spec has `GET /me/orders` for the authenticated user's own orders. The admin order view is intentionally limited to the order action endpoints available: `PATCH /orders/{id}/confirm`. A full order list may require a future API endpoint. For MVP: display a text input where admin enters an order ID and confirms it (moves it to `onpreparation`). This is the only admin order action available.

### Screen 7 — Pricing Configuration (`/admin/pricing`)
- Read and display pricing config: `GET /orders/pricing-config`.
- Edit form with four fields: deliveryFee, serviceFeeRate, taxRate, discountRate.
- Save button → `PATCH /orders/pricing-config`.

### Screen 8 — Change Password (`/admin/change-password`)
- Triggered if `mustChangePassword === true` on login, or accessible from nav.
- Uses `PATCH /auth/change-password`.

---

## 3. Architecture Decisions

### 3A. Where does the admin panel live?

**Decision: Option A — New route subtree `/admin/*` inside `apps/web`.**

Rationale:
- The codebase is a monorepo but `apps/admin` is too heavyweight for the current scale. A new app means duplicating Vite config, Tailwind setup, port management, and Turborepo pipeline entries.
- All the API types and Zod validators already live in `@acme/api-client`. A new app would consume the same package — no isolation benefit.
- The admin UI is server-protected behind a JWT role check, not an entirely separate deployment concern at this stage.
- One app, one domain (`localhost:5173`). Admin panel at `/admin/*`, consumer storefront at `/`.
- A separate `AdminLayout` component (no Navbar, CartSidebar) wraps the `/admin` subtree cleanly.
- If the panel grows to warrant isolation in future, extracting to `apps/admin` is straightforward.

### 3B. How is admin auth handled?

- `POST /auth/login` returns `{ data: { token: string, user: User } }`.
- The JWT and user object are stored in `sessionStorage` (not localStorage) so the session ends on tab/browser close. This is appropriate for an admin panel.
- An `AdminAuthContext` (similar to `CartContext` pattern) holds `{ token, user, login(), logout() }`.
- Route guards: a `RequireAdmin` wrapper component checks `user.role === "superadmin"` before rendering children. If not authenticated, redirect to `/admin/login`.
- All admin API calls send the JWT as `Authorization: Bearer <token>` via a custom `fetch` wrapper or through the `ApiClientConfig` injection pattern already established in `@acme/api-client`.
- `mustChangePassword` flag: if truthy after login, redirect to `/admin/change-password` before allowing access to any other admin route.

### 3C. Does `@acme/api-client` need a new module?

**Yes — an `admin` module (`packages/api-client/src/admin/`) is required.**

The existing modules (`products`, `stores`, `orders`) only cover public/read operations. The admin-specific mutations (create/edit/delete stores, products, coupons; confirm orders; pricing config) need new fetch functions with:
- Bearer token header injection via `ApiClientConfig`
- `multipart/form-data` support for image uploads (products, stores)
- Zod validators for response shapes
- Organized submodules: `admin/stores.ts`, `admin/products.ts`, `admin/coupons.ts`, `admin/orders.ts`, `admin/pricing.ts`, `admin/auth.ts`

The existing `requestJson()` helper is sufficient for JSON endpoints. A new `requestMultipart()` helper is needed for the `multipart/form-data` image upload endpoints.

---

## 4. Task Breakdown

Tasks are ordered. Each is one DO cycle (implement + review). Dependencies are listed.

---

### [x] AT-1 — Admin API client: auth module
**Title:** Add `login()` and `changePassword()` to `@acme/api-client`

**Files to create/edit:**
- `packages/api-client/src/admin/auth.ts` (new) — `login()` and `changePassword()` fetch functions
- `packages/api-client/src/admin/types.ts` (new) — `AdminLoginResponse`, `ChangePasswordRequest` types
- `packages/api-client/src/admin/validators.ts` (new) — Zod schemas for auth responses
- `packages/api-client/src/admin/index.ts` (new) — barrel export
- `packages/api-client/src/index.ts` (edit) — re-export `@acme/api-client/admin`
- `packages/api-client/package.json` (edit) — add `"./admin"` subpath export

**API endpoints used:**
- `POST /auth/login`
- `PATCH /auth/change-password`

**Dependencies:** none

---

### [x] AT-2 — Admin API client: multipart helper + stores/products CRUD
**Title:** Add `requestMultipart()` helper and admin stores/products mutation functions

**Files to create/edit:**
- `packages/api-client/src/shared/request-multipart.ts` (new) — `requestMultipart()` for `multipart/form-data` with bearer token
- `packages/api-client/src/admin/stores.ts` (new) — `createStore()`, `updateStore()`, `deleteStore()`
- `packages/api-client/src/admin/products.ts` (new) — `createProduct()`, `updateProduct()`, `deleteProduct()`
- `packages/api-client/src/admin/types.ts` (edit) — add `CreateStoreInput`, `UpdateStoreInput`, `CreateProductInput`, `UpdateProductInput`
- `packages/api-client/src/admin/validators.ts` (edit) — add response validators for store/product mutations
- `packages/api-client/src/admin/index.ts` (edit) — export stores/products functions

**API endpoints used:**
- `POST /stores`, `PATCH /stores/{id}`, `DELETE /stores/{id}`
- `POST /products`, `PATCH /products/{id}`, `DELETE /products/{id}`

**Dependencies:** AT-1

---

### [x] AT-3 — Admin API client: coupons + pricing config + order confirm
**Title:** Add admin coupons, pricing config, and order-confirm functions

**Files to create/edit:**
- `packages/api-client/src/admin/coupons.ts` (new) — `listCoupons()`, `createCoupon()`, `updateCoupon()`, `deleteCoupon()`
- `packages/api-client/src/admin/pricing.ts` (new) — `getPricingConfig()`, `updatePricingConfig()`
- `packages/api-client/src/admin/orders.ts` (new) — `confirmOrder()`
- `packages/api-client/src/admin/types.ts` (edit) — `Coupon`, `CouponInput`, `PricingConfig` types (re-use OpenAPI schema shapes)
- `packages/api-client/src/admin/validators.ts` (edit) — Zod schemas for coupon/pricing responses
- `packages/api-client/src/admin/index.ts` (edit) — export all

**API endpoints used:**
- `GET /coupons`, `POST /coupons`, `PATCH /coupons/{id}`, `DELETE /coupons/{id}`
- `GET /orders/pricing-config`, `PATCH /orders/pricing-config`
- `PATCH /orders/{id}/confirm`

**Dependencies:** AT-1

---

### AT-4 — Admin auth context + route guards
**Title:** Build `AdminAuthContext`, `AdminAuthProvider`, `RequireAdmin` guard, and admin routes skeleton

**Files to create/edit:**
- `apps/web/src/admin/admin-auth-context.tsx` (new) — context type: `{ token, user, login(), logout(), isLoading }`
- `apps/web/src/admin/admin-auth-provider.tsx` (new) — `AdminAuthProvider` wrapping `useReducer`/`useState`; sessionStorage persistence; `mustChangePassword` detection
- `apps/web/src/admin/use-admin-auth.ts` (new) — `useAdminAuth()` hook (throws if outside provider)
- `apps/web/src/admin/require-admin.tsx` (new) — route guard component; redirects to `/admin/login` if not authenticated
- `apps/web/src/admin/admin-layout.tsx` (new) — `AdminLayout`: sidebar nav (links to Stores, Products, Coupons, Pricing, Orders), header with logout button, no consumer Navbar/CartSidebar
- `apps/web/src/router.tsx` (edit) — add `/admin` subtree with `AdminLayout` as parent, nested routes: `/admin/login`, `/admin`, `/admin/stores`, `/admin/products`, `/admin/coupons`, `/admin/pricing`, `/admin/orders`, `/admin/change-password`; all except login wrapped in `RequireAdmin`

**API endpoints used:**
- `POST /auth/login` (via AT-1 `login()`)

**Dependencies:** AT-1

---

### AT-5 — Admin Login screen
**Title:** Build `/admin/login` page

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-login-page.tsx` (new) — login form with `username` + `password` fields; calls `login()` from `AdminAuthContext`; shows error on 401; redirects to `/admin` on success (or `/admin/change-password` if `mustChangePassword`)

**API endpoints used:**
- `POST /auth/login`

**Dependencies:** AT-1, AT-4

---

### AT-6 — Admin Stores management screen
**Title:** Build `/admin/stores` — list, create, edit, delete stores

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-stores-page.tsx` (new) — stores table; "New store" button; inline delete confirm dialog
- `apps/web/src/components/admin/stores/store-form.tsx` (new) — shared create/edit form: name, category select, slug, image file input; handles `multipart/form-data`
- `apps/web/src/components/admin/stores/store-row.tsx` (new) — table row with thumbnail, edit/delete actions
- `apps/web/src/components/admin/shared/admin-table.tsx` (new) — reusable table wrapper component (thead + tbody, loading state)
- `apps/web/src/components/admin/shared/confirm-dialog.tsx` (new) — reusable delete-confirm modal

**API endpoints used:**
- `GET /stores` (existing client function)
- `POST /stores`, `PATCH /stores/{id}`, `DELETE /stores/{id}` (via AT-2)

**Dependencies:** AT-2, AT-4, AT-5

---

### AT-7 — Admin Products management screen
**Title:** Build `/admin/products` — list, create, edit, delete products

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-products-page.tsx` (new) — products table; store filter dropdown; "New product" button
- `apps/web/src/components/admin/products/product-form.tsx` (new) — create/edit form: storeId (dropdown from `GET /stores`), name, price, stock, unit (select), description, image file input
- `apps/web/src/components/admin/products/product-row.tsx` (new) — table row with thumbnail, price, stock, edit/delete actions

**API endpoints used:**
- `GET /products` (existing), `GET /stores` (existing)
- `POST /products`, `PATCH /products/{id}`, `DELETE /products/{id}` (via AT-2)

**Dependencies:** AT-2, AT-4, AT-5, AT-6 (reuses `AdminTable`, `ConfirmDialog`)

---

### AT-8 — Admin Coupons management screen
**Title:** Build `/admin/coupons` — list, create, edit, delete, toggle coupons

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-coupons-page.tsx` (new) — coupons table; "New coupon" button
- `apps/web/src/components/admin/coupons/coupon-form.tsx` (new) — create/edit form: code, discountType (radio: fixed/percentage), discountValue, startsAt, endsAt, isActive (toggle), maxUses (nullable int)
- `apps/web/src/components/admin/coupons/coupon-row.tsx` (new) — table row; inline active toggle (PATCH isActive); edit; delete

**API endpoints used:**
- `GET /coupons`, `POST /coupons`, `PATCH /coupons/{id}`, `DELETE /coupons/{id}` (via AT-3)

**Dependencies:** AT-3, AT-4, AT-5, AT-6 (reuses `AdminTable`, `ConfirmDialog`)

---

### AT-9 — Admin Pricing configuration screen
**Title:** Build `/admin/pricing` — read and update pricing config

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-pricing-page.tsx` (new) — fetches pricing config on mount; displays four editable number fields (deliveryFee, serviceFeeRate, taxRate, discountRate); save button with success/error feedback

**API endpoints used:**
- `GET /orders/pricing-config`, `PATCH /orders/pricing-config` (via AT-3)

**Dependencies:** AT-3, AT-4, AT-5

---

### AT-10 — Admin Orders screen (confirm action)
**Title:** Build `/admin/orders` — confirm pending orders by ID

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-orders-page.tsx` (new) — note: no list-all-orders endpoint exists in the spec. Screen displays: (a) an order-ID input + "Confirm order" button that calls `PATCH /orders/{id}/confirm`; (b) a clear success/error message with the transition result. Include a note in the UI: "Full order list view requires a future `GET /orders` admin endpoint."

**API endpoints used:**
- `PATCH /orders/{id}/confirm` (via AT-3)

**Dependencies:** AT-3, AT-4, AT-5

---

### AT-11 — Change Password screen
**Title:** Build `/admin/change-password` page

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-change-password-page.tsx` (new) — form: currentPassword, newPassword; calls `PATCH /auth/change-password`; on success, clears `mustChangePassword` flag in `AdminAuthContext` and redirects to `/admin`

**API endpoints used:**
- `PATCH /auth/change-password` (via AT-1)

**Dependencies:** AT-1, AT-4, AT-5

---

### AT-12 — Admin Dashboard landing screen
**Title:** Build `/admin` dashboard with summary stat tiles

**Files to create/edit:**
- `apps/web/src/routes/admin/admin-dashboard-page.tsx` (new) — fetches `GET /stores`, `GET /products`, `GET /coupons` in parallel; renders stat tiles: total stores, total products, total coupons, active coupons count. No dedicated dashboard API.

**API endpoints used:**
- `GET /stores` (existing), `GET /products` (existing), `GET /coupons` (via AT-3)

**Dependencies:** AT-3, AT-4, AT-5, AT-6, AT-7, AT-8 (all screens must exist before dashboard links to them)

---

### AT-13 — CLAUDE.md + docs update
**Title:** Update CLAUDE.md and project docs to reflect admin panel

**Files to create/edit:**
- `CLAUDE.md` (edit) — add admin routes table, `AdminAuthContext` description, new `@acme/api-client/admin` subpath
- `.claude/memory/project-status.md` (edit) — record admin panel as in-progress / complete
- `.claude/memory/architecture.md` (edit) — document admin-in-web decision and rationale

**Dependencies:** AT-12 (all tasks complete)

---

## 5. Implementation Order Summary

```
AT-1  →  AT-2  →  AT-6  →  AT-7
     ↘           ↗
      AT-3  →  AT-8  →  AT-9  →  AT-10
     ↘
      AT-4  →  AT-5  →  (all screens unlock)
                        AT-11  →  AT-12  →  AT-13
```

Strictly sequential critical path:
**AT-1 → AT-2 / AT-3 (parallel) → AT-4 → AT-5 → AT-6 / AT-7 / AT-8 / AT-9 / AT-10 / AT-11 (parallel) → AT-12 → AT-13**

---

## 6. Pending backlog items (carry-over, do before admin if time)

These are from previous session and have no dependency on the admin work. They are low-risk fixes:

- [ ] Bring `PublicOrder` type to full OpenAPI spec fidelity — add `guestEmail`, `serviceFee`, `taxAmount`, `discountAmount`, `couponId`, `couponCode`, `scheduledAt` optional fields to `packages/api-client/src/orders/types.ts` and `validators.ts`
- [ ] Add `aria-labelledby` to `role="dialog"` in `apps/web/src/components/checkout/auth-choice-modal.tsx`

---

PLAN complete. Awaiting user approval before DO phase begins.
