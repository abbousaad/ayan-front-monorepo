# Frontend Monorepo

pnpm + Turborepo monorepo with a Vite React web app, an Expo mobile app, and a shared TypeScript package.

## Apps and Packages

- `apps/web` — Vite + React + Tailwind + React Router + React Hook Form
- `apps/mobile` — Expo mobile app
- `packages/shared` — shared types, demo data, and pure utilities

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
- `web`
- `mobile` (native iOS export flow)

## Lint

```bash
pnpm lint
```

## Notes

- The shared package is intentionally framework-agnostic so both web and mobile can consume it.
- The Expo app uses an app-local `index.js` entrypoint for better pnpm workspace compatibility.
- `.npmrc` includes a documented fallback for `node-linker=hoisted` if some native dependencies fail under pnpm isolated installs.
