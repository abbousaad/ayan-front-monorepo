import { ApiClientError } from '../shared/api-client-error';

import { PRODUCT_UNITS, type Product, type ProductResponse, type ProductsResponse } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isProductUnit = (value: unknown): value is Product['unit'] =>
  typeof value === 'string' && PRODUCT_UNITS.includes(value as Product['unit']);

const isProduct = (value: unknown): value is Product => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.storeId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.imageUrl === 'string' &&
    (value.description === null || typeof value.description === 'string' || value.description === undefined) &&
    isProductUnit(value.unit)
  );
};

const toProduct = (value: Product | (Omit<Product, 'description'> & { description?: string | null })) => ({
  ...value,
  description: value.description ?? null
});

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
