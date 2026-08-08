import { getProducts } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { useCallback, useEffect, useState } from 'react';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { ProductCard } from '../components/product-card';

export function ShopPage() {
  const copy = useBrandCopy();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [hasError, setHasError] = useState(false);

  const load = useCallback(async () => {
    setHasError(false);
    setProducts(null);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch {
      setProducts([]);
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">{copy.brandTagline}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-brand-ink sm:text-5xl">{copy.navShop}</h1>
        <div className="gold-rule mx-auto mt-6 w-24" />
      </header>

      {products === null ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-[1.25rem] bg-brand-charcoal" />
          ))}
        </div>
      ) : hasError ? (
        <div className="rounded-[1.5rem] border border-brand-line bg-brand-charcoal p-10 text-center">
          <p className="text-brand-muted">{copy.productsError}</p>
          <button
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft"
            onClick={() => void load()}
            type="button"
          >
            {copy.retry}
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-[1.5rem] border border-brand-line bg-brand-charcoal p-10 text-center text-brand-muted">
          {copy.productsEmpty}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
