import { getProducts, type Product } from '@acme/api-client/products';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProductCard } from '../components/product-card';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load products right now.';

type ProductsState = {
  products: Product[];
  errorMessage: string | null;
  isLoading: boolean;
};

const initialState: ProductsState = {
  products: [],
  errorMessage: null,
  isLoading: true
};

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
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Products</p>
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

export const ProductsPage = () => {
  const [{ errorMessage, isLoading, products }, setProductsState] = useState(initialState);

  const loadProducts = useCallback(async () => {
    setProductsState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    try {
      const response = await getProducts();

      setProductsState({
        products: response.data,
        errorMessage: null,
        isLoading: false
      });
    } catch (error) {
      setProductsState({
        products: [],
        errorMessage: getErrorMessage(error),
        isLoading: false
      });
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const syncProducts = async () => {
      setProductsState((currentState) => ({
        ...currentState,
        errorMessage: null,
        isLoading: true
      }));

      try {
        const response = await getProducts();

        if (!isSubscribed) {
          return;
        }

        setProductsState({
          products: response.data,
          errorMessage: null,
          isLoading: false
        });
      } catch (error) {
        if (!isSubscribed) {
          return;
        }

        setProductsState({
          products: [],
          errorMessage: getErrorMessage(error),
          isLoading: false
        });
      }
    };

    void syncProducts();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f2ea] px-6 py-10 text-stone-900 md:px-8 md:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="rounded-[2rem] border border-stone-200 bg-[#fbf7f1] p-8 shadow-[0_18px_45px_rgba(120,98,70,0.08)] md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Link className="inline-flex text-sm font-medium text-amber-800 transition hover:text-amber-700" to="/">
                ← Back home
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Curated essentials</p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                Thoughtfully stocked pantry favorites.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                Browse the latest products from the shared fetch-based API client with calm neutrals, soft depth,
                and quick add-to-cart actions.
              </p>
            </div>

            <div className="grid max-w-md grid-cols-2 gap-4 rounded-[1.75rem] bg-white p-4 shadow-[0_18px_45px_rgba(120,98,70,0.08)]">
              <div className="rounded-[1.25rem] bg-amber-50 p-4">
                <p className="text-sm text-stone-500">Available now</p>
                <p className="mt-2 text-3xl font-semibold text-stone-950">{products.length}</p>
              </div>
              <div className="rounded-[1.25rem] bg-emerald-50 p-4">
                <p className="text-sm text-stone-500">Fast actions</p>
                <p className="mt-2 text-3xl font-semibold text-stone-950">1 click</p>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? <LoadingState /> : null}

        {!isLoading && errorMessage ? (
          <MessageState
            actionLabel="Try again"
            description={errorMessage}
            onAction={() => {
              void loadProducts();
            }}
            title="We couldn't load the product collection"
          />
        ) : null}

        {!isLoading && !errorMessage && products.length === 0 ? (
          <MessageState
            description="No products are available yet. Check back after the catalog is populated."
            title="Nothing to browse just yet"
          />
        ) : null}

        {!isLoading && !errorMessage && products.length > 0 ? (
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
