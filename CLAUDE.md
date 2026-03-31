# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- Modules are organized by domain: `src/products/`, `src/stores/`. Each has its own types, validators (Zod), and fetch functions. Import via subpath: `@acme/api-client/products`, `@acme/api-client/stores`, or `@acme/api-client` for everything.

### Cart package (`@acme/cart`)

Pure TypeScript reducer with no framework dependency — safe to share with mobile.

- `cartReducer` handles: `add-item`, `remove-item`, `set-quantity`, `increment-item`, `decrement-item`, `clear-cart`, `hydrate-cart`.
- All mutation actions accept an optional `CartMutationMeta` (`{ updatedAt?: string }`) for optimistic timestamps.
- Selectors (`cart-selectors.ts`) are pure functions: `getCartCount`, `getCartSubtotal`, `getCartLineTotal`, `getCartItem`, `getCartItemQuantity`, `isCartEmpty`.
- `CartItem` requires a `storeId` — multi-store carts are supported by design (items from different stores coexist).

### Cart in the web app

- `CartProvider` (`apps/web/src/cart/cart-provider.tsx`) wraps `useReducer(cartReducer)` and exposes the full API via `CartContext`.
- localStorage hydration: on mount, dispatches `hydrate-cart` with the stored state; sets `isHydrated` to true only after. Save effect guards on `isHydrated` to avoid overwriting storage before hydration completes.
- Access cart anywhere in the web app via the `useCart()` hook (`apps/web/src/cart/use-cart.ts`). Throws if used outside `CartProvider`.

### Web app routing

Defined in `apps/web/src/router.tsx` using `createBrowserRouter`. Single root route `/` renders `AppLayout` (Navbar + Outlet + CartSidebar). Current routes:

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/products` | `ProductsPage` |
| `/stores/:storeId/products` | `StoreProductsPage` |

The `/checkout` route does not exist yet — it is pending implementation.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js` — configuration is done in CSS. Brand colors live in `@acme/shared` as JS constants (`brandColors`), not as Tailwind theme tokens.

### What mobile does NOT have yet

`apps/mobile` imports `@acme/api-client` and `@acme/shared` but does **not** use `@acme/cart`. Cart state management for mobile has not been implemented.
