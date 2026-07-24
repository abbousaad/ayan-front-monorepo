import { createImageUrl } from '@acme/api-client';
import { getProducts, type Product } from '@acme/api-client/products';
import { getStores, type Store } from '@acme/api-client/stores';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProductCard } from '../components/product-card';
import { StoreStories } from '../components/store-stories';
import { useI18n } from '../contexts/i18n-context';

type AsyncState<T> = {
  data: T;
  errorMessage: string | null;
  isLoading: boolean;
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const initialProductsState: AsyncState<Product[]> = {
  data: [],
  errorMessage: null,
  isLoading: true
};

const initialStoresState: AsyncState<Store[]> = {
  data: [],
  errorMessage: null,
  isLoading: true
};

const HeroIllustration = () => (
  <div className="rounded-[1.75rem] border border-stone-200 bg-gradient-to-br from-amber-50 via-white to-orange-100 p-4">
    <svg aria-hidden="true" className="h-auto w-full" viewBox="0 0 520 300">
      <defs>
        <linearGradient id="hero-bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
      </defs>

      <rect fill="url(#hero-bg)" height="300" rx="32" width="520" />
      <circle cx="112" cy="88" fill="#f59e0b" opacity="0.18" r="72" />
      <circle cx="408" cy="228" fill="#22c55e" opacity="0.16" r="94" />

      <rect fill="#ffffff" height="178" opacity="0.92" rx="26" width="184" x="42" y="64" />
      <rect fill="#ffffff" height="156" opacity="0.9" rx="26" width="184" x="292" y="42" />
      <rect fill="#fef3c7" height="28" rx="14" width="96" x="64" y="84" />
      <rect fill="#f5f5f4" height="18" rx="9" width="118" x="64" y="126" />
      <rect fill="#f5f5f4" height="18" rx="9" width="90" x="64" y="154" />
      <rect fill="#16a34a" height="16" rx="8" width="74" x="64" y="194" />

      <rect fill="#fef3c7" height="88" rx="20" width="136" x="316" y="68" />
      <circle cx="358" cy="112" fill="#fb923c" r="24" />
      <circle cx="412" cy="102" fill="#4ade80" r="20" />
      <circle cx="388" cy="136" fill="#facc15" r="18" />
      <rect fill="#e7e5e4" height="16" rx="8" width="104" x="316" y="174" />
      <rect fill="#e7e5e4" height="16" rx="8" width="72" x="316" y="198" />
    </svg>
  </div>
);

const StoresLoadingState = () => (
  <div className="space-y-3" role="status">
    {Array.from({ length: 4 }, (_, index) => (
      <div
        key={`store-loading-${index}`}
        className="h-24 animate-pulse rounded-[1.5rem] border border-stone-200 bg-stone-50"
      />
    ))}
  </div>
);

const ProductsLoadingState = () => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="status">
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={`product-loading-${index}`}
        className="h-72 animate-pulse rounded-[2rem] border border-stone-200 bg-white/70 p-6 shadow-[0_18px_45px_rgba(120,98,70,0.08)]"
      >
        <div className="h-32 rounded-[1.5rem] bg-stone-100" />
        <div className="mt-5 h-4 w-24 rounded-full bg-stone-100" />
        <div className="mt-4 h-7 w-3/4 rounded-full bg-stone-100" />
        <div className="mt-3 h-4 w-full rounded-full bg-stone-100" />
        <div className="mt-2 h-4 w-5/6 rounded-full bg-stone-100" />
        <div className="mt-8 h-12 rounded-full bg-stone-100" />
      </div>
    ))}
  </div>
);

type MessageStateProps = {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
};

