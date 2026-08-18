import type { LocalizedText } from '../shared/localized';

export const PRODUCT_UNITS = ['g', 'kg', 'ml', 'l', 'unit'] as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export type Product = {
  id: string;
  storeId: string;
  /** Resolved to the default locale (en-first) for back-compat consumers. */
  name: string;
  /** Full { en, fr, ar } map; populated by the parser. */
  nameLocalized?: LocalizedText;
  price: number;
  currencyCode: string;
  stock: number;
  /** Resolved to the default locale (en-first). */
  description: string | null;
  descriptionLocalized?: LocalizedText;
  imageUrl: string;
  images?: string[];
  unit: ProductUnit;
};

export type ProductsQuery = {
  storeId?: string;
};

export type ProductsResponse = {
  data: Product[];
};

export type ProductResponse = {
  data: Product;
};
