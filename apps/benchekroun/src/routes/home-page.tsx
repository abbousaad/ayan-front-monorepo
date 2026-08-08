import { getProducts } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { useCallback, useEffect, useState } from 'react';

import { STORE_ID } from '../config';
import { useBrandCopy } from '../i18n/use-brand-copy';
import { ProductCard } from '../components/product-card';

type LoadState = {
  products: Product[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: LoadState = { products: [], isLoading: true, hasError: false };

export function HomePage() {
  const copy = useBrandCopy();
  const [state, setState] = useState<LoadState>(initialState);

  const loadProducts = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, hasError: false }));
    try {
      const response = await getProducts({ storeId: STORE_ID });
      setState({ products: response.data, isLoading: false, hasError: false });
    } catch {
      setState({ products: [], isLoading: false, hasError: true });
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-brand-line">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="fade-up text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
            {copy.heroEyebrow}
          </p>
          <h1 className="fade-up mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="fade-up mx-auto mt-6 max-w-xl text-base leading-8 text-brand-muted">
            {copy.heroSubtitle}
          </p>
          <a
            className="fade-up mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-8 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black"
            href="#collection"
          >
            {copy.heroCta}
          </a>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">{copy.storyEyebrow}</p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{copy.storyTitle}</h2>
        <div className="gold-rule mx-auto my-6 w-24" />
        <p className="mx-auto max-w-2xl text-base leading-8 text-brand-muted">{copy.storyBody}</p>
      </section>

      {/* Collection */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-8 sm:px-6 lg:px-8" id="collection">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">{copy.collectionEyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{copy.collectionTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted">{copy.collectionSubtitle}</p>
        </div>

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
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft"
              onClick={() => void loadProducts()}
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
      </section>
    </main>
  );
}
