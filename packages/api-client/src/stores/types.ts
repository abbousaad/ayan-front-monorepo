export const STORE_CATEGORIES = ['fruits', 'vegets', 'ham', 'fish', 'ingrediant'] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export type Store = {
  id: string;
  name: string;
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