const MessageState = ({ actionLabel, description, onAction, title }: MessageStateProps) => (
  <section className="rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)] md:p-10">
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-semibold text-stone-900">{title}</h2>
      <p className="text-base leading-7 text-stone-600">{description}</p>
      {actionLabel && onAction ? (
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={onAction}
          style={{ backgroundColor: brandColors.logoGreen, color: brandColors.white }}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  </section>
);

const StoreCard = ({ store }: { store: Store }) => (
  <Link
    className="flex h-full flex-col items-start gap-3 rounded-[1.25rem] border border-stone-200 p-3 transition duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
  style={{ backgroundColor: 'var(--color-card-bg)' }}
    to={`/stores/${store.id}/products`}
  >
    <img
      alt={store.name}
      className="h-28 w-full rounded-[1rem] object-cover"
      src={createImageUrl(store.imageUrl)}
    />

    <h2 className="text-base font-semibold" style={{ color: 'var(--color-section-title)' }}>{store.name}</h2>
  </Link>
);

export const HomePage = () => {
  const { t } = useI18n();
  const [productsState, setProductsState] = useState(initialProductsState);
  const [storesState, setStoresState] = useState(initialStoresState);

  const loadHomeContent = useCallback(async () => {
    setProductsState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    setStoresState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    const [storesResult, productsResult] = await Promise.allSettled([getStores(), getProducts()]);

    setStoresState(
      storesResult.status === 'fulfilled'
        ? {
            data: storesResult.value.data,
            errorMessage: null,
            isLoading: false
          }
        : {
            data: [],
            errorMessage: getErrorMessage(storesResult.reason, t('home.section.loadError')),
            isLoading: false
          }
    );

    setProductsState(
      productsResult.status === 'fulfilled'
        ? {
            data: productsResult.value.data,
            errorMessage: null,
            isLoading: false
          }
        : {
            data: [],
            errorMessage: getErrorMessage(productsResult.reason, t('home.section.loadError')),
            isLoading: false
          }
    );
  }, [t]);

  useEffect(() => {
    void loadHomeContent();
  }, [loadHomeContent]);

  const handleRetry = () => {
    void loadHomeContent();
  };

  return (
    <main className="min-h-screen px-6 py-10 md:px-8 md:py-14" style={{ backgroundColor: 'var(--color-page-bg)', color: 'var(--color-body-text)' }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <StoreStories />

        <section className="flex min-h-[calc(100vh-9rem)] w-full items-center border border-stone-200 bg-white p-6 md:p-8 lg:p-10">
          <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:items-center">
            <div className="flex h-full flex-col gap-5">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--color-home-subtitle-text)' }}>{t('home.hero.eyebrow')}</p>
                <h1 className="max-w-xl text-2xl font-semibold tracking-tight md:text-5xl" style={{ color: 'var(--color-home-title)' }}>
                  {t('home.hero.title')}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                  {t('home.hero.subtitle')}
                </p>
              </div>

          

              <div className="xl:max-w-[560px]">
                <HeroIllustration />
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-stone-200 bg-white p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>{t('home.stores.eyebrow')}</p>
                  <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-section-title)' }}>{t('home.stores.title')}</h2>
                </div>
              </div>

              {storesState.isLoading ? <StoresLoadingState /> : null}

              {!storesState.isLoading && storesState.errorMessage ? (
                <MessageState
                  actionLabel={t('home.stores.errorAction')}
                  description={storesState.errorMessage}
                  onAction={handleRetry}
                  title={t('home.stores.errorTitle')}
                />
              ) : null}

              {!storesState.isLoading && !storesState.errorMessage && storesState.data.length === 0 ? (
                <MessageState description={t('home.stores.emptyDescription')} title={t('home.stores.emptyTitle')} />
              ) : null}

              {!storesState.isLoading && !storesState.errorMessage && storesState.data.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {storesState.data.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.35em]" style={{ color: 'var(--color-accent)' }}>{t('home.products.eyebrow')}</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: 'var(--color-section-title)' }}>
              {t('home.products.title')}
            </h2>
            <p className="max-w-2xl text-base leading-7" style={{ color: 'var(--color-body-text)' }}>
              {t('home.products.subtitle')}
            </p>
          </div>

          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 font-medium text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
            to="/products"
          >
            {t('home.products.cta')}
          </Link>
        </section>

        {productsState.isLoading ? <ProductsLoadingState /> : null}

        {!productsState.isLoading && productsState.errorMessage ? (
          <MessageState
            actionLabel={t('home.products.errorAction')}
            description={productsState.errorMessage}
            onAction={handleRetry}
            title={t('home.products.errorTitle')}
          />
        ) : null}

        {!productsState.isLoading && !productsState.errorMessage && productsState.data.length === 0 ? (
          <MessageState
            description={t('home.products.emptyDescription')}
            title={t('home.products.emptyTitle')}
          />
        ) : null}

        {!productsState.isLoading && !productsState.errorMessage && productsState.data.length > 0 ? (
          <section className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {productsState.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
};
