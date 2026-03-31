import { type Product } from '@acme/api-client/products';
import { getStoreById, getStoreProducts, type Store } from '@acme/api-client/stores';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

import { createImageUrl } from '@acme/api-client';

import { ProductCard } from '../components/product-card';

type StoreProductsState = {
  errorMessage: string | null;
  isLoading: boolean;
  products: Product[];
  store: Store | null;
};

const initialState: StoreProductsState = {
  errorMessage: null,
  isLoading: true,
  products: [],
  store: null
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load this store right now.';

const LoadingState = () => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="status">
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={`loading-card-${index}`}
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
  <section className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]">
    <div className="mx-auto max-w-lg space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Store products</p>
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

export const StoreProductsPage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [{ errorMessage, isLoading, products, store }, setState] = useState(initialState);

  const loadStoreProducts = useCallback(async () => {
    if (!storeId) {
      setState({
        errorMessage: 'A store id is required to load this page.',
        isLoading: false,
        products: [],
        store: null
      });

      return;
    }

    setState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    try {
      const [storeResponse, productsResponse] = await Promise.all([
        getStoreById(storeId),
        getStoreProducts(storeId)
      ]);

      setState({
        errorMessage: null,
        isLoading: false,
        products: productsResponse.data,
        store: storeResponse.data
      });
    } catch (error) {
      setState({
        errorMessage: getErrorMessage(error),
        isLoading: false,
        products: [],
        store: null
      });
    }
  }, [storeId]);

  useEffect(() => {
    void loadStoreProducts();
  }, [loadStoreProducts]);

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-stone-900 md:px-8 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link
                aria-label="Back home"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-900 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                to="/"
              >
                <FiChevronLeft aria-hidden="true" size={20} />
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Store collection</p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                {store ? `${store.name} products` : 'Curated store products'}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                {store
                  ? `Browse the latest items from ${store.name} in the same warm, calm shopping experience used across the catalog.`
                  : 'Browse a focused store assortment with a calm layout, quick actions, and clear availability.'}
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-4 rounded-[1.75rem] bg-white p-4">
              {store ? (
                <img alt={store.name} className="h-72 w-full object-contain" src={createImageUrl(store.imageUrl)} />
              ) : null}
            </div>
          </div>
        </section>

        {isLoading ? <LoadingState /> : null}

        {!isLoading && errorMessage ? (
          <MessageState
            actionLabel="Try again"
            description={errorMessage}
            onAction={() => {
              void loadStoreProducts();
            }}
            title="We couldn't load this store collection"
          />
        ) : null}

        {!isLoading && !errorMessage && products.length === 0 ? (
          <MessageState
            description="This store does not have products available yet. Check back again soon."
            title="Nothing to browse just yet"
          />
        ) : null}

        {!isLoading && !errorMessage && store && products.length > 0 ? (
          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
};
