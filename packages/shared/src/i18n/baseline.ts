/**
 * The canonical English baseline for every user-facing string in the apps.
 *
 * This object is the single source of truth for translation *keys*: its keys
 * drive the `TranslationKey` union, and its values are the fallback shown when
 * the server-driven translations are missing a key (or fail to load entirely),
 * mirroring `applyDefaultTheme` in the web theme context.
 *
 * Add every new string here (namespaced by area) before referencing it via
 * `t('...')` in the apps. The string-extraction tasks (AT-26 / MT-9) grow this
 * object as hardcoded text is replaced.
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
  'nav.logoTitle': 'Ayan Market',
  'nav.logoSubtitle': 'Fresh essentials',
  'nav.about': 'About',
  'nav.register': 'Sign up',
  'nav.login': 'Log in',
  'nav.language': 'Language',

  // ── Home ────────────────────────────────────────────────────────────────
  'home.freshArrivals': 'Fresh arrivals',
  'home.stores': 'Stores',
  'home.chooseStore': 'Choose a store',
  'home.productCollection': 'Product collection',

  // ── Products ────────────────────────────────────────────────────────────
  'products.title': 'All Products',
  'products.availableNow': 'Available now',
  'product.addToCart': 'Add to cart',
  'product.outOfStock': 'Out of stock',

  // ── Cart ────────────────────────────────────────────────────────────────
  'cart.title': 'Your cart',
  'cart.empty': 'Your cart is empty.',
  'cart.subtotal': 'Subtotal',
  'cart.checkout': 'Checkout',

  // ── Checkout ────────────────────────────────────────────────────────────
  'checkout.title': 'Checkout',
  'checkout.placeOrder': 'Place order',

  // ── Order confirmation ──────────────────────────────────────────────────
  'order.confirmed': 'Order confirmed',
  'order.backToHome': 'Back to home'
} as const;

export type TranslationKey = keyof typeof enBaseline;
