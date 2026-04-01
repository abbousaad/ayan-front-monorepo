import { API_BASE_URL } from '../client/config';
import { requestMultipart } from '../client/request-multipart';
import { requestJson } from '../shared/request-json';
import type { Store } from '../stores/types';

import type { CreateStoreInput, UpdateStoreInput } from './types';
import { parseStoreResponse } from './validators';

export const createStore = async (input: CreateStoreInput, token: string): Promise<Store> => {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('category', input.category);
  formData.append('slug', input.slug);

  if (input.image !== undefined) {
    formData.append('image', input.image);
  }

  const response = await requestMultipart('/stores', 'POST', formData, token);

  return parseStoreResponse(response);
};

export const updateStore = async (
  id: string,
  input: UpdateStoreInput,
  token: string
): Promise<Store> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/stores/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    }
  );

  return parseStoreResponse(response);
};

export const deleteStore = async (id: string, token: string): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/stores/${id}`,
    { method: 'DELETE' }
  );
};
