import { createImageUrl, ApiClientError } from '@acme/api-client';
import { getProductById } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { brandColors } from '@acme/shared';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { Link, useParams, Navigate } from 'react-router-dom';

import { useCart } from '../cart/use-cart';

type ProductState = {
  product: Product | null;
  errorMessage: string | null;
  isLoading: boolean;
};

const initialState: ProductState = {
  product: null,
  errorMessage: null,
  isLoading: true
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unable to load this product right now.';

const formatPrice = (price: number, currencyCode = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(price);

const LoadingState = () => (
  <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-[2rem] bg-stone-100" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-stone-100" />
        <div className="h-10 w-3/4 animate-pulse rounded-full bg-stone-100" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-stone-100" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full animate-pulse rounded-full bg-stone-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-stone-100" />
          <div className="h-4 w-4/6 animate-pulse rounded-full bg-stone-100" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ errorMessage, onRetry }: { errorMessage: string; onRetry: () => void }) => (
  <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>Product</p>
      <h2 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--color-section-title)' }}>We couldn't load this product</h2>
      <p className="mt-4 text-base leading-7" style={{ color: 'var(--color-body-text)' }}>{errorMessage}</p>
      <button
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2"
        onClick={onRetry}
        style={{ backgroundColor: 'var(--color-checkout-button-bg)', color: '#ffffff' }}
        type="button"
      >
        Try again
      </button>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-[0_18px_45px_rgba(120,98,70,0.08)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>Product</p>
      <h2 className="mt-2 text-2xl font-semibold" style={{ color: 'var(--color-section-title)' }}>Product not found</h2>
      <p className="mt-4 text-base leading-7" style={{ color: 'var(--color-body-text)' }}>This product may have been removed or doesn't exist.</p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 font-medium text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
        to="/products"
      >
        Browse all products
      </Link>
    </div>
  </div>
);

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addCartItem, openCart } = useCart();
  const [state, setState] = useState<ProductState>(initialState);
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(async () => {
    if (!productId) {
      setState({
        product: null,
        errorMessage: 'Product ID is required.',
        isLoading: false
      });
      return;
    }

    setState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    try {
      const response = await getProductById(productId);
      setState({
        product: response.data,
        errorMessage: null,
        isLoading: false
      });
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        setState({
          product: null,
          errorMessage: null,
          isLoading: false
        });
        return;
      }
      setState({
        product: null,
        errorMessage: getErrorMessage(error),
        isLoading: false
      });
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const handleAddToCart = () => {
    if (!state.product) return;

    addCartItem({
      productId: state.product.id,
      name: state.product.name,
      price: state.product.price,
      storeId: state.product.storeId,
      imageUrl: state.product.imageUrl,
      currencyCode: state.product.currencyCode,
      unit: state.product.unit,
      quantity
    });
    openCart();
  };

  const incrementQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decrementQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  if (!productId) {
    return <Navigate replace to="/products" />;
  }

  if (state.isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <LoadingState />
      </main>
    );
  }

  if (state.errorMessage) {
    return (
      <main className="min-h-screen bg-white">
        <ErrorState errorMessage={state.errorMessage} onRetry={loadProduct} />
      </main>
    );
  }

  if (!state.product) {
    return (
      <main className="min-h-screen bg-white">
        <NotFoundState />
      </main>
    );
  }

  const product = state.product;
  const stockStatus = product.stock > 10 ? 'In stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock';
  const stockColor = product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600';

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <div className="mx-auto max-w-5xl">
        <Link
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium transition"
          style={{ color: 'var(--color-body-text)' }}
          to="/products"
        >
          <FiChevronLeft aria-hidden="true" size={16} />
          Back to products
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_45px_rgba(120,98,70,0.08)]">
            <img
              alt={product.name}
              className="h-full w-full object-contain"
              src={createImageUrl(product.imageUrl)}
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <Link
                className="text-sm font-medium"
                style={{ color: 'var(--color-accent)' }}
                to={`/stores/${product.storeId}/products`}
              >
                View store
              </Link>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl" style={{ color: 'var(--color-section-title)' }}>
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold" style={{ color: 'var(--color-price)' }}>
                {formatPrice(product.price, product.currencyCode ?? 'USD')}
                <span className="ml-2 text-base font-normal" style={{ color: 'var(--color-subtitle-2)' }}>/ {product.unit}</span>
              </p>
            </div>

            {product.description && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-subtitle-1)' }}>Description</h2>
                <p className="text-base leading-7" style={{ color: 'var(--color-body-text)' }}>{product.description}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${stockColor}`}>{stockStatus}</span>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white p-1">
                  <button
                    aria-label="Decrease quantity"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    disabled={quantity <= 1}
                    onClick={decrementQuantity}
                    type="button"
                  >
                    <FiMinus aria-hidden="true" size={16} />
                  </button>
                  <span className="w-12 text-center text-base font-medium text-stone-900">{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    onClick={incrementQuantity}
                    type="button"
                  >
                    <FiPlus aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>

              <button
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                style={{ backgroundColor: 'var(--color-checkout-button-bg)', color: '#ffffff' }}
                type="button"
              >
                {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}