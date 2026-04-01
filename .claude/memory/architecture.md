---
name: Architecture Decisions
description: Key architectural decisions made in this project and the reasoning behind them
type: project
---

## Multi-store cart
Cart items carry a `storeId` and items from different stores coexist in one cart. This was an explicit decision to remove the single-store restriction (commit `477bc70`).

## Cart state: reducer + Context, not Redux/Zustand
`@acme/cart` is a pure TS reducer with no framework dependency — safe for both web and mobile. `CartProvider` in `apps/web` wraps it in React Context. Chosen for simplicity at this scale; no external state library needed.

## Packages resolve from source, no build step in dev
All `packages/*/package.json` point `main`/`exports` at `./src/index.ts`. TypeScript resolves directly. No `tsc` watch needed during development.

## No test runner installed
All `test` scripts are `console.log` stubs. No Vitest/Jest configured yet. `packages/cart` is the highest-priority target when tests are added — pure functions, zero DOM dependency.

## API base URL hardcoded
`packages/api-client/src/client/config.ts` hardcodes `http://localhost:3000/api/v1`. No env variable support yet. Must be fixed before staging/production.

## Tailwind CSS v4
No `tailwind.config.js` — configuration is CSS-first via `@tailwindcss/vite`. Brand colors live in `@acme/shared` as JS constants, not as Tailwind theme tokens.

## Mobile has no cart
`apps/mobile` imports `@acme/api-client` and `@acme/shared` but does not use `@acme/cart`. Cart integration on mobile has not been started.

## Agent team architecture
Six Claude Code subagents defined in `.claude/agents/`: planner (opus), web-react-js-dev (sonnet), mobile-react-native-expo-dev (sonnet), code-reviewer (opus), doc-writer (sonnet), git-manager (haiku). Planner produces task lists; main Claude session orchestrates delegation.
