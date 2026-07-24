/**
 * The canonical English baseline for every user-facing string in the apps.
 *
 * This object is the single source of truth for translation *keys*: its keys
 * drive the `TranslationKey` union, and its values are the fallback shown when
 * the server-driven translations are missing a key (or fail to load entirely),
 * mirroring `applyDefaultTheme` in the web theme context.
 *
 * IMPORTANT: these keys must stay aligned with the keys the backend serves from
 * `GET /settings/translations` — otherwise `t(key)` falls back to English instead
 * of resolving the server's FR/AR strings. The set below mirrors the backend's
 * current vocabulary (nav.* / button.* / home.* / cart.* / product.*). Add new
 * keys here AND in the backend seed together.
 */
export const enBaseline = {
  // ── Common ──────────────────────────────────────────────────────────────
  'common.loading': 'Loading…',
  'common.error': 'Something went wrong.',
  'common.retry': 'Retry',
  'common.back': 'Back',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.close': 'Close',

  // ── Navbar ──────────────────────────────────────────────────────────────
  'nav.about': 'About',
  'nav.products': 'Products',
  'nav.cart': 'Cart',

  // ── Buttons ─────────────────────────────────────────────────────────────
  'button.login': 'Login',
  'button.logout': 'Logout',
  'button.register': 'Register',

  // ── Home ────────────────────────────────────────────────────────────────
  'home.welcome': 'Welcome',
  'home.featured': 'Featured Products',

  // ── Product ─────────────────────────────────────────────────────────────
  'product.price': 'Price',
  'product.stock': 'In Stock',
  'product.addToCart': 'Add to Cart',

  // ── Cart ────────────────────────────────────────────────────────────────
  'cart.empty': 'Your cart is empty',
  'cart.checkout': 'Checkout',
  'cart.continue': 'Continue Shopping'
} as const;

export type TranslationKey = keyof typeof enBaseline;
