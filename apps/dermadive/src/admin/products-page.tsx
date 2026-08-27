import { getProducts, PRODUCT_UNITS } from '@acme/api-client/products';
import type { Product, ProductUnit } from '@acme/api-client/products';
import { getStores } from '@acme/api-client/stores';
import type { Store } from '@acme/api-client/stores';
import { useCallback, useEffect, useState } from 'react';

import { useAdminAuth } from './admin-auth';
import { createProduct, deleteProduct, updateProduct } from './admin-api';
import type { LocalizedInput, ProductInput } from './admin-api';
import { EMPTY_LOCALIZED, ImagePicker, LocalizedField, Modal, dangerBtn, ghostBtn, inputClass, labelClass, primaryBtn } from './ui';

const toName = (product: Product): LocalizedInput => ({
  en: product.nameLocalized?.en ?? product.name ?? '',
  fr: product.nameLocalized?.fr ?? '',
  ar: product.nameLocalized?.ar ?? ''
});

const toDescription = (product: Product): LocalizedInput => ({
  en: product.descriptionLocalized?.en ?? product.description ?? '',
  fr: product.descriptionLocalized?.fr ?? '',
  ar: product.descriptionLocalized?.ar ?? ''
});

export function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, storesRes] = await Promise.all([getProducts(), getStores()]);
      setProducts(productsRes.data);
      setStores(storesRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const storeName = (storeId: string) => stores.find((store) => store.id === storeId)?.name ?? storeId;

  const handleDelete = async (product: Product) => {
    if (!token || !window.confirm(`Delete product “${product.name}”?`)) {
      return;
    }
    await deleteProduct(product.id, token);
    await load();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Products</h1>
        <button className={primaryBtn} disabled={stores.length === 0} onClick={() => setCreating(true)} type="button">
          New product
        </button>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan={5}>Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan={5}>No products yet.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{storeName(product.storeId)}</td>
                  <td className="px-4 py-3 text-slate-600">{product.price} {product.currencyCode}</td>
                  <td className="px-4 py-3 text-slate-500">{product.stock} / {product.unit}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className={ghostBtn} onClick={() => setEditing(product)} type="button">Edit</button>
                      <button className={dangerBtn} onClick={() => void handleDelete(product)} type="button">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ProductForm
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={async () => {
            setCreating(false);
            setEditing(null);
            await load();
          }}
          stores={stores}
          token={token}
        />
      )}
    </div>
  );
}

function ProductForm({
  initial,
  stores,
  token,
  onClose,
  onSaved
}: {
  initial: Product | null;
  stores: Store[];
  token: string | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [storeId, setStoreId] = useState(initial?.storeId ?? stores[0]?.id ?? '');
  const [name, setName] = useState<LocalizedInput>(initial ? toName(initial) : EMPTY_LOCALIZED);
  const [description, setDescription] = useState<LocalizedInput>(initial ? toDescription(initial) : EMPTY_LOCALIZED);
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [stock, setStock] = useState(String(initial?.stock ?? ''));
  const [unit, setUnit] = useState<ProductUnit>(initial?.unit ?? PRODUCT_UNITS[0]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    setError(null);
    setBusy(true);
    const payload: ProductInput = {
      storeId,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      unit,
      images
    };
    try {
      if (initial) {
        await updateProduct(initial.id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      await onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Save failed');
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose} title={initial ? 'Edit product' : 'New product'}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="product-store">Category</label>
          <select className={inputClass} id="product-store" onChange={(event) => setStoreId(event.target.value)} value={storeId}>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>
        </div>

        <LocalizedField label="Name" onChange={setName} required value={name} />
        <LocalizedField label="Description" onChange={setDescription} textarea value={description} />

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className={labelClass} htmlFor="product-price">Price</label>
            <input className={inputClass} id="product-price" min="0" onChange={(event) => setPrice(event.target.value)} required step="0.01" type="number" value={price} />
          </div>
          <div className="space-y-1">
            <label className={labelClass} htmlFor="product-stock">Stock</label>
            <input className={inputClass} id="product-stock" min="0" onChange={(event) => setStock(event.target.value)} required type="number" value={stock} />
          </div>
          <div className="space-y-1">
            <label className={labelClass} htmlFor="product-unit">Unit</label>
            <select className={inputClass} id="product-unit" onChange={(event) => setUnit(event.target.value as ProductUnit)} value={unit}>
              {PRODUCT_UNITS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <ImagePicker currentImageUrl={initial?.imageUrl} files={images} onChange={setImages} />

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button className={ghostBtn} onClick={onClose} type="button">Cancel</button>
          <button className={primaryBtn} disabled={busy} type="submit">{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
