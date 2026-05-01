# Mobile Tasks — Active Index

## Conventions for every MT task
- Tick `[x]` in this file the moment the task is done.
- Commit per task (CLAUDE.md: "always commit after completing work").
- Run `pnpm --filter mobile lint` (and any `pnpm lint` for changed packages) before marking done.
- Carry `currencyCode` end-to-end (cart item → cart screen line totals → confirmation screen) — do not regress the recent web currency work.
- Network failure UX: "show inline error, allow retry" applies to every screen that touches the network.
- `ActiveScreen` union in `apps/mobile/App.tsx` evolves across MT-3/4/6/7 — do these in strict sequence on a single branch to avoid merge conflicts.

## Cart & Guest Checkout (feature/mobile-cart)

- [x] MT-1: Cart context provider (AsyncStorage persistence) — *code already exists uncommitted; commit after applying spec gaps*
- [x] MT-2: Wire ProductCard "Add to cart" to cart context
- [x] MT-3: Cart header button with item-count badge
- [x] MT-4: Cart screen (items, quantity controls, totals, proceed)
- [x] MT-5: Auth choice modal (guest vs login/signup placeholder)
- [x] MT-6: Guest checkout screen (form + API call)
- [ ] MT-7: Order confirmation screen
