import { ApiClientError } from '../shared/api-client-error';
import { isLocalizedInput, resolveLocalizedText, toLocalizedText } from '../shared/localized';

import { STORE_CATEGORIES, type Store, type StoreResponse, type StoresResponse } from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStoreCategory = (value: unknown): value is Store['category'] =>
  typeof value === 'string' && STORE_CATEGORIES.includes(value as Store['category']);

const isStore = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    isLocalizedInput(value.name) &&
    typeof value.slug === 'string' &&
    typeof value.imageUrl === 'string' &&
    isStoreCategory(value.category)
  );
};

// `name` may be a plain string (legacy) or an { en, fr, ar } map; keep a flat
// resolved `name` and attach the localized map for locale-aware apps.
const toStore = (value: Record<string, unknown>): Store => {
  const nameLocalized = toLocalizedText(value.name);

  return {
    id: value.id as string,
    name: resolveLocalizedText(nameLocalized, 'en'),
    nameLocalized,
    category: value.category as Store['category'],
    slug: value.slug as string,
    imageUrl: value.imageUrl as string
  };
};

export const parseStoresResponse = (value: unknown): StoresResponse => {
  if (!isRecord(value) || !Array.isArray(value.data) || !value.data.every(isStore)) {
    throw new ApiClientError({
      code: 'INVALID_STORES_RESPONSE',
      message: 'The stores response did not match the expected format.'
    });
  }

  return {
    data: value.data.map((store) => toStore(store))
  };
};

export const parseStoreResponse = (value: unknown): StoreResponse => {
  if (isRecord(value) && 'data' in value && isStore(value.data)) {
    return {
      data: toStore(value.data)
    };
  }

  if (isStore(value)) {
    return {
      data: toStore(value)
    };
  }

  throw new ApiClientError({
    code: 'INVALID_STORE_RESPONSE',
    message: 'The store response did not match the expected format.'
  });
};
