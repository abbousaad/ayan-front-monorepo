import { API_BASE_URL } from '@acme/api-client';
import type { ProductUnit } from '@acme/api-client/products';
import type { StoreCategory } from '@acme/api-client/stores';

/**
 * Dermadive-local admin writes. Kept separate from @acme/api-client so the
 * shared package (and web/mobile) stay untouched.
 *
 * Contract (from the live backend spec, /api/v1/docs-json): both POST and PATCH
 * accept multipart/form-data. Localized text is sent as FLAT per-locale fields
 * (nameEn/nameFr/nameAr, descriptionEn/…); images are appended as repeated
 * `images` file parts. Empty locales are omitted so the backend keeps null and
 * the reader falls back to another locale. This is the one file to change if
 * the contract shifts.
 */

export type LocalizedInput = { en: string; fr: string; ar: string };

export type CategoryInput = {
  name: LocalizedInput;
  category: StoreCategory;
  slug: string;
  images?: File[];
};

export type ProductInput = {
  storeId: string;
  name: LocalizedInput;
  description: LocalizedInput;
  price: number;
  stock: number;
  unit: ProductUnit;
  images?: File[];
};

const LOCALE_SUFFIX: Record<keyof LocalizedInput, string> = { en: 'En', fr: 'Fr', ar: 'Ar' };

const appendLocalized = (form: FormData, base: 'name' | 'description', value: LocalizedInput) => {
  (Object.keys(LOCALE_SUFFIX) as (keyof LocalizedInput)[]).forEach((locale) => {
    const text = value[locale].trim();
    if (text) {
      form.append(`${base}${LOCALE_SUFFIX[locale]}`, text);
    }
  });
};

const appendImages = (form: FormData, images?: File[]) => {
  (images ?? []).forEach((file) => form.append('images', file));
};

async function sendMultipart(path: string, method: string, token: string, form: FormData): Promise<unknown> {
  // Note: never set Content-Type — the browser adds the multipart boundary.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as { error?: { message?: string }; message?: string };
      message = payload?.error?.message ?? payload?.message ?? message;
    } catch {
      /* keep the default message */
    }
    if (response.status === 401 || response.status === 403) {
      message =
        'Not authorized — creating/editing categories and products requires a superadmin account (check the role shown in the sidebar), or your session expired. Sign in again as a superadmin.';
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json().catch(() => null);
}

const buildCategoryForm = (input: CategoryInput): FormData => {
  const form = new FormData();
  appendLocalized(form, 'name', input.name);
  form.append('category', input.category);
  form.append('slug', input.slug);
  appendImages(form, input.images);
  return form;
};

const buildProductForm = (input: ProductInput): FormData => {
  const form = new FormData();
  form.append('storeId', input.storeId);
  appendLocalized(form, 'name', input.name);
  appendLocalized(form, 'description', input.description);
  form.append('price', String(input.price));
  form.append('stock', String(input.stock));
  form.append('unit', input.unit);
  appendImages(form, input.images);
  return form;
};

export const createCategory = (input: CategoryInput, token: string) =>
  sendMultipart('/stores', 'POST', token, buildCategoryForm(input));

export const updateCategory = (id: string, input: CategoryInput, token: string) =>
  sendMultipart(`/stores/${id}`, 'PATCH', token, buildCategoryForm(input));

export const deleteCategory = async (id: string, token: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/stores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
};

export const createProduct = (input: ProductInput, token: string) =>
  sendMultipart('/products', 'POST', token, buildProductForm(input));

export const updateProduct = (id: string, input: ProductInput, token: string) =>
  sendMultipart(`/products/${id}`, 'PATCH', token, buildProductForm(input));

export const deleteProduct = async (id: string, token: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
};
