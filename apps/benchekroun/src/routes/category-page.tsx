import { getProducts } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { getStoreById } from '@acme/api-client/stores';
import type { Store } from '@acme/api-client/stores';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { Link, Navigate, useParams } from 'react-router-dom';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { ProductCard } from '../components/product-card';

type CategoryState = {
  store: Store | null;
  products: Product[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: CategoryState = { store: null, products: [], isLoading: true, hasError: false };

export function CategoryPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const copy = useBrandCopy();
  const [state, setState] = useState<CategoryState>(initialState);

  const load = useCallback(async () => {
    if (!storeId) {
      return;
    }

    setState((current) => ({ ...current, isLoading: true, hasError: false }));

    try {
      const [storeRes, productsRes] = await Promise.all([
        getStoreById(storeId),
        getProducts({ storeId })
      ]);
      setState({ store: storeRes.data, products: productsRes.data, isLoading: false, hasError: false });
    } catch {
      setState({ store: null, products: [], isLoading: false, hasError: true });
    }
  }, [storeId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!storeId) {
    return <Navigate replace to="/" />;
  }

  return (
    <main className="surface-light min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-brand-muted transition hover:text-brand-burgundy"
        to="/#collection"
      >
        <FiChevronLeft aria-hidden className="rtl:rotate-180" size={16} />
        {copy.backToCategories}
      </Link>

      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold-ink">{copy.categoryEyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">
          {state.store?.name ?? '—'}
        </h1>
        <div className="gold-rule mx-auto mt-6 w-24" />
      </header>

      {state.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-[1.25rem] bg-brand-charcoal" />
          ))}
        </div>
      ) : state.hasError ? (
        <div className="rounded-[1.5rem] border border-brand-line bg-brand-charcoal p-10 text-center">
          <p className="text-brand-muted">{copy.productsError}</p>
          <button
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-burgundy px-6 text-sm font-semibold text-brand-ivory transition hover:bg-brand-burgundy-soft"
            onClick={() => void load()}
            type="button"
          >
            {copy.retry}
          </button>
        </div>
      ) : state.products.length === 0 ? (
        <div className="rounded-[1.5rem] border border-brand-line bg-brand-charcoal p-10 text-center text-brand-muted">
          {copy.productsEmpty}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {state.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      </div>
    </main>
  );
}
