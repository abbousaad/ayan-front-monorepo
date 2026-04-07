# CLAUDE.md

## Rules

- **Plan first** for features. No plan needed for bugs — just fix and commit.
- **Always commit** after completing work.
- If a component is used by both web and mobile, put it in a `packages/` package so both apps can import it.
- Packages resolve from source (`./src/index.ts`) — no build step in dev.
- **Tasks live in `.claude/tasks/`** — `active.md` is the index, each subtask gets its own detailed `.md` file.

## Commands

```bash
pnpm dev                      # all apps
pnpm --filter web dev         # web only
pnpm --filter mobile dev      # mobile only
pnpm build                    # build all
pnpm lint                     # type-check all
```

No test runner yet — `pnpm test` is a stub.

## Monorepo layout

```
apps/web          — React 19, Vite, React Router v7, Tailwind v4
apps/mobile       — Expo 54, React Native (iOS-primary)
packages/cart          — @acme/cart       pure TS reducer + selectors
packages/api-client    — @acme/api-client fetch + Zod, subpaths: /products, /stores, /orders, /admin
packages/shared        — @acme/shared     brand colors, demo data
```
