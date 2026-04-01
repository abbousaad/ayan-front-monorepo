# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Team Workflow — Plan → Do → Check → Iterate

Every non-trivial task follows this loop. No step is skipped.

```
PLAN   → planner             reads memory + backlog, decomposes, writes active.md
DO     → web / mobile dev    implements, lints, updates active.md
CHECK  → code-reviewer       reviews — verdict: APPROVE or REQUEST CHANGES
         ↑_____________________↓  (loop back if REQUEST CHANGES)
ITERATE → doc-writer         updates CLAUDE.md, docs, OpenAPI spec
        → git-manager        commits with issue ref, opens PR
        → planner            closes task in active.md, pulls next from backlog
```

**The gate:** `git-manager` and `doc-writer` only run after `code-reviewer` returns `APPROVE` or `APPROVE WITH SUGGESTIONS`. A `REQUEST CHANGES` verdict sends work back to the DO agent.

**Task files:**
- `.claude/tasks/active.md` — current session work (planner writes, agents update status)
- `.claude/tasks/backlog.md` — upcoming features, priority ordered
- `.claude/memory/project-status.md` — persistent state across sessions

---

## Commands

All commands run from the repo root via Turborepo unless targeting a specific workspace.

```bash
# Run all apps in dev mode
pnpm dev

# Run a single app
pnpm --filter web dev
pnpm --filter mobile dev

# Build all
pnpm build

# Type-check all packages
pnpm lint

# Type-check a single package
pnpm --filter @acme/cart lint

# Run tests (currently stubs — no test runner is configured)
pnpm test
```

There is no test runner yet. The `test` scripts are placeholder `console.log` stubs.

## Architecture

### Monorepo layout

```
apps/web       — React 19 SPA (Vite + React Router v7 + Tailwind CSS v4)
apps/mobile    — Expo 54 / React Native app (iOS-primary)
packages/cart       — @acme/cart     pure TS cart reducer + selectors, no React
packages/api-client — @acme/api-client  fetch-based API client with Zod validation
packages/shared     — @acme/shared   brand colors, demo data (no dependencies)
```

Packages are consumed directly from source via TypeScript path resolution — no build step is needed during development. Each package's `main`/`exports` points at `./src/index.ts`.

### API client (`@acme/api-client`)

- Base URL is hardcoded to `http://localhost:3000/api/v1` in `packages/api-client/src/client/config.ts`. There is no env override yet.
- All requests go through `requestJson()`, which accepts an `ApiClientConfig` object so callers can inject a custom `fetch` or headers.
- Modules are organized by domain: `src/products/`, `src/stores/`, `src/orders/`. Each has its own types, validators (Zod), and fetch functions. Import via subpath: `@acme/api-client/products`, `@acme/api-client/stores`, `@acme/api-client/orders`, or `@acme/api-client` for everything.
- `@acme/api-client/orders` exports `createPublicOrder()` (posts to `POST /public/orders`), the `PublicOrder` type, and the `CreateOrderPayload` type. Note: `PublicOrder` currently lacks several optional spec fields (`guestEmail`, `serviceFee`, `taxAmount`, `discountAmount`, `couponId`, `couponCode`, `scheduledAt`) — full spec fidelity is a backlog item.

### Cart package (`@acme/cart`)

Pure TypeScript reducer with no framework dependency — safe to share with mobile.

- `cartReducer` handles: `add-item`, `remove-item`, `set-quantity`, `increment-item`, `decrement-item`, `clear-cart`, `hydrate-cart`.
- All mutation actions accept an optional `CartMutationMeta` (`{ updatedAt?: string }`) for optimistic timestamps.
- Selectors (`cart-selectors.ts`) are pure functions: `getCartCount`, `getCartSubtotal`, `getCartLineTotal`, `getCartItem`, `getCartItemQuantity`, `isCartEmpty`.
- `CartItem` requires a `storeId` — multi-store carts are supported by design (items from different stores coexist).

### Cart in the web app

- `CartProvider` (`apps/web/src/cart/cart-provider.tsx`) wraps `useReducer(cartReducer)` and exposes the full API via `CartContext`. It is mounted in `apps/web/src/App.tsx`, wrapping the entire router so cart state is available on all routes including `/checkout`.
- localStorage hydration: on mount, dispatches `hydrate-cart` with the stored state; sets `isHydrated` to true only after. Save effect guards on `isHydrated` to avoid overwriting storage before hydration completes.
- Access cart anywhere in the web app via the `useCart()` hook (`apps/web/src/cart/use-cart.ts`). Throws if used outside `CartProvider`.
- Guest checkout flow: `CartSidebar` "Continue" button opens `AuthChoiceModal` → user selects "Guest" → navigates to `/checkout` (`CheckoutPage`) → on successful order submission shows `OrderConfirmation`.

### Web app routing

Defined in `apps/web/src/router.tsx` using `createBrowserRouter`. Single root route `/` renders `AppLayout` (Navbar + Outlet + CartSidebar). Current routes:

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/products` | `ProductsPage` |
| `/stores/:storeId/products` | `StoreProductsPage` |
| `/checkout` | `CheckoutPage` (`apps/web/src/routes/checkout-page.tsx`) |

`CheckoutPage` renders `CheckoutCartSummary` and `GuestCheckoutForm` side by side. On successful order submission it replaces those with `OrderConfirmation`.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js` — configuration is done in CSS. Brand colors live in `@acme/shared` as JS constants (`brandColors`), not as Tailwind theme tokens.

### What mobile does NOT have yet

`apps/mobile` imports `@acme/api-client` and `@acme/shared` but does **not** use `@acme/cart`. Cart state management for mobile has not been implemented.
