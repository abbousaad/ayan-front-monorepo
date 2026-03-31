# Frontend Monorepo

pnpm + Turborepo monorepo with a Vite React web app, an Expo mobile app, and shared TypeScript packages.

## Apps and Packages

- `apps/web` — Vite + React + Tailwind + React Router + React Hook Form
- `apps/mobile` — Expo mobile app
- `packages/shared` — shared types, demo data, and pure utilities
- `packages/api-client` — API client for products and stores
- `packages/cart` — cart state management (reducer, selectors, types)

## Requirements

- Node.js 22+
- pnpm 10+

## Install

```bash
pnpm install
```

## Run

### Start all dev tasks through Turbo

```bash
pnpm dev
```

### Start individual apps

```bash
pnpm --filter web dev --host 0.0.0.0
pnpm --filter mobile dev
```

Web runs at `http://localhost:5173/` and Expo Metro runs at `http://localhost:8081`.

### Stop local dev servers

```bash
pkill -f "vite --host 0.0.0.0"
lsof -t -nP -iTCP:8081 -sTCP:LISTEN | xargs kill
```

## Build

```bash
pnpm build
```

This builds:
- `@acme/shared`
- `@acme/api-client`
- `@acme/cart`
- `web`
- `mobile` (native iOS export flow)

## Lint

```bash
pnpm lint
```

## Cart Feature

The cart supports adding products from multiple stores. State is managed via a reducer in `packages/cart` and persisted to localStorage.

**Key files:**
- `packages/cart/src/cart-reducer.ts` — add, remove, increment, decrement, clear
- `packages/cart/src/cart-selectors.ts` — count, subtotal, line total, item lookup
- `apps/web/src/cart/cart-provider.tsx` — React context provider
- `apps/web/src/components/cart/` — sidebar, button, line item, quantity control

## Notes

- The shared package is intentionally framework-agnostic so both web and mobile can consume it.
- The Expo app uses an app-local `index.js` entrypoint for better pnpm workspace compatibility.
- `.npmrc` includes a documented fallback for `node-linker=hoisted` if some native dependencies fail under pnpm isolated installs.
