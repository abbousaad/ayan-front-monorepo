import { API_BASE_URL } from '@acme/api-client';
import type { ProductUnit } from '@acme/api-client/products';
import type { StoreCategory } from '@acme/api-client/stores';

/**
 * Benchekroun-local admin writes. Kept separate from @acme/api-client so the
 * shared package (and web/mobile) stay untouched. The localized write contract
 * lives ONLY here: name/description are sent as { en, fr, ar } JSON objects. If
 * the backend expects a different shape, this is the one file to change.
 */

export type LocalizedInput = { en: string; fr: string; ar: string };

export type CategoryInput = {
  name: LocalizedInput;
  category: StoreCategory;
  slug: string;
};

export type ProductInput = {
  storeId: string;
  name: LocalizedInput;
  description: LocalizedInput;
  price: number;
  stock: number;
  unit: ProductUnit;
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
});

async function send(path: string, method: string, token: string, body?: unknown): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: authHeaders(token),
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as { error?: { message?: string }; message?: string };
      message = payload?.error?.message ?? payload?.message ?? message;
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json().catch(() => null);
}

export const createCategory = (input: CategoryInput, token: string) => send('/stores', 'POST', token, input);

export const updateCategory = (id: string, input: Partial<CategoryInput>, token: string) =>
  send(`/stores/${id}`, 'PATCH', token, input);

export const deleteCategory = (id: string, token: string) => send(`/stores/${id}`, 'DELETE', token);

export const createProduct = (input: ProductInput, token: string) => send('/products', 'POST', token, input);

export const updateProduct = (id: string, input: Partial<ProductInput>, token: string) =>
  send(`/products/${id}`, 'PATCH', token, input);

export const deleteProduct = (id: string, token: string) => send(`/products/${id}`, 'DELETE', token);
