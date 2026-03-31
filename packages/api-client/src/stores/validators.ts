import { ApiClientError } from '../shared/api-client-error';

import { STORE_CATEGORIES, type Store, type StoreResponse, type StoresResponse } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStoreCategory = (value: unknown): value is Store['category'] =>
  typeof value === 'string' && STORE_CATEGORIES.includes(value as Store['category']);

const isStore = (value: unknown): value is Store => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.imageUrl === 'string' &&
    isStoreCategory(value.category)
  );
};

export const parseStoresResponse = (value: unknown): StoresResponse => {
  if (!isRecord(value) || !Array.isArray(value.data) || !value.data.every(isStore)) {
    throw new ApiClientError({
      code: 'INVALID_STORES_RESPONSE',
      message: 'The stores response did not match the expected format.'
    });
  }

  return {
    data: value.data
  };
};

export const parseStoreResponse = (value: unknown): StoreResponse => {
  if (isRecord(value) && 'data' in value && isStore(value.data)) {
    return {
      data: value.data
    };
  }

  if (isStore(value)) {
    return {
      data: value
    };
  }

  throw new ApiClientError({
    code: 'INVALID_STORE_RESPONSE',
    message: 'The store response did not match the expected format.'
  });
};
