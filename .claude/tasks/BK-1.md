# دار بنشقرون — luxury Moroccan incense brand site (apps/benchekroun)

Plan: `~/.claude/plans/twinkly-riding-ladybug.md`

## Goal
A separate, self-themed web app for the دار بنشقرون brand — NOT styled by the admin
back-office. Gold-on-black, Arabic (RTL) default + French, MAD pricing, cash-on-delivery
checkout, order confirmation. Reuses shared packages for data/cart/i18n.

## Decisions (locked with user)
- Data: backend, scoped to one `STORE_ID` via `@acme/api-client`.
- i18n: server-driven via `@acme/shared` + admin translations API; brand marketing copy is
  app-local (`src/i18n/brand-copy.ts`) since the back-office owns the shared key vocabulary.
- Languages: Arabic default (RTL) + French only. No English switcher.
- Structure: new Vite app under `apps/benchekroun` (port 5174).

## Done (BK-1..BK-3)
- Scaffold: package.json, index.html (Amiri/Cormorant/Cairo fonts, `dir=rtl`), vite.config.ts
  (port 5174, `.ts` only — no stale `.js` twin), tsconfig.json.
- Theme: `src/index.css` — Tailwind v4 `@theme` gold-on-black tokens (`brand-black/gold/ink/…`),
  serif display fonts, `.gold-rule`, `.fade-up`. No ThemeProvider (App.tsx drops it).
- i18n: `src/contexts/i18n-context.tsx` (AR-first, restricted to AR/FR, server bundle +
  baseline fallback) + `src/i18n/brand-copy.ts` (AR/FR bespoke strings) + `use-brand-copy.ts`.
- Cart: `src/cart/*` copied from apps/web, storage key `benchekroun.cart`.
- Pricing: `src/hooks/use-pricing-config.ts`; `src/lib/format.ts` → `formatPrice` (MAD default,
  honours `product.currencyCode`).
- Components: navbar, language-switcher (pill toggle), product-card, cart (button/drawer/
  line-item/quantity-control), checkout (cart-summary, guest-checkout-form with address +
  COD note, order-confirmation in MAD).
- Routes: app-layout (+footer), home-page, product-page, checkout-page; router.tsx
  (`/`, `/products/:productId`, `/checkout`).

## Verified
- `pnpm --filter benchekroun lint` (tsc --noEmit) passes.
- Dev serves on :5174; home renders gold-on-black, RTL, Arabic default, FR/AR switcher.
- With `VITE_STORE_ID=s-fruits` (demo store), grid + product detail load real products and
  prices via the api-client data path.

## Remaining (BK-4)
- **STORE_ID**: backend has only demo grocery stores (`s-fruits`…); no دار بنشقرون store is
  seeded. Set the real id once the store exists (or via `VITE_STORE_ID`).
- **Design pixels**: replace placeholder palette/fonts in `index.css` + tune section layouts
  once the design artifact is shared (couldn't read the auth-gated claude.ai link).
