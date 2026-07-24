# MT-9 — Mobile string extraction pass

## Goal
Replace hardcoded text across the mobile screens/components with `t('...')`,
reusing keys from `enBaseline` (add new ones as needed).

## Scope
- `home-screen.tsx`, `store-products-screen.tsx`, `cart-screen.tsx`,
  `checkout-screen.tsx`, `order-confirmation-screen.tsx`,
  `components/cart-button.tsx`, `components/product-card.tsx`,
  `components/auth-choice-modal.tsx`, `components/screen.tsx`.

## Rules
- Prefer shared keys already added for web; only add mobile-specific keys when needed.
- No layout change beyond text sourcing.

## Done when
- [ ] No hardcoded display strings remain in scoped files
- [ ] `pnpm lint` passes
