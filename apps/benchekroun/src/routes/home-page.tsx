import { getStores } from '@acme/api-client/stores';
import type { Store } from '@acme/api-client/stores';
import { useCallback, useEffect, useState } from 'react';

import { useBrandCopy } from '../i18n/use-brand-copy';
import { CategoryCard } from '../components/category-card';
import { FeatureStrip } from '../components/feature-strip';
import { FeaturedProducts } from '../components/featured-products';

type LoadState = {
  stores: Store[];
  isLoading: boolean;
  hasError: boolean;
};

const initialState: LoadState = { stores: [], isLoading: true, hasError: false };

export function HomePage() {
  const copy = useBrandCopy();
  // Backend stores are surfaced as browsable categories.
  const [state, setState] = useState<LoadState>(initialState);

  const loadStores = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, hasError: false }));
    try {
      const response = await getStores();
      setState({ stores: response.data, isLoading: false, hasError: false });
    } catch {
      setState({ stores: [], isLoading: false, hasError: true });
    }
  }, []);

  useEffect(() => {
    void loadStores();
  }, [loadStores]);

  return (
    <main>
      {/* Hero — bounded to a single screen (viewport minus navbar) */}
      <section className="flex min-h-[calc(100svh-5.5rem)] items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-6xl border border-brand-gold-dim/40 px-6 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14">
          {/* Ornate gold corner brackets */}
          <span aria-hidden className="pointer-events-none absolute -left-[3px] -top-[3px] h-9 w-9 border-l-2 border-t-2 border-brand-gold" />
          <span aria-hidden className="pointer-events-none absolute -right-[3px] -top-[3px] h-9 w-9 border-r-2 border-t-2 border-brand-gold" />
          <span aria-hidden className="pointer-events-none absolute -bottom-[3px] -left-[3px] h-9 w-9 border-b-2 border-l-2 border-brand-gold" />
          <span aria-hidden className="pointer-events-none absolute -bottom-[3px] -right-[3px] h-9 w-9 border-b-2 border-r-2 border-brand-gold" />

          <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-14">
            {/* Text — first in DOM so it sits at the start (right in RTL, left in FR) */}
            <div className="fade-up text-center md:text-start">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
                {copy.heroEyebrow}
              </p>
              <h1 className="mt-6 font-display text-5xl font-bold leading-[1.08] sm:text-6xl">
                <span className="block text-brand-ink">{copy.heroTitleLead}</span>
                <span className="block text-brand-gold">{copy.heroTitleAccent}</span>
              </h1>
              <p className="mt-6 font-display text-lg italic text-brand-ink/90">{copy.heroAccentLine}</p>
              <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-brand-muted md:mx-0">
                {copy.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <a
                  className="inline-flex min-h-12 items-center justify-center bg-brand-gold px-7 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black"
                  href="#collection"
                >
                  {copy.heroCta}
                </a>
              </div>
            </div>

            {/* Image panel — hatched placeholder until a hero image is supplied */}
            <div className="fade-up">
              <div className="hero-hatch relative flex h-[clamp(15rem,48vh,26rem)] w-full items-center justify-center overflow-hidden border border-brand-gold-dim/50">
                <span className="px-4 text-center text-[11px] uppercase tracking-[0.3em] text-brand-muted">
                  {copy.heroImageCaption}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand promises strip */}
      <FeatureStrip />

      {/* Light "product" band — category grid + best sellers read better on bone */}
      <div className="surface-light pb-16 sm:pb-20">
      {/* Collection */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8" id="collection">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold-ink">{copy.collectionEyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{copy.categoriesTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-muted">{copy.collectionSubtitle}</p>
        </div>

        {state.isLoading ? (
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="aspect-[4/5] w-32 animate-pulse rounded-2xl bg-brand-charcoal sm:w-44 lg:w-48" />
            ))}
          </div>
        ) : state.hasError ? (
          <div className="rounded-[1.5rem] border border-brand-line bg-brand-charcoal p-10 text-center">
            <p className="text-brand-muted">{copy.productsError}</p>
            <button
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-black transition hover:bg-brand-gold-soft"
              onClick={() => void loadStores()}
              type="button"
            >
              {copy.retry}
            </button>
          </div>
        ) : state.stores.length === 0 ? (
          <div className="rounded-[1.5rem] border border-brand-line bg-brand-charcoal p-10 text-center text-brand-muted">
            {copy.productsEmpty}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            {state.stores.map((store) => (
              <div key={store.id} className="w-32 sm:w-44 lg:w-48">
                <CategoryCard store={store} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Best sellers */}
      <FeaturedProducts />
      </div>
    </main>
  );
}
