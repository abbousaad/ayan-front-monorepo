import { createImageUrl } from '@acme/api-client';
import type { Product } from '@acme/api-client/products';
import { brandColors, formatCurrency } from '@acme/shared';
import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useCart } from '../cart/use-cart';
import { useI18n } from '../contexts/i18n-context';

type ProductCardProps = {
  product: Product;
};

const getProductDescription = (description: Product['description']) =>
  description ?? 'A reliable everyday staple with clean ingredients and easy prep.';

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addCartItem, openCart } = useCart();
  const { t, locale } = useI18n();
  const formatPrice = (price: number, currencyCode = 'USD') => formatCurrency(price, currencyCode, locale);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addCartItem({
      currencyCode: product.currencyCode,
      productId: product.id,
      name: product.name,
      price: product.price,
      storeId: product.storeId,
      imageUrl: product.imageUrl,
      unit: product.unit
    });
    openCart();
  };

  return (
    <Link
      className="flex h-full max-w-[220px] flex-col rounded-[1.25rem] border border-stone-200 bg-white p-3 transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
      to={`/products/${product.id}`}
    >
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-[1rem] bg-stone-50">
        <img alt={product.name} className="max-h-full w-full object-contain" src={createImageUrl(product.imageUrl)} />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold leading-5" style={{ color: 'var(--color-text)' }}>{product.name}</h2>
          <p className="line-clamp-2 text-xs leading-5" style={{ color: 'var(--color-subtitle-1)' }}>{getProductDescription(product.description)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {formatPrice(product.price, product.currencyCode ?? 'USD')}
            <span className="ml-1 text-xs font-medium" style={{ color: 'var(--color-subtitle-2)' }}>/ {product.unit}</span>
          </p>

          <button
            aria-label={`${t('product.addToCart')}: ${product.name}`}
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full p-2.5 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={handleAddToCart}
            style={{ backgroundColor: 'var(--color-secondary)', color: '#ffffff' }}
            type="button"
          >
            <FiShoppingCart aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};
