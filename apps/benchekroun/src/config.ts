/**
 * دار بنشقرون is a single house, but its catalog spans multiple backend stores
 * which are surfaced as browsable "categories" on the home page (see
 * `CategoryChips` + `home-page.tsx`). There is therefore no single bound store id.
 */

/** Everything on this site is priced in Moroccan dirham. */
export const CURRENCY_CODE = 'MAD';

/**
 * Social + direct-dial links shown in the footer.
 * ⚠ PLACEHOLDER values — swap for the real accounts before launch.
 * `phone` must be E.164 (no spaces) for the tel: link; `phoneLabel` is display.
 */
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/darbenchekroun',
  phone: '+212500000000',
  phoneLabel: '+212 5 00 00 00 00'
};
