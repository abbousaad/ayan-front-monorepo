import { getProducts } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { getStores } from '@acme/api-client/stores';
import { useEffect, useState } from 'react';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { FeaturedProductCard } from './featured-product-card';

const FEATURED_LIMIT = 6;

export function FeaturedProducts() {
  const copy = useBrandCopy();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [storeNames, setStoreNames] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    Promise.all([getProducts(), getStores()])
      .then(([productsRes, storesRes]) => {
        if (!isMounted) {
          return;
        }
        setProducts(productsRes.data.slice(0, FEATURED_LIMIT));
        setStoreNames(Object.fromEntries(storesRes.data.map((store) => [store.id, store.name])));
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Hide the whole section when there's nothing to feature.
  if (products !== null && products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold-ink">{copy.featuredEyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{copy.featuredTitle}</h2>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-brand-gold-dim/60" />
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-brand-gold" />
          <span className="h-px w-16 bg-brand-gold-dim/60" />
        </div>
      </div>

      {products === null ? (
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-72 w-44 animate-pulse rounded-2xl bg-brand-charcoal sm:w-56 lg:w-60" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product) => (
            <div className="w-44 sm:w-56 lg:w-60" key={product.id}>
              <FeaturedProductCard categoryLabel={storeNames[product.storeId]} product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
