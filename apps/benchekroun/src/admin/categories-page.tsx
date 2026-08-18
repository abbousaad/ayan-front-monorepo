import { getStores, STORE_CATEGORIES } from '@acme/api-client/stores';
import type { Store, StoreCategory } from '@acme/api-client/stores';
import { useCallback, useEffect, useState } from 'react';

import { useAdminAuth } from './admin-auth';
import { createCategory, deleteCategory, updateCategory } from './admin-api';
import type { CategoryInput, LocalizedInput } from './admin-api';
import { EMPTY_LOCALIZED, ImagePicker, LocalizedField, Modal, dangerBtn, ghostBtn, inputClass, labelClass, primaryBtn } from './ui';

const toNameInput = (store: Store): LocalizedInput => ({
  en: store.nameLocalized?.en ?? store.name ?? '',
  fr: store.nameLocalized?.fr ?? '',
  ar: store.nameLocalized?.ar ?? ''
});

export function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Store | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStores();
      setStores(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (store: Store) => {
    if (!token || !window.confirm(`Delete category “${store.name}”?`)) {
      return;
    }
    await deleteCategory(store.id, token);
    await load();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Categories</h1>
        <button className={primaryBtn} onClick={() => setCreating(true)} type="button">
          New category
        </button>
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan={4}>Loading…</td></tr>
            ) : stores.length === 0 ? (
              <tr><td className="px-4 py-6 text-slate-400" colSpan={4}>No categories yet.</td></tr>
            ) : (
              stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{store.name}</td>
                  <td className="px-4 py-3 text-slate-600">{store.category}</td>
                  <td className="px-4 py-3 text-slate-500">{store.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className={ghostBtn} onClick={() => setEditing(store)} type="button">Edit</button>
                      <button className={dangerBtn} onClick={() => void handleDelete(store)} type="button">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <CategoryForm
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
          token={token}
        />
      )}
    </div>
  );
}

function CategoryForm({
  initial,
  token,
  onClose,
  onSaved
}: {
  initial: Store | null;
  token: string | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState<LocalizedInput>(initial ? toNameInput(initial) : EMPTY_LOCALIZED);
  const [category, setCategory] = useState<StoreCategory>(initial?.category ?? STORE_CATEGORIES[0]);
  const [slug, setSlug] = useState(initial?.slug ?? '');
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
    const payload: CategoryInput = { name, category, slug: slug.trim(), images };
    try {
      if (initial) {
        await updateCategory(initial.id, payload, token);
      } else {
        await createCategory(payload, token);
      }
      await onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Save failed');
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose} title={initial ? 'Edit category' : 'New category'}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <LocalizedField label="Name" onChange={setName} required value={name} />

        <div className="space-y-1">
          <label className={labelClass} htmlFor="category-select">Category</label>
          <select className={inputClass} id="category-select" onChange={(event) => setCategory(event.target.value as StoreCategory)} value={category}>
            {STORE_CATEGORIES.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className={labelClass} htmlFor="slug-input">Slug</label>
          <input className={inputClass} id="slug-input" onChange={(event) => setSlug(event.target.value)} required value={slug} />
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
