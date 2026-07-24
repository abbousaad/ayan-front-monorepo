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

  // Home — hero section
  'home.hero.eyebrow': 'Fresh arrivals',
  'home.hero.title': 'Shop neighborhood stores and pantry favorites in one calm space.',
  'home.hero.subtitle':
    'Discover featured stores, browse their collections, and keep scrolling for a full product lineup in the same warm shopping experience.',

  // Home — stores section
  'home.stores.eyebrow': 'Stores',
  'home.stores.title': 'Choose a store',
  'home.stores.errorTitle': "We couldn't load the stores",
  'home.stores.errorAction': 'Reload stores',
  'home.stores.emptyTitle': 'No stores to browse',
  'home.stores.emptyDescription': 'No stores are available yet.',

  // Home — product collection section
  'home.products.eyebrow': 'Product collection',
  'home.products.title': 'Explore everything currently available.',
  'home.products.subtitle':
    'Browse the full catalog below or jump straight into a store to view a focused assortment.',
  'home.products.cta': 'Open products page',
  'home.products.errorTitle': "We couldn't load the product collection",
  'home.products.errorAction': 'Try again',
  'home.products.emptyTitle': 'Nothing to browse just yet',
  'home.products.emptyDescription': 'No products are available yet. Check back after the catalog is populated.',
  'home.section.loadError': 'We could not load this section right now.',

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
