/**
 * This site is bound to a single store — دار بنشقرون. All catalog calls are
 * scoped to this id. Override without a code change via `VITE_STORE_ID`.
 *
 * TODO: set the real store id/slug for دار بنشقرون from the backend.
 */
export const STORE_ID: string = import.meta.env.VITE_STORE_ID ?? 'benchekroun';

/** Everything on this site is priced in Moroccan dirham. */
export const CURRENCY_CODE = 'MAD';
