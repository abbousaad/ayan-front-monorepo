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
    <main className="min-h-screen bg-papier">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <p className="eyebrow">{copy.brandTagline}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold uppercase text-encre sm:text-5xl">
            {copy.shopTitle}
          </h1>
          <div className="mx-auto mt-6 h-px w-24 bg-brume" />
        </header>

        {products === null ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse bg-blanc" />
            ))}
          </div>
        ) : hasError ? (
          <div className="border border-brume bg-blanc p-10 text-center">
            <p className="text-encre-70">{copy.productsError}</p>
            <button className="btn mt-5" onClick={() => void load()} type="button">
              {copy.retry}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-brume bg-blanc p-10 text-center text-encre-70">
            {copy.productsEmpty}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
