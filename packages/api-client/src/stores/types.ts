import type { LocalizedText } from '../shared/localized';

export const STORE_CATEGORIES = ['fruits', 'vegets', 'ham', 'fish', 'ingrediant'] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export type Store = {
  id: string;
  /** Resolved to the default locale (en-first) for back-compat consumers. */
  name: string;
  /** Full { en, fr, ar } map; populated by the parser. */
  nameLocalized?: LocalizedText;
  category: StoreCategory;
  slug: string;
  imageUrl: string;
};

export type StoresResponse = {
  data: Store[];
};

export type StoreResponse = {
  data: Store;
};
