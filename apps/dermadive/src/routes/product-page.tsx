import { createImageUrl, ApiClientError, resolveLocalizedText } from '@acme/api-client';
import { getProductById } from '@acme/api-client/products';
import type { Product } from '@acme/api-client/products';
import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { Link, useParams, Navigate } from 'react-router-dom';

import { useCart } from '../cart/use-cart';
import { useI18n } from '../contexts/i18n-context';
import { useBrandCopy } from '../i18n/use-brand-copy';
import { interpolateCopy } from '../i18n/brand-copy';
import { formatPrice } from '../lib/format';

type ProductState = {
  product: Product | null;
  errorMessage: string | null;
  isLoading: boolean;
};

const initialState: ProductState = { product: null, errorMessage: null, isLoading: true };

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addCartItem, openCart } = useCart();
  const { locale } = useI18n();
  const copy = useBrandCopy();
  const [state, setState] = useState<ProductState>(initialState);
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(async () => {
    if (!productId) {
      return;
    }

    setState((current) => ({ ...current, errorMessage: null, isLoading: true }));

    try {
      const response = await getProductById(productId);
      setState({ product: response.data, errorMessage: null, isLoading: false });
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        setState({ product: null, errorMessage: null, isLoading: false });
        return;
      }
      setState({ product: null, errorMessage: copy.productsError, isLoading: false });
    }
  }, [productId, copy.productsError]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  if (!productId) {
    return <Navigate replace to="/" />;
  }

  const handleAddToCart = () => {
    if (!state.product) return;

    addCartItem({
      productId: state.product.id,
      name: resolveLocalizedText(state.product.nameLocalized, locale) || state.product.name,
      price: state.product.price,
      storeId: state.product.storeId,
      imageUrl: state.product.imageUrl,
      currencyCode: state.product.currencyCode,
      unit: state.product.unit,
      quantity
    });
    openCart();
  };

  const backLink = (
    <Link
      className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-encre-70 transition hover:text-encre"
      to="/shop"
    >
      <FiChevronLeft aria-hidden="true" size={16} />
      {copy.backToShop}
    </Link>
  );

  return (
    <main className="min-h-screen bg-papier">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {backLink}

        {state.isLoading ? (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square animate-pulse bg-blanc" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 animate-pulse bg-blanc" />
              <div className="h-6 w-32 animate-pulse bg-blanc" />
              <div className="h-24 w-full animate-pulse bg-blanc" />
            </div>
          </div>
        ) : state.errorMessage ? (
          <ErrorPanel message={state.errorMessage} onRetry={loadProduct} retryLabel={copy.retry} />
        ) : !state.product ? (
          <ErrorPanel message={copy.productsEmpty} />
        ) : (
          <ProductDetail
            onAdd={handleAddToCart}
            product={state.product}
            quantity={quantity}
            setQuantity={setQuantity}
            copy={copy}
            locale={locale}
          />
        )}
      </div>
    </main>
  );
}

function ErrorPanel({ message, onRetry, retryLabel }: { message: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div className="border border-brume bg-blanc p-10 text-center">
      <p className="text-encre-70">{message}</p>
      {onRetry && retryLabel && (
        <button className="btn mt-5" onClick={onRetry} type="button">
          {retryLabel}
        </button>
      )}
    </div>
  );
}

type ProductDetailProps = {
  product: Product;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onAdd: () => void;
  copy: ReturnType<typeof useBrandCopy>;
  locale: ReturnType<typeof useI18n>['locale'];
};

function ProductDetail({ product, quantity, setQuantity, onAdd, copy, locale }: ProductDetailProps) {
  const soldOut = product.stock === 0;
  const name = resolveLocalizedText(product.nameLocalized, locale) || product.name;
  const description = resolveLocalizedText(product.descriptionLocalized, locale) || product.description;
  const stockLabel = soldOut
    ? copy.outOfStock
    : product.stock <= 10
      ? interpolateCopy(copy.onlyLeft, { count: product.stock })
      : copy.inStock;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex aspect-square items-center justify-center overflow-hidden border border-brume bg-blanc">
        <img alt={name} className="h-full w-full object-contain p-6" src={createImageUrl(product.imageUrl)} />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-4xl font-semibold uppercase tracking-tight text-encre">{name}</h1>
          <p className="mt-4 text-2xl font-semibold text-encre">
            {formatPrice(product.price, locale, product.currencyCode)}
            <span className="ms-2 text-base font-normal text-encre-45">/ {product.unit}</span>
          </p>
        </div>

        {description && (
          <div className="space-y-2">
            <h2 className="eyebrow">{copy.description}</h2>
            <p className="text-base leading-8 text-encre-70">{description}</p>
          </div>
        )}

        <p className={`text-sm font-medium ${soldOut ? 'text-red-500' : 'text-encre'}`}>{stockLabel}</p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-encre-70">{copy.quantity}</span>
            <div className="flex items-center gap-2 border border-brume bg-blanc p-1">
              <button
                aria-label="−"
                className="inline-flex h-9 w-9 items-center justify-center text-encre-45 transition hover:bg-papier hover:text-encre disabled:opacity-40"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                type="button"
              >
                <FiMinus aria-hidden="true" size={16} />
              </button>
              <span className="w-10 text-center font-data text-base font-semibold text-encre">{quantity}</span>
              <button
                aria-label="+"
                className="inline-flex h-9 w-9 items-center justify-center text-encre-45 transition hover:bg-papier hover:text-encre"
                onClick={() => setQuantity((current) => current + 1)}
                type="button"
              >
                <FiPlus aria-hidden="true" size={16} />
              </button>
            </div>
          </div>

          <button className="btn w-full justify-center" disabled={soldOut} onClick={onAdd} type="button">
            {soldOut ? copy.outOfStock : copy.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
