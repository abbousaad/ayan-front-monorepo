import { ApiClientError } from '../shared/api-client-error';
import { isLocalizedInput, resolveLocalizedText, toLocalizedText } from '../shared/localized';

import { PRODUCT_UNITS, type Product, type ProductResponse, type ProductsResponse } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isProductUnit = (value: unknown): value is Product['unit'] =>
  typeof value === 'string' && PRODUCT_UNITS.includes(value as Product['unit']);

const isProduct = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.storeId === 'string' &&
    isLocalizedInput(value.name) &&
    typeof value.price === 'number' &&
    (value.currencyCode === undefined || typeof value.currencyCode === 'string') &&
    typeof value.stock === 'number' &&
    typeof value.imageUrl === 'string' &&
    (value.description === null ||
      value.description === undefined ||
      isLocalizedInput(value.description)) &&
    isProductUnit(value.unit)
  );
};

// The API delivers name/description as a plain string (legacy) or an
// { en, fr, ar } map. Keep the flat `name`/`description` (resolved en-first) for
// existing consumers and attach the full localized map for locale-aware apps.
const toProduct = (value: Record<string, unknown>): Product => {
  const nameLocalized = toLocalizedText(value.name);
  const descriptionLocalized = toLocalizedText(value.description);
  const description = resolveLocalizedText(descriptionLocalized, 'en') || null;

  return {
    id: value.id as string,
    storeId: value.storeId as string,
    name: resolveLocalizedText(nameLocalized, 'en'),
    nameLocalized,
    price: value.price as number,
    currencyCode: (value.currencyCode as string | undefined) ?? 'USD',
    stock: value.stock as number,
    description,
    descriptionLocalized,
    imageUrl: value.imageUrl as string,
    images: Array.isArray(value.images)
      ? (value.images.filter((image) => typeof image === 'string') as string[])
      : undefined,
    unit: value.unit as Product['unit']
  };
};

export const parseProductsResponse = (value: unknown): ProductsResponse => {
  if (!isRecord(value) || !Array.isArray(value.data) || !value.data.every(isProduct)) {
    throw new ApiClientError({
      code: 'INVALID_PRODUCTS_RESPONSE',
      message: 'The products response did not match the expected format.'
    });
  }

  return {
    data: value.data.map((product) => toProduct(product))
  };
};

export const parseProductResponse = (value: unknown): ProductResponse => {
  if (isRecord(value) && 'data' in value && isProduct(value.data)) {
    return {
      data: toProduct(value.data)
    };
  }

  if (isProduct(value)) {
    return {
      data: toProduct(value)
    };
  }

  throw new ApiClientError({
    code: 'INVALID_PRODUCT_RESPONSE',
    message: 'The product response did not match the expected format.'
  });
};
